'use client'

import { useActionState } from 'react'
import { createUser } from '@/features/user/actions/admin'
import { useLanguage } from '@/context/LanguageContext'

const initialState = {
  message: '',
  success: false
}

export function AddUserForm() {
  const [state, formAction, isPending] = useActionState(createUser, initialState)
  const { t } = useLanguage()

  return (
    <form action={formAction} className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-2">{t('add_single_user')}</h3>
      <div className="flex flex-col gap-2">
        <label htmlFor="fullName" className="font-medium">{t('full_name')}</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          required
          className="border p-2 rounded"
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
          className="border p-2 rounded"
          placeholder={t('enter_email')}
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="bg-[var(--color-primary)] text-white p-2 rounded hover:bg-[color:rgba(0,8,125,0.85)] disabled:bg-gray-300"
      >
        {isPending ? t('adding') : t('add_user')}
      </button>
      {state?.message && (
        <p className={`mt-2 text-sm font-semibold ${state.success ? 'text-green-600' : 'text-red-600'}`}>
          {state.message}
        </p>
      )}
    </form>
  )
}
