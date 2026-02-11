'use client'

import { useActionState } from 'react'
import { verifyOtp } from '@/features/auth/actions'
import { useLanguage } from '@/context/LanguageContext'
import { Card } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { InputWithIcon } from '@/components/ui/input-with-icon'
import { KeypadIcon } from '@/components/ui/icons'
import { InfoBox } from '@/components/ui/info-box'

export function OtpForm({ email }: { email: string }) {
  const initialState = {
    message: '',
    success: false
  };
  const [state, formAction, isPending] = useActionState(verifyOtp, initialState);
  const { t } = useLanguage();

  return (
    <Card className="w-full max-w-md flex flex-col items-center gap-6">
      <h1 className="text-3xl font-semibold">{t('verification_code')}</h1>
      <InfoBox>
        {t('verification_code_info', { email })}
      </InfoBox>
      <Form action={formAction}>
        <input type="hidden" name="email" value={email} />
        <div className="flex flex-col gap-2">
          <label htmlFor="token" className="font-medium">{t('verification_code')}</label>
          <InputWithIcon
            type="text"
            id="token"
            name="token"
            required
            pattern="\d{8}"
            maxLength={8}
            icon={<KeypadIcon className="w-5 h-5" />}
            placeholder={t('enter_8_digit_code')}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? t('verifying') : t('verify')}
        </Button>
        {state?.message && (
          <p className={`mt-4 text-lg font-semibold ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </Form>
    </Card>
  );
}
