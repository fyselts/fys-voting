'use client';

import { useState } from 'react';
import { LoginForm } from '@/features/auth/components/login-form';
import { OtpForm } from '@/features/auth/components/otp-form';

export default function Home() {
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [email, setEmail] = useState('');

  const handleLoginSuccess = (email: string) => {
    setEmail(email);
    setStep('otp');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      {step === 'login' ? (
        <LoginForm onSuccess={handleLoginSuccess} />
      ) : (
        <OtpForm email={email} />
      )}
    </div>
  );
}
