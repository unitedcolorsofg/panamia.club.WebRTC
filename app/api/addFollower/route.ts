import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectdb';
import followers from '@/lib/model/followers';

const validateForm = async (followerId: string, userId: string) => {
  const alreadyFollowing = await followers.findOne({
    followerId: followerId,
    userId: userId,
  });
  if (alreadyFollowing) {
    return { error: 'Already following.' };
  }
  return null;
};

export async function POST(request: NextRequest) {
  await dbConnect();

  const body = await request.json();
  const { followerId, followerUserName, followedUserName, userId } = body;

  const errorMessage = await validateForm(followerId, userId);
  if (errorMessage) {
    return NextResponse.json(errorMessage, { status: 400 });
  }

  // create new follower on MongoDB
  const newFollower = new followers({
    followerId: followerId,
    followerUserName: followerUserName,
    followedUserName: followedUserName,
    userId: userId,
  });

  try {
    await newFollower.save();
    console.log('success');
    return NextResponse.json({ msg: 'Successfully followed: ' + userId });
  } catch (err) {
    return NextResponse.json(
      { error: "Error on '/api/addFollower': " + err },
      { status: 400 }
    );
  }
}
