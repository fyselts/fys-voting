'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useLanguage } from '@/context/LanguageContext';
import { logout } from '@/features/auth/actions';

export function LogoutButton() {
  const { t } = useLanguage();

  return (
    <Form action={logout}>
      <Button type="submit">{t('logout')}</Button>
    </Form>
  );
}
