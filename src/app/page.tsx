import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

// The bare "/" route redirects to the default locale.
// The middleware also handles this, but this serves as a fallback.
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
