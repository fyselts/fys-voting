'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';

export function QRCodeDisplay() {
  const [origin] = useState(() =>
    typeof window !== 'undefined' ? window.location.origin : ''
  );
  const { t } = useLanguage();

  if (!origin) return null;

  return (
    <div className="flex w-fit flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-md">
      <QRCodeSVG value={origin} size={256} />
      <p className="text-sm text-gray-500">{t('scan_to_vote')}</p>
    </div>
  );
}
