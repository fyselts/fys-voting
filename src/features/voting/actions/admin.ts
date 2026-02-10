'use server'

import { getSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/features/auth/lib/auth'

export async function getVotingState() {
    const supabase = getSupabaseClient()

    const { data: settings } = await supabase
        .from('voting_settings')
        .select('*')
        .single()

    const { data: options } = await supabase
        .from('voting_options')
        .select('*')
        .order('created_at', { ascending: true })

    const { count: votersCount } = await supabase
        .from('voters')
        .select('*', { count: 'exact', head: true })

    return {
        settings,
        options: options || [],
        votersCount: votersCount || 0
    }
}

export async function updateVotingSettings(title: string, maxChoices: number) {
    await requireAuth('admin')
    const supabase = getSupabaseClient()

    const { error } = await supabase
        .from('voting_settings')
        .update({ title, max_choices: maxChoices })
        .eq('id', 1)

    if (error) throw error
    revalidatePath('/admin')
}

export async function addOption(name: string) {
    await requireAuth('admin')
    const supabase = getSupabaseClient()

    const { error } = await supabase
        .from('voting_options')
        .insert([{ name }])

    if (error) throw error
    revalidatePath('/admin')
}

export async function deleteOption(id: string) {
    await requireAuth('admin')
    const supabase = getSupabaseClient()

    const { error } = await supabase
        .from('voting_options')
        .delete()
        .eq('id', id)

    if (error) throw error
    revalidatePath('/admin')
}

export async function toggleVotingStatus(isActive: boolean) {
    await requireAuth('admin')
    const supabase = getSupabaseClient()

    const { error } = await supabase
        .from('voting_settings')
        .update({ is_active: isActive })
        .eq('id', 1)

    if (error) throw error
    revalidatePath('/admin')
    revalidatePath('/user')
}

export async function togglePublishStatus(isPublished: boolean) {
    await requireAuth('admin')
    const supabase = getSupabaseClient()

    const { error } = await supabase
        .from('voting_settings')
        .update({ is_published: isPublished })
        .eq('id', 1)

    if (error) throw error
    revalidatePath('/admin')
    revalidatePath('/user')
}

export async function resetVoting() {
    await requireAuth('admin')
    const supabase = getSupabaseClient()

    // Implement reset logic: clear voters? clear vote counts?
    // Assuming clearing voters and resetting counts.
    const { error: deleteVotersError } = await supabase
        .from('voters')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (deleteVotersError) throw deleteVotersError

    const { error: resetOptionsError } = await supabase
        .from('voting_options')
        .update({ vote_count: 0 })
        .neq('id', '00000000-0000-0000-0000-000000000000') // Reset all

    if (resetOptionsError) throw resetOptionsError

    revalidatePath('/admin')
}
