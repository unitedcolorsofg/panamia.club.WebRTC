import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DirectorySearchContent } from './_components/search-content';

function SearchFallback() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl space-y-6 px-4">
        <section className="text-center">
          <h1 className="text-4xl font-bold">Pana Mia Directory</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Explore South Florida locals and communities
          </p>
        </section>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function DirectorySearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <DirectorySearchContent />
    </Suspense>
  );
}
