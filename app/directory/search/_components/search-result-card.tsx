'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, HeartCrack, MapPin, User } from 'lucide-react';
import Link from 'next/link';
import { SearchResultsInterface } from '@/lib/query/directory';

interface SearchResultCardProps {
  profile: SearchResultsInterface;
  isFollowing: boolean;
  distance?: number;
  onFollow: (id: string) => void;
  onUnfollow: (id: string) => void;
  isAuthenticated: boolean;
  isMentor?: boolean;
}

function detailLimit(details: string) {
  if (details?.length > 200) {
    return `${details.substring(0, 197)}...`;
  }
  return details;
}

export function SearchResultCard({
  profile,
  isFollowing,
  distance,
  onFollow,
  onUnfollow,
  isAuthenticated,
  isMentor,
}: SearchResultCardProps) {
  const profileId = profile._id as string;
  const primaryImage = profile.images?.primaryCDN || '/img/bg_coconut_blue.jpg';

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Profile Image */}
        <div className="relative h-48 w-full md:h-auto md:w-48">
          <img
            src={primaryImage}
            alt={profile.name as string}
            className="h-full w-full object-cover"
          />
          {isMentor && (
            <Badge className="absolute right-2 top-2 bg-blue-600 text-white">
              Mentor
            </Badge>
          )}
        </div>

        {/* Profile Content */}
        <CardContent className="flex flex-1 flex-col gap-3 p-6">
          {/* Name and Follow Status */}
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold">{profile.name}</h3>
            {isFollowing && (
              <span title="You're following this profile">
                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
              </span>
            )}
          </div>

          {/* Five Words */}
          {profile.five_words && (
            <Badge variant="secondary" className="w-fit">
              {profile.five_words}
            </Badge>
          )}

          {/* Location */}
          {profile.primary_address?.city && (
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>{profile.primary_address.city}</span>
              {distance && distance > 0 && (
                <span className="text-xs">
                  &nbsp;({distance.toFixed(2)} miles away)
                </span>
              )}
            </div>
          )}

          {/* Details */}
          {profile.details && (
            <p className="text-gray-700 dark:text-gray-300">
              {detailLimit(profile.details as string)}
            </p>
          )}

          {/* Actions */}
          <div className="mt-auto flex flex-wrap gap-2">
            <Button variant="default" asChild>
              <Link href={`/profile/${profile.slug}`}>
                <User className="h-4 w-4" />
                View Profile
              </Link>
            </Button>

            {isAuthenticated && (
              <>
                {isFollowing ? (
                  <Button
                    variant="outline"
                    onClick={() => onUnfollow(profileId)}
                  >
                    <HeartCrack className="h-4 w-4" />
                    Unfollow
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => onFollow(profileId)}>
                    <Heart className="h-4 w-4" />
                    Follow
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
