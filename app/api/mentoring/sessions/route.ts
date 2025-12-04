import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/connectdb';
import MentorSession from '@/lib/model/mentorSession';
import Profile from '@/lib/model/profile';
import { createSessionSchema } from '@/lib/validations/session';
import { nanoid } from 'nanoid';

// GET - List sessions for current user
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role'); // 'mentor' | 'mentee' | 'all'
  const status = searchParams.get('status'); // 'scheduled' | 'completed' | 'all'

  const query: any = {};

  // Role filter
  if (role === 'mentor') {
    query.mentorEmail = session.user.email;
  } else if (role === 'mentee') {
    query.menteeEmail = session.user.email;
  } else {
    query.$or = [
      { mentorEmail: session.user.email },
      { menteeEmail: session.user.email },
    ];
  }

  // Status filter
  if (status && status !== 'all') {
    query.status = status;
  }

  const sessions = await MentorSession.find(query)
    .sort({ scheduledAt: -1 })
    .limit(50);

  return NextResponse.json({ sessions });
}

// POST - Create new session
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const body = await request.json();
  const validation = createSessionSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error },
      { status: 400 }
    );
  }

  const { mentorEmail, scheduledAt, duration, topic } = validation.data;

  // Verify mentor exists and has mentoring enabled
  const mentor = await Profile.findOne({
    email: mentorEmail,
    'mentoring.enabled': true,
  });

  if (!mentor) {
    return NextResponse.json(
      { error: 'Mentor not found or mentoring not enabled' },
      { status: 404 }
    );
  }

  // Create session with unique ID for Pusher channel
  const sessionId = nanoid(16);
  const newSession = await MentorSession.create({
    mentorEmail,
    menteeEmail: session.user.email,
    scheduledAt: new Date(scheduledAt),
    duration,
    topic,
    sessionId,
    status: 'scheduled',
  });

  return NextResponse.json({ session: newSession }, { status: 201 });
}
