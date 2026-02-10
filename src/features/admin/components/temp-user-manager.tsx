'use client'

import { useState } from 'react'
import { createTempUser } from '@/features/user/actions/admin'
import { QRCodeSVG } from 'qrcode.react'
import { UserAdminTable } from '@/features/admin/components/user-admin-table'
import { DeleteUserButton } from '@/features/admin/components/delete-user-button'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'

export function TempUserManager({ tempUsers }: { tempUsers: any[] }) {
    const [createdUser, setCreatedUser] = useState<{ name: string, link: string } | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const { t } = useLanguage()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const fullName = formData.get('fullName') as string

        if (!fullName.trim()) return

        setIsLoading(true)
        setError('')
        setCreatedUser(null)

        const res = await createTempUser(fullName)

        setIsLoading(false)
        if (res.success && res.link && res.fullName) {
            setCreatedUser({ name: res.fullName, link: res.link })
                // Clear input
                ; (event.target as HTMLFormElement).reset()
            router.refresh()
        } else {
            setError(res.message || 'Failed to create user')
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">{t('create_temp_user')}</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="fullName" className="font-medium">{t('full_name')}</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                required
                                className="border p-2 rounded bg-transparent dark:border-gray-600"
                                placeholder={t('enter_guest_name')}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700 disabled:opacity-50"
                        >
                            {isLoading ? t('creating') : t('create_generate_qr')}
                        </button>
                        {error && <p className="text-red-500">{error}</p>}
                    </form>
                </div>

                {createdUser && (
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg flex flex-col items-center animate-in fade-in slide-in-from-top-4">
                        <h3 className="text-xl font-bold mb-2 text-green-600">{t('user_created')}</h3>
                        <p className="text-lg font-medium mb-4">{createdUser.name}</p>
                        <div className="bg-white p-4 rounded-lg">
                            <QRCodeSVG value={createdUser.link} size={256} />
                        </div>
                        <p className="text-sm text-gray-500 mt-4 text-center">
                            {t('scan_to_login', { name: createdUser.name })}
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">{t('temp_users')}</h2>
                <UserAdminTable
                    data={tempUsers}
                    columns={[
                        { header: t('full_name'), accessor: 'full_name' },
                        {
                            header: t('created_at'),
                            accessor: (row: any) => new Date(row.created_at).toLocaleString(),
                            className: 'text-sm text-gray-500'
                        },
                        {
                            header: t('has_logged_in'),
                            accessor: (row: any) => row.last_login_at ? t('yes') : t('no'),
                        },
                        { header: t('actions'), accessor: (row: any) => <DeleteUserButton userId={row.id} /> },
                    ]}
                    emptyMessage={t('no_temp_users_found')}
                />
            </div>
        </div>
    )
}
