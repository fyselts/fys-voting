'use client'

import { deleteAllUsers } from '@/features/user/actions/admin'
import { useTransition } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export function DeleteAllUsersButton() {
    const [isPending, startTransition] = useTransition()
    const { t } = useLanguage()

    return (
        <button
            onClick={() => {
                if (confirm(t('delete_all_confirm'))) {
                    startTransition(() => deleteAllUsers())
                }
            }}
            disabled={isPending}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-red-400 font-bold"
        >
            {isPending ? t('deleting_all') : t('delete_all_users')}
        </button>
    )
}
