'use client'

import { useLanguage } from '@/context/LanguageContext'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { LogoutButton } from '@/features/auth/components/logout-button'
import { AdminTabs } from '@/features/admin/components/admin-tabs'
import { UserAdminTable } from '@/features/admin/components/user-admin-table'
import { DeleteUserButton } from '@/features/admin/components/delete-user-button'
import { DeleteAllUsersButton } from '@/features/admin/components/delete-all-users-button'
import { AddUserForm } from '@/features/admin/components/add-user-form'
import { CsvUploadForm } from '@/features/admin/components/csv-upload-form'
import { AdminVotingTab } from '@/features/admin/components/admin-voting-tab'
import { TempUserManager } from '@/features/admin/components/temp-user-manager'
import { AdminManagementTab } from '@/features/admin/components/admin-management-tab'
import { VoteQuotaEditor } from '@/features/admin/components/vote-quota-editor'
import { isToday } from '@/features/voting/utils/date-utils'

interface AdminDashboardProps {
    currentTab: string
    admins: any[]
    regularUsers: any[]
    tempUsers: any[]
}

export function AdminDashboard({ currentTab, admins, regularUsers, tempUsers }: AdminDashboardProps) {
    const { t } = useLanguage()

    const translatedAdmins = admins.map(admin => ({
        ...admin,
        last_login_at_formatted: admin.last_login_at ? new Date(admin.last_login_at).toLocaleString() : t('never'),
        role_label: <span className="capitalize">{admin.role}</span>,
        attended_label: isToday(admin.last_login_at)
            ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{t('yes')}</span>
            : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{t('no')}</span>
    }))

    const translatedUsers = regularUsers.map(user => ({
        ...user,
        last_login_at_formatted: user.last_login_at ? new Date(user.last_login_at).toLocaleString() : t('never'),
        role_label: <span className="capitalize">{user.role}</span>,
        vote_quota_editor: <VoteQuotaEditor userId={user.id} initialQuota={user.vote_quota || 1} />,
        attended_label: isToday(user.last_login_at)
            ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{t('yes')}</span>
            : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{t('no')}</span>,
        delete_button: <DeleteUserButton userId={user.id} />
    }))

    return (
        <div className="flex min-h-screen flex-col items-center p-8 md:p-24 relative">
            <div className="absolute top-4 right-4 text-black">
                <LanguageToggle />
            </div>
            <div className="w-full max-w-6xl flex justify-between items-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold">{t('admin_dashboard')}</h1>
                <LogoutButton />
            </div>

            <div className="w-full max-w-6xl">
                <AdminTabs />

                {currentTab === 'voting' ? (
                    <AdminVotingTab />
                ) : currentTab === 'add-users' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AddUserForm />
                        <CsvUploadForm />
                    </div>
                ) : currentTab === 'temp-users' ? (
                    <TempUserManager tempUsers={tempUsers} />
                ) : currentTab === 'management' ? (
                    <AdminManagementTab />
                ) : (
                    <div className="space-y-12">
                        {/* Admins Table */}
                        <section className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">{t('admins')}</h2>
                            <UserAdminTable
                                data={translatedAdmins}
                                columns={[
                                    { header: t('full_name'), accessor: 'full_name' },
                                    { header: t('email'), accessor: 'email' },
                                    { header: t('last_login'), accessor: (row: any) => row.last_login_at_formatted, className: 'py-3 px-4 text-sm text-gray-500 dark:text-gray-400' },
                                    { header: t('role'), accessor: (row: any) => row.role_label },
                                    { header: t('attended'), accessor: (row: any) => row.attended_label },
                                ]}
                                emptyMessage={t('no_admins_found')}
                            />
                        </section>

                        {/* Users Table */}
                        <section className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">{t('users')}</h2>
                                {regularUsers.length > 0 && <DeleteAllUsersButton />}
                            </div>
                            <UserAdminTable
                                data={translatedUsers}
                                columns={[
                                    { header: t('full_name'), accessor: 'full_name' },
                                    { header: t('email'), accessor: 'email' },
                                    { header: t('last_login'), accessor: (row: any) => row.last_login_at_formatted, className: 'py-3 px-4 text-sm text-gray-500 dark:text-gray-400' },
                                    { header: t('votes_admin'), accessor: (row: any) => row.vote_quota_editor },
                                    { header: t('attended'), accessor: (row: any) => row.attended_label },
                                    { header: t('actions'), accessor: (row: any) => row.delete_button },
                                ]}
                                emptyMessage={t('no_users_found')}
                            />
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}
