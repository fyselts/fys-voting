'use client';

import { useTransition } from 'react';
import * as XLSX from 'xlsx';
import { getExportData } from '@/features/admin/actions/export';
import { useLanguage } from '@/context/LanguageContext';

import { isToday } from '@/features/voting/utils/date-utils';

interface ExportUser {
  full_name: string;
  email: string;
  role: string;
  vote_quota?: number;
  last_login_at?: string | null;
}

interface VotingResult {
  name: string;
  vote_count: number;
}

export function AdminManagementTab() {
  const [isExporting, startTransition] = useTransition();
  const { t } = useLanguage();

  const handleResetAll = () => {
    alert(t('reset_all'));
  };

  const handleExportData = () => {
    startTransition(async () => {
      try {
        const data = await getExportData();

        // 1. Prepare All Users Data
        const allUsersData = data.allUsers.map((user: ExportUser) => ({
          [t('full_name')]: user.full_name,
          [t('email')]: user.email,
          [t('role')]: user.role,
          [t('votes_admin')]: user.vote_quota || 1,
          [t('last_login')]: user.last_login_at
            ? new Date(user.last_login_at).toLocaleString()
            : t('never'),
          [`${t('attended')} Today`]: isToday(user.last_login_at)
            ? t('yes')
            : t('no'),
        }));

        // 2. Prepare Temp Users Data
        const tempUsersData = data.tempUsers.map((user: ExportUser) => ({
          [t('full_name')]: user.full_name,
          [t('email')]: user.email,
          [t('role')]: user.role,
          [t('votes_admin')]: user.vote_quota || 1,
          [t('last_login')]: user.last_login_at
            ? new Date(user.last_login_at).toLocaleString()
            : t('never'),
          [`${t('attended')} Today`]: isToday(user.last_login_at)
            ? t('yes')
            : t('no'),
        }));

        // 3. Prepare Voting Results Data
        const votingResultsData = data.votingResults.map(
          (option: VotingResult) => ({
            [t('option_name')]: option.name,
            [t('votes_admin')]: option.vote_count,
          })
        );

        // Create Workbook
        const wb = XLSX.utils.book_new();

        // Add Sheets
        const wsAllUsers = XLSX.utils.json_to_sheet(allUsersData);
        XLSX.utils.book_append_sheet(wb, wsAllUsers, t('sheet_all_users'));

        const wsTempUsers = XLSX.utils.json_to_sheet(tempUsersData);
        XLSX.utils.book_append_sheet(wb, wsTempUsers, t('sheet_temp_users'));

        const wsVotingResults = XLSX.utils.json_to_sheet(votingResultsData);
        XLSX.utils.book_append_sheet(
          wb,
          wsVotingResults,
          t('sheet_voting_results')
        );

        // Generate Excel File
        XLSX.writeFile(
          wb,
          `fys_voting_export_${new Date().toISOString().split('T')[0]}.xlsx`
        );
      } catch (error) {
        console.error('Export failed:', error);
        alert(t('export_failed'));
      }
    });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold">{t('management_actions')}</h2>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={handleResetAll}
            className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white shadow-sm transition-colors hover:bg-red-700"
          >
            {t('reset_all')}
          </button>

          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 py-3 font-bold text-white shadow-sm transition-colors hover:bg-[color:rgba(0,8,125,0.85)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {t('exporting')}
              </>
            ) : (
              t('export_data')
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
