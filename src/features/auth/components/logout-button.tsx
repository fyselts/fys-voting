'use client'

import { logout } from '@/features/auth/actions'
import { useLanguage } from '@/context/LanguageContext'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

export function LogoutButton() {
  const { t } = useLanguage()

  return (
    <Form action={logout}>
      <Button
        type="submit"
      >
        {t('logout')}
      </Button>
    </Form>
  )
}
