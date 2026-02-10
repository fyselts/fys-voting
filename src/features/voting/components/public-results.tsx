'use client'

import { useLanguage } from '@/context/LanguageContext'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { QRCodeDisplay } from '@/features/user/components/qr-code-display'
import Link from 'next/link'
import { VotingOption } from '@/features/voting/types'

interface PublicResultsProps {
    results: VotingOption[]
    emptyOption?: VotingOption | undefined
    totalVotesCast: number
    maxVotes: number
    isPublished: boolean
}

export function PublicResults({ results, emptyOption, totalVotesCast, maxVotes, isPublished }: PublicResultsProps) {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen bg-gray-100 p-8 relative">
            <div className="absolute top-4 right-4 text-black">
                <LanguageToggle />
            </div>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-black">{t('voting_public_display')}</h1>
                    <Link
                        href="/"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        {t('go_to_login')}
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <h2 className="text-xl font-semibold text-black">{t('join_vote')}</h2>
                        <QRCodeDisplay />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-black">{t('results')}</h2>
                        {isPublished ? (
                            <div className="space-y-4">
                                {results.map((option) => (
                                    <div key={option.id} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-black">{option.name}</span>
                                            <span className="font-medium text-black">{option.vote_count} {t('votes')}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${(option.vote_count / maxVotes) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                                {results.length === 0 && (
                                    <p className="text-black">{t('no_standard_options')}</p>
                                )}

                                <div className="mt-8 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>{t('total_votes_cast', { total: '' }).replace(': ', '')}:</span>
                                        <span className="font-semibold text-black">{totalVotesCast}</span>
                                    </div>
                                    {emptyOption && emptyOption.vote_count > 0 && (
                                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                                            <span>{t('empty_votes', { count: '' }).replace(': ', '')}:</span>
                                            <span className="font-semibold text-black">{emptyOption.vote_count}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                <p className="text-lg text-black">{t('results_hidden')}</p>
                                <p className="text-sm text-black">{t('voting_in_progress')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
