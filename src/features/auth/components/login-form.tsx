'use client'

import { useActionState, useEffect } from 'react'
import { checkUser } from '@/features/auth/actions'
import { useLanguage } from '@/context/LanguageContext'
import { Card } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { StyledLink } from '@/components/ui/styled-link'
import { InputWithIcon } from '@/components/ui/input-with-icon'
import { PersonIcon, AtIcon, ArrowRightIcon } from '@/components/ui/icons'

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
    <Card className="w-full max-w-md flex flex-col items-center gap-6">
      <h1 className="text-4xl font-semibold">
        {t('log_in')}
      </h1>
      <Form action={formAction}>
        <div className="flex flex-col gap-2">
          <label htmlFor="fullName">{t('full_name')}</label>
          <InputWithIcon
            type="text"
            id="fullName"
            name="fullName"
            required
            icon={<PersonIcon className="w-5 h-5" />}
            placeholder={t('enter_full_name')}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">{t('email')}</label>
          <InputWithIcon
            type="email"
            id="email"
            name="email"
            required
            icon={<AtIcon className="w-5 h-5" />}
            placeholder={t('enter_email')}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? t('sending') : t('send')}
        </Button>
        {state?.message && (
          <p className={`mt-4 text-lg text-center ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </Form>
      <StyledLink href="/public">
        {t('view_public_display')} <ArrowRightIcon className="w-4 h-4" />
      </StyledLink>
    </Card>
  )
}
