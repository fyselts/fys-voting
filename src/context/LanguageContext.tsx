'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, Language, TranslationKey } from '@/utils/translations'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: TranslationKey, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('et')

    useEffect(() => {
        const savedLang = localStorage.getItem('app-language') as Language
        if (savedLang && (savedLang === 'en' || savedLang === 'et')) {
            setLanguageState(savedLang)
        }
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem('app-language', lang)
    }

    const t = (key: TranslationKey, params?: Record<string, string | number>) => {
        const text = translations[language][key] || key
        if (!params) return text

        return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
            return acc.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue))
        }, text)
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
