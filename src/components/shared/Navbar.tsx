'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { key: 'home', href: '' },
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'book', href: '/book' },
  { key: 'contact', href: '/contact' },
] as const;

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const otherLocale = locale === 'en' ? 'mr' : 'en';

  // Build path for locale switch: replace current locale prefix with other
  function getLocaleSwitchHref() {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    return `/${otherLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
  }

  function isActive(linkHref: string) {
    const fullHref = `/${locale}${linkHref}`;
    if (linkHref === '') {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(fullHref);
  }

  return (
    <header className="sticky top-0 z-50 bg-surface shadow-nav">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="text-xl font-bold text-primary"
        >
          PhysioCare
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.key}>
              <Link
                href={`/${locale}${link.href}`}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-primary'
                }`}
              >
                {t(link.key)}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: Language toggle */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={getLocaleSwitchHref()}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:border-primary hover:text-primary"
          >
            {t('currentLang')} / {t('languageToggle')}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-text-secondary md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-surface md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                className={`block rounded-md px-3 py-2 text-sm font-medium ${
                  isActive(link.href)
                    ? 'bg-primary-lightest text-primary'
                    : 'text-text-secondary hover:bg-surface-secondary hover:text-primary'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(link.key)}
              </Link>
            ))}
            <div className="border-t border-border pt-3">
              <Link
                href={getLocaleSwitchHref()}
                className="block rounded-md px-3 py-2 text-sm font-semibold text-text-secondary hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('currentLang')} / {t('languageToggle')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
