'use client';

import { deleteUser } from '@/features/user/actions/admin';
import { useTransition } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function DeleteUserButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();

  return (
    <button
      onClick={() => startTransition(() => deleteUser(userId))}
      disabled={isPending}
      className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 disabled:bg-red-300"
    >
      {isPending ? t('deleting') : t('delete')}
    </button>
  );
}
