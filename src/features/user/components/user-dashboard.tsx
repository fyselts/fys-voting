'use client'

import { Card } from '@/components/ui/card'
import { useLanguage } from '@/context/LanguageContext'
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
    <div className="flex min-h-screen flex-col items-center p-8 md:p-24 relative gap-6">
      <Card className="w-full max-w-md flex flex-col items-center gap-6">
        <h2>
          {t('email_label', { email: user.email })}
        </h2>
        <LogoutButton />
      </Card>

      <UserVoting initialState={votingState} />
    </div >
  )
}
