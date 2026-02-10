import { requireAuth } from '@/features/auth/lib/auth'
import { getUserVotingState } from '@/features/voting/actions/user'
import { UserDashboard } from '@/features/user/components/user-dashboard'

export default async function UserPage() {
    const { user } = await requireAuth('user')
    const votingState = await getUserVotingState()

    return <UserDashboard user={{ ...user, email: user.email || '' }} votingState={votingState} />
}
