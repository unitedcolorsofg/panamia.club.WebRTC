import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Panimo 2024 by Pana MIA Club',
  description: 'Panimo 2024 by Pana MIA Club is an eventful fundraiser',
};

export default function PanimoEventPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Panimo 2024 by Pana MIA Club
          </h1>
          <p className="text-lg text-muted-foreground">
            An eventful fundraiser supporting the local South Florida community
          </p>
        </div>

        {/* Event Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <Calendar
                className="mt-1 h-5 w-5 text-pana-blue"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-semibold">Date & Time</h3>
                <p className="text-muted-foreground">March 16th, 6pm to 2am</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <MapPin
                className="mt-1 h-5 w-5 text-pana-pink"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-semibold">Location</h3>
                <address className="not-italic text-muted-foreground">
                  228 NE 59 St,
                  <br />
                  Miami, FL 33137
                </address>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Options */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Ticket Options</h2>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="mb-1 text-xl font-semibold">PreSale Ticket</h3>
                  <p className="text-muted-foreground">
                    General admission to the event
                  </p>
                </div>
                <Badge variant="outline" className="text-lg">
                  Available
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="mb-1 text-xl font-semibold">VIP</h3>
                  <p className="text-muted-foreground">
                    Premium access with exclusive perks
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-pana-yellow text-lg text-pana-yellow"
                >
                  Upgrade
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="mb-1 text-xl font-semibold">
                    Pana MIA T-Shirt
                  </h3>
                  <p className="text-muted-foreground">
                    Official event merchandise
                  </p>
                </div>
                <Badge variant="outline" className="text-lg">
                  Add-on
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
