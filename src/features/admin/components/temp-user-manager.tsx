'use client';

import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';
import { DeleteUserButton } from '@/features/admin/components/delete-user-button';
import { UserAdminTable } from '@/features/admin/components/user-admin-table';
import { createTempUser } from '@/features/user/actions/admin';

interface TempUser {
  id: string;
  full_name: string;
  created_at: string;
  last_login_at: string | null;
}

export function TempUserManager({ tempUsers }: { tempUsers: TempUser[] }) {
  const [createdUser, setCreatedUser] = useState<{
    name: string;
    link: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fullName = formData.get('fullName') as string;

    if (!fullName.trim()) return;

    setIsLoading(true);
    setError('');
    setCreatedUser(null);

    const res = await createTempUser(fullName);

    setIsLoading(false);
    if (res.success && res.link && res.fullName) {
      setCreatedUser({ name: res.fullName, link: res.link });
      // Clear input
      (event.target as HTMLFormElement).reset();
      router.refresh();
    } else {
      setError(res.message ?? 'Failed to create user');
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="space-y-8">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold">{t('create_temp_user')}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="font-medium">
                {t('full_name')}
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                className="rounded border bg-transparent p-2 dark:border-gray-600"
                placeholder={t('enter_guest_name')}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded bg-purple-600 p-2 text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? t('creating') : t('create_generate_qr')}
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>

        {createdUser && (
          <div className="animate-in fade-in slide-in-from-top-4 flex flex-col items-center rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-xl font-bold text-green-600">
              {t('user_created')}
            </h3>
            <p className="mb-4 text-lg font-medium">{createdUser.name}</p>
            <div className="rounded-lg bg-white p-4">
              <QRCodeSVG value={createdUser.link} size={256} />
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">
              {t('scan_to_login', { name: createdUser.name })}
            </p>
          </div>
        )}
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">{t('temp_users')}</h2>
        <UserAdminTable
          data={tempUsers}
          columns={[
            { header: t('full_name'), accessor: 'full_name' },
            {
              header: t('created_at'),
              accessor: (row: TempUser) =>
                new Date(row.created_at).toLocaleString(),
              className: 'text-sm text-gray-500',
            },
            {
              header: t('has_logged_in'),
              accessor: (row: TempUser) =>
                row.last_login_at ? t('yes') : t('no'),
            },
            {
              header: t('actions'),
              accessor: (row: TempUser) => <DeleteUserButton userId={row.id} />,
            },
          ]}
          emptyMessage={t('no_temp_users_found')}
        />
      </div>
    </div>
  );
}
