// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/connectdb';
import profile from '@/lib/model/profile';

interface ResponseData {
  error?: string;
  success?: boolean;
  msg?: string;
  data?: any[];
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const session = await auth();

  if (!session) {
    return NextResponse.json({
      success: false,
      error: 'No user session available',
    });
  }
  const eMail = session.user?.email;
  if (!eMail) {
    return NextResponse.json(
      { success: false, error: 'No valid email' },
      { status: 200 }
    );
  }

  const {
    email,
    name,
    slug,
    details,
    background,
    five_words,
    socials,
    phone_number,
    tags,
  } = body;
  console.log('phone_number', phone_number);

  const newProfile = new profile({
    name: name,
    email: email,
    slug: slug,
    active: true,
    details: details,
    background: background,
    five_words: five_words,
    socials: socials,
    phone_number: phone_number,
    tags: tags,
  });

  newProfile
    .save()
    .then(() =>
      NextResponse.json(
        { msg: 'Successfuly created new Profile: ' + newProfile },
        { status: 200 }
      )
    )
    .catch((err: string) =>
      NextResponse.json(
        { error: "Error on '/api/importProfile': " + err },
        { status: 400 }
      )
    );
}
