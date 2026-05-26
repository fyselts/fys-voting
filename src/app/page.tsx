import { redirect } from 'next/navigation';

import { LoginFlow } from '@/features/auth/components/login-flow';
import { getSession, getUserRole } from '@/features/auth/lib/auth';

export default async function Home() {
  const user = await getSession();

  if (user?.email) {
    const role = await getUserRole(user.email);
    if (role === 'admin') redirect('/admin');
    if (role === 'user') redirect('/user');
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <LoginFlow />
    </div>
  );
}
