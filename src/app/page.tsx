'use client'

import { useState } from 'react'
import { LoginForm } from '@/features/auth/components/login-form'
import { OtpForm } from '@/features/auth/components/otp-form'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageToggle } from '@/components/ui/language-toggle'

export default function Home() {
  const [step, setStep] = useState<'login' | 'otp'>('login')
  const [email, setEmail] = useState('')
  const { t } = useLanguage()

  const handleLoginSuccess = (email: string) => {
    setEmail(email)
    setStep('otp')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      <h1 className="text-4xl font-bold mb-8">
        {step === 'login' ? t('check_user') : t('verify_code')}
      </h1>

      {step === 'login' ? (
        <LoginForm onSuccess={handleLoginSuccess} />
      ) : (
        <OtpForm email={email} />
      )}

      <div className="mt-8">
        <Link href="/public" className="text-sm text-gray-200 hover:text-blue-400 hover:underline">
          {t('view_public_display')}
        </Link>
      </div>
    </div>
  )
}
