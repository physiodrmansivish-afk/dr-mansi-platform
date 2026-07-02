'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-red-100 p-4 mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-text mb-2">Something went wrong!</h2>
      <p className="text-text-muted mb-6 max-w-md">
        An unexpected error occurred while loading this page. 
        Please try again or return to the dashboard.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-[#006064] px-6 py-2 text-sm font-medium text-white hover:bg-opacity-90"
        >
          Try again
        </button>
        <Link 
          href="/dashboard"
          className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-text hover:bg-surface-secondary"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
