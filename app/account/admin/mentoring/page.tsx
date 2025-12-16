'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  IconUsers,
  IconCalendar,
  IconClock,
  IconTrendingUp,
  IconUserCheck,
  IconUserPlus,
  IconAlertCircle,
} from '@tabler/icons-react';

interface DashboardMetrics {
  totalMentors: number;
  activeMentors: number;
  sessions: {
    total: number;
    scheduled: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  averageSessionDuration: number;
  topExpertise: Array<{ expertise: string; count: number }>;
  mentorUtilization: {
    totalSessions: number;
    activeMentors: number;
    averagePerMentor: number;
  };
  menteeEngagement: {
    uniqueMentees: number;
    returningMentees: number;
    totalBookings: number;
  };
  cancellationRate: {
    overall: number;
    byMentor: number;
    byMentee: number;
  };
}

export default function MentoringDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/mentoring/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      const data = await response.json();
      setMetrics(data.metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Mentoring Dashboard</h1>
        <p>Loading metrics...</p>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Mentoring Dashboard</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">
              Error: {error || 'No data available'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const returningRate =
    metrics.menteeEngagement.uniqueMentees > 0
      ? Math.round(
          (metrics.menteeEngagement.returningMentees /
            metrics.menteeEngagement.uniqueMentees) *
            100
        )
      : 0;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Mentoring Dashboard</h1>
        <p className="text-gray-600">
          Platform metrics and mentoring program performance
        </p>
      </div>

      {/* Overview Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mentors</CardTitle>
            <IconUsers className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalMentors}</div>
            <p className="text-xs text-gray-500">
              {metrics.activeMentors} active (
              {metrics.totalMentors > 0
                ? Math.round(
                    (metrics.activeMentors / metrics.totalMentors) * 100
                  )
                : 0}
              %)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
            <IconCalendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.sessions.total}</div>
            <p className="text-xs text-gray-500">
              {metrics.sessions.completed} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <IconClock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.averageSessionDuration}m
            </div>
            <p className="text-xs text-gray-500">Per session</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cancellation Rate
            </CardTitle>
            <IconAlertCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.cancellationRate.overall}%
            </div>
            <p className="text-xs text-gray-500">
              {metrics.sessions.cancelled} cancelled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Breakdown */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Session Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Scheduled</span>
                <span className="text-sm text-gray-500">
                  {metrics.sessions.scheduled}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">In Progress</span>
                <span className="text-sm text-gray-500">
                  {metrics.sessions.inProgress}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completed</span>
                <span className="text-sm text-gray-500">
                  {metrics.sessions.completed}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cancelled</span>
                <span className="text-sm text-gray-500">
                  {metrics.sessions.cancelled}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cancellation Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Rate</span>
                <span className="text-sm text-gray-500">
                  {metrics.cancellationRate.overall}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">By Mentor</span>
                <span className="text-sm text-gray-500">
                  {metrics.cancellationRate.byMentor}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">By Mentee</span>
                <span className="text-sm text-gray-500">
                  {metrics.cancellationRate.byMentee}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mentor & Mentee Insights */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUserCheck className="h-5 w-5" />
              Mentor Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Mentors</span>
                <span className="text-sm text-gray-500">
                  {metrics.mentorUtilization.activeMentors}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Sessions</span>
                <span className="text-sm text-gray-500">
                  {metrics.mentorUtilization.totalSessions}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg Per Mentor</span>
                <span className="text-sm text-gray-500">
                  {metrics.mentorUtilization.averagePerMentor}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUserPlus className="h-5 w-5" />
              Mentee Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Unique Mentees</span>
                <span className="text-sm text-gray-500">
                  {metrics.menteeEngagement.uniqueMentees}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Returning Mentees</span>
                <span className="text-sm text-gray-500">
                  {metrics.menteeEngagement.returningMentees} ({returningRate}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Bookings</span>
                <span className="text-sm text-gray-500">
                  {metrics.menteeEngagement.totalBookings}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Expertise Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrendingUp className="h-5 w-5" />
            Top Expertise Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.topExpertise.length > 0 ? (
            <div className="space-y-3">
              {metrics.topExpertise.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {item.expertise}
                  </span>
                  <span className="text-sm text-gray-500">
                    {item.count} mentors
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No expertise data available yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
