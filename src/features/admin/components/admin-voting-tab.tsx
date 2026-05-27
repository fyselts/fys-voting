'use client';

import { useEffect,useState, useTransition } from 'react';

import { useLanguage } from '@/context/LanguageContext';
import {
  addOption,
  deleteOption,
  getVotingState,
  resetVoting,
  togglePublishStatus,
  toggleVotingStatus,
  updateVotingSettings,
} from '@/features/voting/actions/admin';
import { type VotingOption,type VotingSettings } from '@/features/voting/types';

export function AdminVotingTab() {
  const [settings, setSettings] = useState<VotingSettings | null>(null);
  const [options, setOptions] = useState<VotingOption[]>([]);
   
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();

  const [newOption, setNewOption] = useState('');
  const [title, setTitle] = useState('');
  const [maxChoices, setMaxChoices] = useState(1);

  const fetchState = async () => {
    const data = await getVotingState();
    setSettings(data.settings);
    setOptions(data.options);
    if (data.settings) {
      setTitle(data.settings.title);
      setMaxChoices(data.settings.max_choices);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchState();
  }, []);

  const handleUpdateSettings = () => {
    startTransition(async () => {
      await updateVotingSettings(title, maxChoices);
      await fetchState();
    });
  };

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    startTransition(async () => {
      await addOption(newOption);
      setNewOption('');
      await fetchState();
    });
  };

  const handleDeleteOption = (id: string) => {
    startTransition(async () => {
      await deleteOption(id);
      await fetchState();
    });
  };

  const handleToggleActive = () => {
    if (!settings) return;
    startTransition(async () => {
      await toggleVotingStatus(!settings.is_active);
      await fetchState();
    });
  };

  const handleTogglePublish = () => {
    if (!settings) return;
    startTransition(async () => {
      await togglePublishStatus(!settings.is_published);
      await fetchState();
    });
  };

  const handleReset = () => {
    if (!confirm(t('reset_confirm'))) return;
    startTransition(async () => {
      await resetVoting();
      await fetchState();
    });
  };

  if (!settings) return <div>{t('loading')}</div>;

  return (
    <div className="space-y-8">
      {/* Status & Controls */}
      <section className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t('voting_status')}</h2>
          <div className="flex gap-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-bold ${settings.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
            >
              {settings.is_active ? t('active') : t('not_started')}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-sm font-bold ${settings.is_published ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
            >
              {settings.is_published ? t('published') : t('hidden')}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleToggleActive}
            disabled={isPending}
            className={`rounded px-4 py-2 font-bold text-white ${settings.is_active ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {settings.is_active ? t('end_voting') : t('start_voting')}
          </button>

          <button
            onClick={handleTogglePublish}
            disabled={isPending}
            className={`rounded px-4 py-2 font-bold text-white ${settings.is_published ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {settings.is_published
              ? t('unpublish_results')
              : t('publish_results')}
          </button>

          <button
            onClick={handleReset}
            disabled={isPending}
            className="ml-auto rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
          >
            {t('reset_voting')}
          </button>
        </div>
      </section>

      {/* Configuration */}
      <section className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">{t('configuration')}</h2>
        <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block font-medium">
              {t('voting_title')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">{t('max_choices')}</label>
            <input
              type="number"
              min="1"
              value={maxChoices}
              onChange={(e) => setMaxChoices(parseInt(e.target.value))}
              className="w-full rounded border p-2"
            />
          </div>
        </div>
        <button
          onClick={handleUpdateSettings}
          disabled={isPending}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {t('save_settings')}
        </button>
      </section>

      {/* Options */}
      <section className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">{t('option_name')}</h2>
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder={t('enter_option_name')}
            className="flex-1 rounded border p-2"
            onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
          />
          <button
            onClick={handleAddOption}
            disabled={isPending || !newOption.trim()}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {t('add_option')}
          </button>
        </div>

        <div className="space-y-2">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between rounded border bg-gray-50 p-3 dark:bg-zinc-700/50"
            >
              <span className="font-medium">{option.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {option.vote_count} {t('votes_admin')}
                </span>
                <button
                  onClick={() => handleDeleteOption(option.id)}
                  disabled={isPending}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {options.length === 0 && (
            <p className="py-4 text-center text-gray-500">
              {t('no_options_added')}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
