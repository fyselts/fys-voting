'use client'

import { useLanguage } from '@/context/LanguageContext'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const styles = {
    base: 'px-4 py-1 rounded-lg transition-colors',
    selected: 'bg-[var(--color-primary)] text-white',
    default: 'text-gray-600',
    container: 'flex gap-0 text-sm font-medium rounded-lg bg-gray-200 shadow-lg',
  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => setLanguage('et')}
        className={
          `${styles.base} ${language === 'et' ? styles.selected : styles.default}`
        }
      >
        ET
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={
          `${styles.base} ${language === 'en' ? styles.selected : styles.default}`
        }
      >
        EN
      </button>
    </div>
  );
}
