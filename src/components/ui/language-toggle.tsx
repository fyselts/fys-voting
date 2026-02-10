'use client'

import { useLanguage } from '@/context/LanguageContext'

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage()

    return (
        <div className="flex gap-2 text-sm font-medium">
            <button
                onClick={() => setLanguage('et')}
                className={`px-2 py-1 rounded transition-colors ${language === 'et'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600'
                    }`}
            >
                ET
            </button>
            <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded transition-colors ${language === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600'
                    }`}
            >
                EN
            </button>
        </div>
    )
}
