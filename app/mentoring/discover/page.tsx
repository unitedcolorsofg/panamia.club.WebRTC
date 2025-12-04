import { MentorFilters } from './_components/filters';

export default async function DiscoverPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Discover Mentors</h1>
        <p className="text-gray-600 mt-2">
          Find mentors who can help you grow in your journey
        </p>
      </div>

      <MentorFilters />
    </div>
  );
}
