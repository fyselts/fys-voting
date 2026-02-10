'use client'

import { useState } from 'react'
import { LoginForm } from '@/features/auth/components/login-form'
import { OtpForm } from '@/features/auth/components/otp-form'
import { useLanguage } from '@/context/LanguageContext'

export default function Home() {
  const [step, setStep] = useState<'login' | 'otp'>('login')
  const [email, setEmail] = useState('')

  const handleLoginSuccess = (email: string) => {
    setEmail(email)
    setStep('otp')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      {step === 'login' ? (
        <LoginForm onSuccess={handleLoginSuccess} />
      ) : (
        <OtpForm email={email} />
      )}
    </div>
  )
}
