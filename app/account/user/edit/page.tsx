'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getUserSession, saveUserSession } from '@/lib/user';
import { UserInterface } from '@/lib/interfaces';

export default function UserEditPage() {
  const { data: session } = useSession();
  const [sessionEmail, setSessionEmail] = useState('');
  const [sessionZipCode, setSessionZipCode] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [userData, setUserData] = useState({} as UserInterface);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const setUserSession = async () => {
    const userSession = await getUserSession();
    if (userSession) {
      setSessionEmail(userSession.email == null ? '' : userSession.email);
      setSessionZipCode(
        userSession.zip_code == null ? '' : userSession.zip_code
      );
      setSessionName(userSession.name == null ? '' : userSession.name);
      setUserData(userSession);
    }
  };

  const updateUserSession = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const response = await saveUserSession({
        name: sessionName,
        zip_code: sessionZipCode,
      });
      console.log('updateUserSession:response', response);
      setMessage('Settings updated successfully!');
    } catch (error) {
      setMessage('Failed to update settings. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateUserSession();
  };

  useEffect(() => {
    if (session) {
      setUserSession();
    }
  }, [session]);

  if (!session) {
    return (
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Unauthorized</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You must be logged in to view this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Update Your Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  value={sessionEmail}
                  readOnly
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
                <p className="text-sm text-gray-500">
                  Email verified. Sign out to use a different account.
                </p>
              </div>

              {/* Name/Nickname */}
              <div className="space-y-2">
                <Label htmlFor="name">Name/Nickname</Label>
                <Input
                  id="name"
                  type="text"
                  value={sessionName}
                  maxLength={60}
                  autoComplete="name"
                  onChange={(e) => setSessionName(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Used for contact emails and notices.
                </p>
              </div>

              {/* Zip Code */}
              <div className="space-y-2">
                <Label htmlFor="zipcode">Zip Code</Label>
                <Input
                  id="zipcode"
                  type="text"
                  value={sessionZipCode}
                  maxLength={10}
                  autoComplete="postal-code"
                  onChange={(e) => setSessionZipCode(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Used to personalize search results and site features.
                </p>
              </div>

              {message && (
                <p
                  className={`text-sm ${
                    message.includes('success')
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {message}
                </p>
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update'}
              </Button>

              {userData?.affiliate?.code && (
                <div className="pt-4 text-sm text-gray-500" hidden>
                  Affiliate Code: {userData.affiliate.code}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
