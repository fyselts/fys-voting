'use server'

import { getSupabaseClient } from '@/lib/supabase'
import { requireAuth } from '@/features/auth/lib/auth'

export async function getExportData() {
    await requireAuth('admin')
    const supabase = getSupabaseClient()

    // 1. Fetch Profiles
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (profilesError) throw profilesError

    // 2. Fetch Voting Settings & Options
    const { data: options, error: optionsError } = await supabase
        .from('voting_options')
        .select('name, vote_count')
        .order('vote_count', { ascending: false })

    if (optionsError) throw optionsError

    // 3. Process Data
    const allUsers = profiles || []
    const tempUsers = allUsers.filter((p: { email: string }) => p.email.includes('@temp.fys-voting.com'))
    const votingResults = options || []

    return {
        allUsers,
        tempUsers,
        votingResults
    }
}
