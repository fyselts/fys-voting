'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'

export function AdminTabs() {
    const searchParams = useSearchParams()
    const currentTab = searchParams.get('tab') || 'overview'
    const { t } = useLanguage()

    return (
        <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-1">
            <Link
                href="/admin?tab=overview"
                className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${currentTab === 'overview'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
            >
                {t('overview')}
            </Link>
            <Link
                href="/admin?tab=add-users"
                className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${currentTab === 'add-users'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
            >
                {t('add_users_tab')}
            </Link>
            <Link
                href="/admin?tab=temp-users"
                className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${currentTab === 'temp-users'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
            >
                {t('temp_users_tab')}
            </Link>
            <Link
                href="/admin?tab=voting"
                className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${currentTab === 'voting'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
            >
                {t('voting_tab')}
            </Link>
            <Link
                href="/admin?tab=management"
                className={`pb-2 px-4 font-medium transition-colors whitespace-nowrap ${currentTab === 'management'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
            >
                {t('management_tab')}
            </Link>
        </div>
    )
}
