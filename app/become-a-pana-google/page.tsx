import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become a Pana',
  description:
    'Sign up to become a Pana and get the benefits of being listed on our directory!',
};

export default function BecomeAPanaGooglePage() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <iframe
          className="h-[calc(100vh-8rem)] w-full rounded-lg border"
          src="https://docs.google.com/forms/d/e/1FAIpQLSdE7qckjuydnNl4GPLyyU6whh89MuOGTIEZIaI5EhFfOk4wVA/viewform?embedded=true"
          title="Become a Pana Form"
        >
          Loading...
        </iframe>
      </div>
    </main>
  );
}
