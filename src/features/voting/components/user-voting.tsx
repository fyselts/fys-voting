'use client';

import { useState, useTransition } from 'react';
import { submitVote } from '@/features/voting/actions/user';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { VotingSettings, VotingOption } from '@/features/voting/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UserVotingProps {
  initialState: {
    settings: VotingSettings | null;
    options: VotingOption[];
    hasVoted: boolean;
    votesRemaining: number;
    voteQuota: number;
    totalVotesCast?: number;
    emptyVotes?: number;
  };
}

export function UserVoting({ initialState }: UserVotingProps) {
  const {
    settings,
    options,
    hasVoted,
    votesRemaining,
    voteQuota,
    totalVotesCast = 0,
  } = initialState;
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const { t } = useLanguage();

  // Find Empty Vote option
  const emptyOption = options.find((o) => o.name === 'Empty Vote');
  const EMPTY_OPTION_ID = emptyOption?.id;

  // Valid options are those that are NOT the Empty Vote option
  const standardOptions = options.filter((o) => o.name !== 'Empty Vote');

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  if (!settings) return <div>{t('loading')}</div>;

  // Case 1: Voting is not active and not published
  if (!settings.is_active && !settings.is_published) {
    return (
      <Card className="w-full max-w-md text-center">
        <h2 className="mb-2 text-2xl font-bold">{t('no_active_voting')}</h2>
        <p className="text-gray-600">{t('wait_for_admin')}</p>
      </Card>
    );
  }

  // Case 2: Voting is published (Results)
  if (settings.is_published) {
    const totalOptionVotes = options.reduce(
      (acc, curr) => acc + (curr.vote_count || 0),
      0
    );

    // Use totalVotesCast from DB, fallback to sum of options
    const totalVotes = totalVotesCast > 0 ? totalVotesCast : totalOptionVotes;

    // Sort standard options by vote count
    const sortedStandardOptions = [...standardOptions].sort(
      (a, b) => (b.vote_count || 0) - (a.vote_count || 0)
    );

    return (
      <Card className="w-full max-w-md">
        <h2 className="mb-6 text-center text-2xl font-bold">
          {settings.title} - {t('results')}
        </h2>
        <div className="space-y-4">
          {sortedStandardOptions.map((option) => {
            const count = option.vote_count || 0;
            const percentage =
              totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            return (
              <div key={option.id} className="space-y-1">
                <div className="flex justify-between text-sm font-medium">
                  <span>{option.name}</span>
                  <span>
                    {count} {t('votes')} ({percentage}%)
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2.5 rounded-full bg-[var(--color-primary)] transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 space-y-1 text-center text-sm text-gray-500">
          <p>{t('total_votes_cast', { total: totalVotes })}</p>
          {emptyOption && emptyOption.vote_count > 0 && (
            <p>{t('empty_votes', { count: emptyOption.vote_count })}</p>
          )}
        </div>
      </Card>
    );
  }

  // Case 3: User has used all votes
  if (hasVoted || votesRemaining <= 0) {
    return (
      <Card className="w-full max-w-md text-center">
        <h2 className="mb-2 text-2xl font-bold text-green-600">
          {t('all_votes_submitted')}
        </h2>
        <p className="mb-4 text-gray-600">
          {t('used_all_votes', { quota: voteQuota })}
        </p>
        <p className="text-sm text-gray-500">{t('thank_you_participating')}</p>
      </Card>
    );
  }

  // Case 4: Voting is active and user has votes remaining
  const handleToggleOption = (id: string) => {
    setWarning(null); // Clear warning on interaction

    if (!EMPTY_OPTION_ID) {
      console.error('Empty vote option not found!');
      return;
    }

    if (id === EMPTY_OPTION_ID) {
      // Toggle Empty Vote
      if (selectedOptions.includes(EMPTY_OPTION_ID)) {
        setSelectedOptions([]);
      } else {
        if (selectedOptions.length > 0) {
          setWarning(t('empty_vote_warning_deselect'));
        }
        setSelectedOptions([EMPTY_OPTION_ID]);
      }
    } else {
      // Toggle Standard Option
      if (selectedOptions.includes(EMPTY_OPTION_ID)) {
        setWarning(t('empty_vote_warning_self_deselect'));
        setSelectedOptions([id]);
      } else {
        if (selectedOptions.includes(id)) {
          setSelectedOptions(selectedOptions.filter((oid) => oid !== id));
        } else {
          if (selectedOptions.length < settings.max_choices) {
            setSelectedOptions([...selectedOptions, id]);
          }
        }
      }
    }
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) {
      setError(t('please_select_one'));
      return;
    }

    setError(null);
    setSuccessMessage(null);
    startTransition(async () => {
      const result = await submitVote(selectedOptions);
      if (!result.success) {
        setError(result.message);
      } else {
        setSuccessMessage(t('vote_submitted_success'));
        setSelectedOptions([]);
        router.refresh();
      }
    });
  };

  return (
    <Card className="w-full max-w-md text-center">
      <h2 className="mb-2 text-center text-2xl font-bold">{settings.title}</h2>

      <div className="mb-2 flex items-center justify-center gap-2">
        <span className="rounded bg-[var(--color-primary)]/10 px-2.5 py-0.5 text-sm font-medium text-[var(--color-primary)]">
          {t('votes_left', { remaining: votesRemaining, quota: voteQuota })}
        </span>
      </div>

      <p className="mb-6 text-center text-gray-500">
        {t('select_up_to', {
          max: settings.max_choices,
          plural_suffix: settings.max_choices > 1 ? t('options') : t('option'),
        })}
      </p>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-100 p-3 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded border border-green-200 bg-green-100 p-3 text-center text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {warning && (
        <div className="mb-4 rounded border border-yellow-200 bg-yellow-100 p-3 text-center text-sm text-yellow-700">
          {warning}
        </div>
      )}

      <div className="mb-8 space-y-3">
        {standardOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => handleToggleOption(option.id)}
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
              selectedOptions.includes(option.id)
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                : 'border-gray-200 hover:border-[var(--color-primary)]'
            } `}
          >
            <div className="flex items-center">
              <div
                className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border ${
                  selectedOptions.includes(option.id)
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                    : 'border-gray-400'
                } `}
              >
                {selectedOptions.includes(option.id) && (
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                )}
              </div>
              <span className="font-medium">{option.name}</span>
            </div>
          </div>
        ))}

        {/* Divider for Empty Vote */}
        {EMPTY_OPTION_ID && (
          <>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">{t('or')}</span>
              </div>
            </div>

            {/* Empty Vote Option */}
            <div
              onClick={() => handleToggleOption(EMPTY_OPTION_ID)}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-4 transition-all ${
                selectedOptions.includes(EMPTY_OPTION_ID)
                  ? 'border-gray-500 bg-gray-100'
                  : 'border-gray-300 hover:border-gray-400'
              } `}
            >
              <div className="flex items-center">
                <div
                  className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border ${
                    selectedOptions.includes(EMPTY_OPTION_ID)
                      ? 'border-gray-500 bg-gray-500'
                      : 'border-gray-400'
                  } `}
                >
                  {selectedOptions.includes(EMPTY_OPTION_ID) && (
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  )}
                </div>
                <span className="font-medium text-gray-700">
                  {t('empty_vote')}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isPending || selectedOptions.length === 0}
        className="w-full px-4 py-3 font-bold"
      >
        {isPending ? t('submitting') : t('submit_vote')}
      </Button>
    </Card>
  );
}
