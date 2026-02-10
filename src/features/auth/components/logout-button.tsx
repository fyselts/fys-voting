'use client'

import { logout } from '@/features/auth/actions'
import { useLanguage } from '@/context/LanguageContext'

export function LogoutButton() {
    const { t } = useLanguage()

    return (
        <form action={logout}>
            <button
                type="submit"
                className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
            >
                {t('logout')}
            </button>
        </form>
    )
}
