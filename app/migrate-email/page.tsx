'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

function MigrateEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [status, setStatus] = useState<
    'loading' | 'success' | 'error' | 'expired'
  >('loading');
  const [message, setMessage] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const completeMigration = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No migration token provided.');
        return;
      }

      try {
        const response = await fetch('/api/user/complete-email-migration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setNewEmail(data.newEmail);
          setMessage(
            'Your email has been successfully migrated! You will be redirected to sign in.'
          );

          // Start countdown
          const interval = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                router.push('/signin');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(interval);
        } else {
          if (data.error?.includes('expired')) {
            setStatus('expired');
          } else {
            setStatus('error');
          }
          setMessage(data.error || 'Failed to complete email migration.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        console.error('Migration completion error:', error);
      }
    };

    completeMigration();
  }, [token, router]);

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {status === 'loading' && (
                <>
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  Processing Email Migration
                </>
              )}
              {status === 'success' && (
                <>
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  Migration Successful
                </>
              )}
              {status === 'expired' && (
                <>
                  <Clock className="h-6 w-6 text-amber-500" />
                  Link Expired
                </>
              )}
              {status === 'error' && (
                <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  Migration Failed
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {status === 'loading' && (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Please wait while we migrate your email address...
                </p>
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    {message}
                  </p>
                  {newEmail && (
                    <p className="mt-2 text-sm font-semibold text-green-900 dark:text-green-100">
                      New email: {newEmail}
                    </p>
                  )}
                </div>

                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    For security reasons, you have been signed out of all
                    devices.
                  </p>
                  <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                    A confirmation email has been sent to your previous email
                    address.
                  </p>
                </div>

                <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
                  <span>Redirecting to sign in page in {countdown}...</span>
                </div>

                <div className="flex justify-center">
                  <Button asChild>
                    <Link href="/signin">Sign In Now</Link>
                  </Button>
                </div>
              </div>
            )}

            {status === 'expired' && (
              <div className="space-y-4">
                <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {message}
                  </p>
                  <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
                    Migration links expire after 5 minutes for security reasons.
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  <Button asChild variant="outline">
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/account/user/edit">Request New Migration</Link>
                  </Button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {message}
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  <Button asChild variant="outline">
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/account/user/edit">Try Again</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function MigrateEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <MigrateEmailContent />
    </Suspense>
  );
}
