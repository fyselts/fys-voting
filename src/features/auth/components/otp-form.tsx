'use client'

import { useActionState } from 'react'
import { verifyOtp } from '@/features/auth/actions'
import { useLanguage } from '@/context/LanguageContext'

const initialState = {
    message: '',
    success: false
}

export function OtpForm({ email }: { email: string }) {
    const [state, formAction, isPending] = useActionState(verifyOtp, initialState)
    const { t } = useLanguage()

    return (
        <form action={formAction} className="flex flex-col gap-4 w-full max-w-md">
            <input type="hidden" name="email" value={email} />
            <div className="flex flex-col gap-2">
                <label htmlFor="token" className="font-medium">{t('verification_code')}</label>
                <input
                    type="text"
                    id="token"
                    name="token"
                    required
                    pattern="\d{8}"
                    maxLength={8}
                    className="border p-2 rounded text-white font-semibold"
                    placeholder={t('enter_8_digit_code')}
                />
            </div>
            <button
                type="submit"
                disabled={isPending}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-green-300"
            >
                {isPending ? t('verifying') : t('verify')}
            </button>
            {state?.message && (
                <p className={`mt-4 text-lg font-semibold ${state.success ? 'text-green-600' : 'text-red-600'}`}>
                    {state.message}
                </p>
            )}
        </form>
    )
}
