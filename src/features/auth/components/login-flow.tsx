'use client';

import { useState } from 'react';

import { LoginForm } from '@/features/auth/components/login-form';
import { OtpForm } from '@/features/auth/components/otp-form';

export function LoginFlow() {
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [email, setEmail] = useState('');

  const handleLoginSuccess = (email: string) => {
    setEmail(email);
    setStep('otp');
  };

  if (step === 'otp') {
    return <OtpForm email={email} />;
  }

  return <LoginForm onSuccess={handleLoginSuccess} />;
}
