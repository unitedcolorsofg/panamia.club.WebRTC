import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectdb';
import user from '@/lib/model/user';
import profile from '@/lib/model/profile';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ deleted: true }, { status: 404 });
  }

  await dbConnect();

  try {
    // Find user by ID
    const foundUser = await user.findById(id);

    if (!foundUser) {
      return NextResponse.json({ deleted: true });
    }

    // Find associated profile if exists
    const userProfile = await profile.findOne({
      email: foundUser.email,
      active: true,
    });

    return NextResponse.json({
      screenname: foundUser.screenname || null,
      name: foundUser.name || null,
      profileSlug: userProfile?.slug || null,
      verified: userProfile?.verification?.panaVerified || false,
    });
  } catch (error) {
    console.error('Author lookup error:', error);
    return NextResponse.json({ deleted: true }, { status: 500 });
  }
}

export const maxDuration = 5;
