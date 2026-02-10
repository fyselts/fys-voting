import { requireAuth } from '@/features/auth/lib/auth'
import { getSupabaseClient } from '@/lib/supabase'
import { AdminDashboard } from '@/features/admin/components/admin-dashboard'

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    await requireAuth('admin')
    const supabase = getSupabaseClient()
    const { tab } = await searchParams
    const currentTab = tab || 'overview'

    const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    const admins = profiles?.filter(p => p.role === 'admin') || []
    const allUsers = profiles?.filter(p => p.role === 'user') || []

    const regularUsers = allUsers.filter(p => !p.email.includes('@temp.fys-voting.com'))
    const tempUsers = allUsers.filter(p => p.email.includes('@temp.fys-voting.com'))

    admins.sort((a, b) => a.full_name.localeCompare(b.full_name))
    regularUsers.sort((a, b) => a.full_name.localeCompare(b.full_name))
    tempUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return (
        <AdminDashboard
            currentTab={currentTab}
            admins={admins}
            regularUsers={regularUsers}
            tempUsers={tempUsers}
        />
    )
}
