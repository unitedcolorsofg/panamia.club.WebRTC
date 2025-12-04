'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MentorCard } from './mentor-card';

export function MentorFilters() {
  const [expertise, setExpertise] = useState('');
  const [language, setLanguage] = useState('');
  const [freeOnly, setFreeOnly] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchMentors = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (expertise) params.set('expertise', expertise);
    if (language) params.set('language', language);
    if (freeOnly) params.set('freeOnly', 'true');

    const res = await fetch(`/api/mentoring/discover?${params}`);
    const data = await res.json();
    setMentors(data.mentors || []);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Filter by expertise..."
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
          />
          <Input
            placeholder="Filter by language..."
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="freeOnly"
              checked={freeOnly}
              onChange={(e) => setFreeOnly(e.target.checked)}
            />
            <label htmlFor="freeOnly" className="text-sm">
              Free mentoring only
            </label>
          </div>
        </div>
        <Button onClick={searchMentors} className="mt-4">
          Search Mentors
        </Button>
      </div>

      {loading && <p className="text-center">Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor: any) => (
          <MentorCard key={mentor.email} mentor={mentor} />
        ))}
      </div>

      {!loading && mentors.length === 0 && (
        <p className="text-center text-gray-500">
          No mentors found. Try different filters.
        </p>
      )}
    </div>
  );
}
