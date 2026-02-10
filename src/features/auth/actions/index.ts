'use server'

import { getSupabaseClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface ActionState {
    success: boolean
    message: string
    email?: string
}

async function updateLastLogin(email: string) {
    const supabase = getSupabaseClient()

    const { error } = await supabase
        .from('profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('email', email)

    if (error) {
        throw error
    }
}

function doesUserExist(profiles: { full_name: string }[], fullName: string): boolean {
    return profiles.some(
        (profile) => profile.full_name.toLowerCase() === fullName.toLowerCase()
    )
}

export async function checkUser(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string

    const supabase = getSupabaseClient()

    const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)

    if (error) {
        throw error
    }

    if (profiles && doesUserExist(profiles, fullName)) {
        const { error: authError } = await supabase.auth.signInWithOtp({
            email: email.trim(),
        })

        if (authError) throw authError

        return { success: true, message: `User exists: ${fullName}`, email }
    }

    return { success: false, message: 'User does not exist' }
}

export async function verifyOtp(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const email = formData.get('email') as string
    const token = formData.get('token') as string

    const supabase = getSupabaseClient()

    const { error, data } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
    })

    if (error) {
        return { success: false, message: error.message }
    }

    if (data.session) {
        const cookieStore = await cookies()

        cookieStore.set('session_token', data.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })

        // Fetch role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('email', email)
            .single()

        const role = profile?.role || 'user'

        await updateLastLogin(email)

        if (role === 'admin') {
            redirect('/admin')
        } else {
            redirect('/user')
        }
    }

    return { success: true, message: 'Login successful' }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('session_token')
    redirect('/')
}

export async function setSession(accessToken: string) {
    const cookieStore = await cookies()
    cookieStore.set('session_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    })
    return { success: true }
}
