'use client'

import { useLanguage } from '@/context/LanguageContext'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { LogoutButton } from '@/features/auth/components/logout-button'
import { UserVoting } from '@/features/voting/components/user-voting'
import { VotingSettings, VotingOption } from '@/features/voting/types'

interface UserDashboardProps {
    user: {
        email: string
        // Add other user properties if needed
    }
    votingState: {
        settings: VotingSettings | null
        options: VotingOption[]
        hasVoted: boolean
        votesRemaining: number
        voteQuota: number
        totalVotesCast?: number
        emptyVotes?: number
    }
}

export function UserDashboard({ user, votingState }: UserDashboardProps) {
    const { t } = useLanguage()

    return (
        <div className="flex min-h-screen flex-col items-center p-8 md:p-24 relative">
            <div className="absolute top-4 right-4">
                <LanguageToggle />
            </div>
            <div className="w-full max-w-3xl flex justify-between items-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold">{t('user_dashboard')}</h1>
                <LogoutButton />
            </div>

            <div className="w-full max-w-3xl space-y-8">
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
                    <p className="text-xl mb-2">
                        {t('welcome_back', { email: user.email })}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {t('email_label', { email: user.email })}
                    </p>
                </div>

                <UserVoting initialState={votingState} />
            </div>
        </div>
    )
}
