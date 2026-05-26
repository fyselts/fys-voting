'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useLanguage } from '@/context/LanguageContext';

export function AdminTabs() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') ?? 'overview';
  const { t } = useLanguage();

  return (
    <div className="mb-8 flex space-x-4 overflow-x-auto border-b border-gray-200 pb-1 dark:border-gray-700">
      <Link
        href="/admin?tab=overview"
        className={`px-4 pb-2 font-medium whitespace-nowrap transition-colors ${
          currentTab === 'overview'
            ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
      >
        {t('overview')}
      </Link>
      <Link
        href="/admin?tab=add-users"
        className={`px-4 pb-2 font-medium whitespace-nowrap transition-colors ${
          currentTab === 'add-users'
            ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
      >
        {t('add_users_tab')}
      </Link>
      <Link
        href="/admin?tab=temp-users"
        className={`px-4 pb-2 font-medium whitespace-nowrap transition-colors ${
          currentTab === 'temp-users'
            ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
      >
        {t('temp_users_tab')}
      </Link>
      <Link
        href="/admin?tab=voting"
        className={`px-4 pb-2 font-medium whitespace-nowrap transition-colors ${
          currentTab === 'voting'
            ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
      >
        {t('voting_tab')}
      </Link>
      <Link
        href="/admin?tab=management"
        className={`px-4 pb-2 font-medium whitespace-nowrap transition-colors ${
          currentTab === 'management'
            ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
      >
        {t('management_tab')}
      </Link>
    </div>
  );
}
