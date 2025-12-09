import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectdb';
import followers from '@/lib/model/followers';

export async function POST(request: NextRequest) {
  await dbConnect();

  const body = await request.json();
  const { followerId, userId } = body;

  try {
    const result = await followers.deleteOne({
      followerId: followerId,
      userId: userId,
    });

    if (result.deletedCount > 0) {
      return NextResponse.json({ msg: 'Successfully unfollowed: ' + userId });
    } else {
      return NextResponse.json(
        { error: 'Follower relationship not found' },
        { status: 404 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Error on '/api/removeFollower': " + err },
      { status: 400 }
    );
  }
}
