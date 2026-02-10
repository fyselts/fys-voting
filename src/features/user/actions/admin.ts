'use server'

import { getSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/features/auth/lib/auth'

interface ActionState {
    success: boolean
    message: string
}

export async function deleteUser(userId: string) {
    await requireAuth('admin')
    const supabase = getSupabaseClient()

    // 1. Delete from profiles first to avoid FK constraints
    const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId)
    if (profileError) {
        console.error('Error deleting profile:', profileError)
        // Continue to try deleting auth user even if profile delete failed (maybe it was already gone)
    }

    // 2. Delete from auth.users
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)
    if (authError) {
        console.error('Error deleting auth user:', authError)
        // If both failed, throw error
        if (profileError) throw authError
    }

    revalidatePath('/admin')
}

export async function deleteAllUsers() {
    await requireAuth('admin')
    const supabase = getSupabaseClient()

    // 1. Get all users with role 'user'
    const { data: users, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'user')

    if (fetchError) throw fetchError
    if (!users || users.length === 0) return

    const userIds = users.map(u => u.id)

    // 2. Delete all profiles first (bulk delete)
    const { error: deleteProfilesError } = await supabase
        .from('profiles')
        .delete()
        .in('id', userIds)

    if (deleteProfilesError) {
        console.error('Error deleting profiles:', deleteProfilesError)
        throw deleteProfilesError
    }

    // 3. Delete each user from auth system
    // We do this after profiles are gone, so no FK constraints.
    const deletePromises = userIds.map(id => supabase.auth.admin.deleteUser(id))
    await Promise.all(deletePromises)

    revalidatePath('/admin')
}

export async function createUser(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    await requireAuth('admin')
    const supabase = getSupabaseClient()

    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string

    if (!fullName || !email) {
        return { success: false, message: 'Name and email are required' }
    }

    const { error } = await supabase
        .from('profiles')
        .insert([{ email, full_name: fullName, role: 'user' }])

    if (error) {
        console.error('Error creating user:', error)
        return { success: false, message: error.message }
    }

    revalidatePath('/admin')
    return { success: true, message: 'User created successfully' }
}

export async function createBulkUsers(users: { full_name: string; email: string }[]) {
    await requireAuth('admin')
    const supabase = getSupabaseClient()

    if (!users || users.length === 0) {
        return { success: false, message: 'No users to add' }
    }

    // Add role: 'user' to each
    const usersWithRole = users.map(u => ({ ...u, role: 'user' }))

    const { error } = await supabase
        .from('profiles')
        .insert(usersWithRole)

    if (error) {
        console.error('Error adding users:', error)
        return { success: false, message: error.message }
    }

    revalidatePath('/admin')
    return { success: true, count: users.length }
}

export async function createTempUser(fullName: string) {
    await requireAuth('admin')
    const supabase = getSupabaseClient()
    const { headers } = await import('next/headers')
    const origin = (await headers()).get('origin')

    // Generate unique temp email
    const id = crypto.randomUUID()
    const email = `temp_${id}@temp.fys-voting.com`

    // 1. Create auth user with auto-confirm
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: fullName }
    })

    if (authError) {
        console.error('Error creating auth user:', authError)
        return { success: false, message: authError.message }
    }

    // 2. Profile is created automatically by database trigger (handle_new_user)
    // We don't need to manually insert it. 
    // If we rely on the trigger, we ensure consistency.

    // 3. Generate Magic Link
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: {
            redirectTo: `${origin}/callback`
        }
    })

    if (linkError) {
        return { success: false, message: linkError.message }
    }

    revalidatePath('/admin')
    return { success: true, link: linkData.properties.action_link, email, fullName }
}

export async function updateVoteQuota(userId: string, newQuota: number) {
    await requireAuth('admin')
    const supabase = getSupabaseClient()

    if (newQuota < 1) {
        return { success: false, message: 'Quota must be at least 1' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({ vote_quota: newQuota })
        .eq('id', userId)

    if (error) {
        console.error('Error updating vote quota:', error)
        return { success: false, message: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}

