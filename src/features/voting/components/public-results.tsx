'use client';

import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';
import { QRCodeDisplay } from '@/features/user/components/qr-code-display';
import { type VotingOption } from '@/features/voting/types';

interface PublicResultsProps {
  results: VotingOption[];
  emptyOption?: VotingOption | undefined;
  totalVotesCast: number;
  maxVotes: number;
  isPublished: boolean;
  dashboardHref?: string | undefined;
}

export function PublicResults({
  results,
  emptyOption,
  totalVotesCast,
  maxVotes,
  isPublished,
  dashboardHref,
}: PublicResultsProps) {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black">{t('join_vote')}</h1>
          <Link
            href={dashboardHref ?? '/'}
            className="rounded bg-[var(--color-primary)] px-4 py-2 text-white transition-colors hover:bg-[color:rgba(0,8,125,0.85)]"
          >
            {dashboardHref ? t('go_to_dashboard') : t('go_to_login')}
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center space-y-4">
            <QRCodeDisplay />
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-black">
              {t('results')}
            </h2>
            {isPublished ? (
              <div className="space-y-4">
                {results.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-black">{option.name}</span>
                      <span className="font-medium text-black">
                        {option.vote_count} {t('votes')}
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2.5 rounded-full bg-[var(--color-primary)] transition-all duration-500"
                        style={{
                          width: `${(option.vote_count / maxVotes) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
                {results.length === 0 && (
                  <p className="text-black">{t('no_standard_options')}</p>
                )}

                <div className="mt-8 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      {t('total_votes_cast', { total: '' }).replace(': ', '')}:
                    </span>
                    <span className="font-semibold text-black">
                      {totalVotesCast}
                    </span>
                  </div>
                  {emptyOption && emptyOption.vote_count > 0 && (
                    <div className="mt-1 flex justify-between text-sm text-gray-600">
                      <span>
                        {t('empty_votes', { count: '' }).replace(': ', '')}:
                      </span>
                      <span className="font-semibold text-black">
                        {emptyOption.vote_count}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-gray-500">
                <p className="text-lg text-black">{t('results_hidden')}</p>
                <p className="text-sm text-black">{t('voting_in_progress')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
