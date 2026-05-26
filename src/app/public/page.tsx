import { getSession, getUserRole } from '@/features/auth/lib/auth';
import { PublicResults } from '@/features/voting/components/public-results';
import { type VotingOption } from '@/features/voting/types';
import { getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function PublicPage() {
  const supabase = getSupabaseClient();

  const user = await getSession();
  let dashboardHref: string | undefined;
  if (user?.email) {
    const role = await getUserRole(user.email);
    if (role === 'admin') dashboardHref = '/admin';
    else if (role === 'user') dashboardHref = '/user';
  }

  const { data: settings } = await supabase
    .from('voting_settings')
    .select('*')
    .single();

  const isPublished = settings?.is_published;

  const { count: totalVotersCount } = await supabase
    .from('voters')
    .select('*', { count: 'exact', head: true });

  const totalVotesCast = totalVotersCount ?? 0;

  let results: VotingOption[] = [];
  let emptyOption: VotingOption | undefined;

  if (isPublished) {
    const { data } = await supabase
      .from('voting_options')
      .select('*')
      .order('vote_count', { ascending: false });

    if (data) {
      emptyOption = data.find((o) => o.name === 'Empty Vote');
      results = data.filter((o) => o.name !== 'Empty Vote');
    }
  }

  const maxVotes = Math.max(...results.map((r) => r.vote_count), 1);

  return (
    <PublicResults
      results={results}
      emptyOption={emptyOption}
      totalVotesCast={totalVotesCast}
      maxVotes={maxVotes}
      isPublished={isPublished}
      dashboardHref={dashboardHref}
    />
  );
}
