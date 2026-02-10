'use server'

import { getSupabaseClient } from '@/lib/supabase'
import { requireAuth } from '@/features/auth/lib/auth'
import { revalidatePath } from 'next/cache' // Unused

export async function getUserVotingState() {
    const { user } = await requireAuth('user')
    const supabase = getSupabaseClient()

    // 1. Get Voting Settings
    const { data: settings } = await supabase
        .from('voting_settings')
        .select('*')
        .single()

    // 2. Get User Profile for Quota
    const { data: profile } = await supabase
        .from('profiles')
        .select('vote_quota')
        .eq('email', user.email!)
        .single()

    const voteQuota = profile?.vote_quota || 1

    /*
    console.log(`User ${user.id} has a vote quota of ${voteQuota}`)
    */

    // 3. Count User's Votes
    const { count: votesUsed } = await supabase
        .from('voters')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    const used = votesUsed || 0
    const votesRemaining = Math.max(0, voteQuota - used)
    const hasVoted = votesRemaining === 0 // Lock UI if no votes left

    let options: { id: string, name: string, vote_count: number, created_at: string }[] = []

    if (settings?.is_published || (settings?.is_active && !hasVoted)) {
        const { data: opts } = await supabase
            .from('voting_options')
            .select('id, name, vote_count, created_at')
            .order('created_at', { ascending: true })
        options = opts || []
    }

    if (!settings?.is_published) {
        options = options.map(o => ({ ...o, vote_count: 0 })) // Hide counts
    }

    // 4. Get Total Voters
    const { count: totalVoters } = await supabase
        .from('voters')
        .select('*', { count: 'exact', head: true })

    const totalVotesCast = totalVoters || 0

    return {
        settings,
        options,
        hasVoted,
        votesRemaining,
        voteQuota,
        totalVotesCast
    }
}

export async function submitVote(optionIds: string[]) {
    const { user } = await requireAuth('user')
    const supabase = getSupabaseClient()

    // 1. Check if voting is active
    const { data: settings } = await supabase.from('voting_settings').select('*').single()
    if (!settings?.is_active) {
        return { success: false, message: 'Voting is not active' }
    }

    // 2. Check Vote Quota
    const { data: profile } = await supabase
        .from('profiles')
        .select('vote_quota')
        .eq('email', user.email!)
        .single()

    const voteQuota = profile?.vote_quota || 1

    const { count: votesUsed } = await supabase
        .from('voters')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    const used = votesUsed || 0

    if (used >= voteQuota) {
        return { success: false, message: 'You have used all your votes' }
    }

    // 3. Check max choices
    if (optionIds.length > settings.max_choices) {
        return { success: false, message: `You can only select up to ${settings.max_choices} options` }
    }

    // Check for empty vote exclusivity violations (backend safeguard)
    // We need to find the "Empty Vote" option ID if it's involved
    const { data: emptyOption } = await supabase
        .from('voting_options')
        .select('id')
        .eq('name', 'Empty Vote')
        .single()

    const emptyVoteId = emptyOption?.id

    if (emptyVoteId && optionIds.includes(emptyVoteId) && optionIds.length > 1) {
        return { success: false, message: 'You cannot select other options with an empty vote' }
    }

    // 4. Record vote
    // Log the vote in 'voters' table. Since we allow multiple votes, we insert a new row.
    // The PK is auto-generated uuid.

    const { error: voteError } = await supabase.from('voters').insert([{ user_id: user.id }])

    if (voteError) {
        console.error('Error recording vote:', voteError)
        return { success: false, message: 'Failed to record vote' }
    }

    // Increment counts for options
    for (const id of optionIds) {
        const { error } = await supabase.rpc('increment_vote', { option_id: id })
        if (error) {
            console.error('Error incrementing vote:', error)
        }
    }

    revalidatePath('/user')
    revalidatePath('/public')
    return { success: true, message: 'Vote submitted successfully' }
}
