import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/connectdb';
import user from '@/lib/model/user';
import BrevoApi from '@/lib/brevo_api';
import { splitName } from '@/lib/standardized';
import { validateScreennameFull } from '@/lib/screenname';

const getUserByEmail = async (email: string) => {
  await dbConnect();
  const User = await user.findOne({ email: email });
  return User;
};

const callBrevo_createContact = async (email: string, name: string) => {
  const brevo = new BrevoApi();
  if (brevo.ready) {
    const [firstName, lastName] = splitName(name);
    const attributes = {
      FIRSTNAME: firstName,
      LASTNAME: lastName,
    };
    let list_ids = [];
    if (brevo.config.lists.addedByWebsite) {
      list_ids.push(parseInt(brevo.config.lists.addedByWebsite));
    }
    if (brevo.config.lists.webformNewsletter) {
      list_ids.push(parseInt(brevo.config.lists.webformNewsletter));
    }
    const new_contact = await brevo.createOrUpdateContact(
      email,
      attributes,
      list_ids
    );
  }
};

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: 'No user session available' },
      { status: 401 }
    );
  }

  const body = await request.json();
  const email = session.user?.email
    ? (session.user?.email as string).toLowerCase()
    : null;

  const { name, zip_code, screenname } = body;

  if (!email) {
    return NextResponse.json(
      { error: 'Email value required' },
      { status: 200 }
    );
  }

  // Validate screenname if provided
  if (screenname) {
    const validation = await validateScreennameFull(screenname, email);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    if (name) {
      existingUser.name = name;
    }
    if (zip_code) {
      existingUser.zip_code = zip_code;
    }
    if (screenname) {
      existingUser.screenname = screenname.trim();
    }
    await existingUser.save();
    return NextResponse.json({ success: true, data: existingUser });
  }

  return NextResponse.json(
    { success: true, error: 'Could not find user' },
    { status: 401 }
  );
}

export const maxDuration = 5;
