'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LogoutButton } from '@/features/auth/components/logout-button';
import { AdminTabs } from '@/features/admin/components/admin-tabs';
import { UserAdminTable } from '@/features/admin/components/user-admin-table';
import { DeleteUserButton } from '@/features/admin/components/delete-user-button';
import { DeleteAllUsersButton } from '@/features/admin/components/delete-all-users-button';
import { AddUserForm } from '@/features/admin/components/add-user-form';
import { CsvUploadForm } from '@/features/admin/components/csv-upload-form';
import { AdminVotingTab } from '@/features/admin/components/admin-voting-tab';
import { TempUserManager } from '@/features/admin/components/temp-user-manager';
import { AdminManagementTab } from '@/features/admin/components/admin-management-tab';
import { VoteQuotaEditor } from '@/features/admin/components/vote-quota-editor';
import { isToday } from '@/features/voting/utils/date-utils';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  last_login_at: string | null;
  role: string;
  vote_quota?: number;
  created_at: string;
}

interface AdminRow extends Profile {
  last_login_at_formatted: string;
  role_label: React.ReactNode;
  attended_label: React.ReactNode;
}

interface UserRow extends AdminRow {
  vote_quota_editor: React.ReactNode;
  delete_button: React.ReactNode;
}

interface AdminDashboardProps {
  currentTab: string;
  admins: Profile[];
  regularUsers: Profile[];
  tempUsers: Profile[];
}

export function AdminDashboard({
  currentTab,
  admins,
  regularUsers,
  tempUsers,
}: AdminDashboardProps) {
  const { t } = useLanguage();

  const translatedAdmins = admins.map((admin) => ({
    ...admin,
    last_login_at_formatted: admin.last_login_at
      ? new Date(admin.last_login_at).toLocaleString()
      : t('never'),
    role_label: <span className="capitalize">{admin.role}</span>,
    attended_label: isToday(admin.last_login_at) ? (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
        {t('yes')}
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
        {t('no')}
      </span>
    ),
  }));

  const translatedUsers = regularUsers.map((user) => ({
    ...user,
    last_login_at_formatted: user.last_login_at
      ? new Date(user.last_login_at).toLocaleString()
      : t('never'),
    role_label: <span className="capitalize">{user.role}</span>,
    vote_quota_editor: (
      <VoteQuotaEditor userId={user.id} initialQuota={user.vote_quota || 1} />
    ),
    attended_label: isToday(user.last_login_at) ? (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
        {t('yes')}
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
        {t('no')}
      </span>
    ),
    delete_button: <DeleteUserButton userId={user.id} />,
  }));

  return (
    <div className="relative flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="mb-8 flex w-full max-w-6xl items-center justify-between">
        <h1 className="text-3xl font-bold md:text-4xl">
          {t('admin_dashboard')}
        </h1>
        <LogoutButton />
      </div>

      <div className="w-full max-w-6xl">
        <AdminTabs />

        {currentTab === 'voting' ? (
          <AdminVotingTab />
        ) : currentTab === 'add-users' ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <AddUserForm />
            <CsvUploadForm />
          </div>
        ) : currentTab === 'temp-users' ? (
          <TempUserManager tempUsers={tempUsers} />
        ) : currentTab === 'management' ? (
          <AdminManagementTab />
        ) : (
          <div className="space-y-12">
            {/* Admins Table */}
            <section className="rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold">{t('admins')}</h2>
              <UserAdminTable
                data={translatedAdmins}
                columns={[
                  { header: t('full_name'), accessor: 'full_name' },
                  { header: t('email'), accessor: 'email' },
                  {
                    header: t('last_login'),
                    accessor: (row: AdminRow) => row.last_login_at_formatted,
                    className:
                      'py-3 px-4 text-sm text-gray-500 dark:text-gray-400',
                  },
                  {
                    header: t('role'),
                    accessor: (row: AdminRow) => row.role_label,
                  },
                  {
                    header: t('attended'),
                    accessor: (row: AdminRow) => row.attended_label,
                  },
                ]}
                emptyMessage={t('no_admins_found')}
              />
            </section>

            {/* Users Table */}
            <section className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t('users')}</h2>
                {regularUsers.length > 0 && <DeleteAllUsersButton />}
              </div>
              <UserAdminTable
                data={translatedUsers}
                columns={[
                  { header: t('full_name'), accessor: 'full_name' },
                  { header: t('email'), accessor: 'email' },
                  {
                    header: t('last_login'),
                    accessor: (row: UserRow) => row.last_login_at_formatted,
                    className:
                      'py-3 px-4 text-sm text-gray-500 dark:text-gray-400',
                  },
                  {
                    header: t('votes_admin'),
                    accessor: (row: UserRow) => row.vote_quota_editor,
                  },
                  {
                    header: t('attended'),
                    accessor: (row: UserRow) => row.attended_label,
                  },
                  {
                    header: t('actions'),
                    accessor: (row: UserRow) => row.delete_button,
                  },
                ]}
                emptyMessage={t('no_users_found')}
              />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
