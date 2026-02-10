import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'

export async function getSession() {
    // In Next 15/16 cookies() is async, make sure to await it.
    const cookieStore = await cookies()
    const token = cookieStore.get('session_token')?.value

    if (!token) return null

    const supabase = getSupabaseClient()

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) return null

    return user
}

export async function getUserRole(email: string) {
    const supabase = getSupabaseClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', email)
        .single()

    return profile?.role
}

export async function requireAuth(allowedRole?: 'admin' | 'user') {
    const user = await getSession()

    if (!user) {
        redirect('/')
    }

    if (allowedRole && user.email) {
        const role = await getUserRole(user.email)
        if (role !== allowedRole) {
            if (role === 'admin') redirect('/admin')
            if (role === 'user') redirect('/user')
            redirect('/')
        }
        return { user, role }
    }

    return { user }
}
