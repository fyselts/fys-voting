'use client';

import { useState, useTransition } from 'react';
import { updateVoteQuota } from '@/features/user/actions/admin';
import { useLanguage } from '@/context/LanguageContext';

interface VoteQuotaEditorProps {
  userId: string;
  initialQuota: number;
}

export function VoteQuotaEditor({
  userId,
  initialQuota,
}: VoteQuotaEditorProps) {
  const [quota, setQuota] = useState(initialQuota);
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [tempQuota, setTempQuota] = useState(initialQuota);
  const { t } = useLanguage();

  const handleSave = () => {
    if (tempQuota < 1) return;
    startTransition(async () => {
      const result = await updateVoteQuota(userId, tempQuota);
      if (result.success) {
        setQuota(tempQuota);
        setIsEditing(false);
      } else {
        alert(t('update_quota_failed'));
      }
    });
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          value={tempQuota}
          onChange={(e) => setTempQuota(parseInt(e.target.value))}
          className="w-16 rounded border p-1 text-sm dark:border-zinc-600 dark:bg-zinc-700"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') setIsEditing(false);
          }}
        />
        <button
          onClick={handleSave}
          disabled={isPending}
          className="text-green-600 hover:text-green-800 disabled:opacity-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
        <button
          onClick={() => setIsEditing(false)}
          disabled={isPending}
          className="text-red-500 hover:text-red-700"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        setTempQuota(quota);
        setIsEditing(true);
      }}
      className="group flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
      title={t('click_to_edit')}
    >
      <span>{quota}</span>
      <svg
        className="h-3 w-3 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    </div>
  );
}
