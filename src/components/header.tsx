import Image from 'next/image';
import { LanguageToggle } from './ui/language-toggle';

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between py-4 px-6" style={{ background: 'transparent' }}>
      <div className="flex items-center">
        <a href="/">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} priority className='drop-shadow-lg' />
        </a>
      </div>
      <div className="flex items-center">
        <LanguageToggle />
      </div>
    </header>
  );
}
