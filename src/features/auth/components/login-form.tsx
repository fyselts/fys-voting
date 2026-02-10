'use client'

import { useActionState, useEffect } from 'react'
import { checkUser } from '@/features/auth/actions'
import { useLanguage } from '@/context/LanguageContext'

const initialState = {
    message: '',
    success: false,
    email: ''
}

export function LoginForm({ onSuccess }: { onSuccess: (email: string) => void }) {
    const [state, formAction, isPending] = useActionState(checkUser, initialState)
    const { t } = useLanguage()

    useEffect(() => {
        if (state?.success && state.email) {
            onSuccess(state.email)
        }
    }, [state, onSuccess])

    return (
        <form action={formAction} className="flex flex-col gap-4 w-full max-w-md">
            <div className="flex flex-col gap-2">
                <label htmlFor="fullName" className="font-medium">{t('full_name')}</label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    className="border p-2 rounded text-white font-semibold"
                    placeholder={t('enter_full_name')}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-medium">{t('email')}</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="border p-2 rounded text-white font-semibold"
                    placeholder={t('enter_email')}
                />
            </div>
            <button
                type="submit"
                disabled={isPending}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
                {isPending ? t('sending') : t('send')}
            </button>
            {state?.message && (
                <p className="mt-4 text-lg font-semibold">{state.message}</p>
            )}
        </form>
    )
}
