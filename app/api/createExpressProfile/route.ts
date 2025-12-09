import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectdb';
import profile from '@/lib/model/profile';
import BrevoApi from '@/lib/brevo_api';
import { createUniqueString, slugify, splitName } from '@/lib/standardized';

const validateEmail = (email: string): boolean => {
  const regEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regEx.test(email);
};

const callBrevo_createContact = async (email: string, name: string) => {
  const brevo = new BrevoApi();

  if (brevo.ready) {
    // const contact = await brevo.findContact(email);
    const [firstName, lastName] = splitName(name);
    const attributes = {
      FIRSTNAME: firstName,
      LASTNAME: lastName,
    };
    let list_ids = [];
    if (brevo.config.lists.addedByWebsite) {
      list_ids.push(parseInt(brevo.config.lists.addedByWebsite));
    }
    if (brevo.config.lists.webformProfile) {
      list_ids.push(parseInt(brevo.config.lists.webformProfile));
    }
    const new_contact = await brevo.createOrUpdateContact(
      email,
      attributes,
      list_ids
    );
  }
};

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    name,
    email,
    locally_based,
    details,
    background,
    socials,
    phone_number,
    whatsapp_community,
    pronouns,
    five_words,
    tags,
    hearaboutus,
    affiliate,
  } = body;

  console.log('createExpressProfile', {
    name,
    email,
    locally_based,
    details,
    background,
    socials,
    phone_number,
    whatsapp_community,
    pronouns,
    five_words,
    tags,
    hearaboutus,
    affiliate,
  });

  await dbConnect();
  const existingProfile = await profile.findOne({ email: email });

  if (existingProfile) {
    return NextResponse.json(
      { error: 'This email is already being used for a profile.' },
      { status: 200 }
    );
  }

  if (!validateEmail(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 200 }
    );
  }

  // TODO: Set initial completion percentage?
  const newProfile = new profile(
    {
      name: name,
      email: email.toString().toLowerCase(),
      slug: slugify(name),
      active: false, // TODO: set to false on launch/approval process
      status: {
        submitted: new Date(),
        access: createUniqueString(),
      },
      locally_based: locally_based,
      details: details,
      background: background,
      socials: socials,
      phone_number: phone_number,
      whatsapp_community: whatsapp_community,
      pronouns: pronouns,
      five_words: five_words,
      tags: tags,
      hearaboutus: hearaboutus,
      affiliate: affiliate,
    },
    { strict: false }
  );

  try {
    const dbResponse = await newProfile.save();
  } catch (error) {
    return NextResponse.json(
      { error: "Error on '/api/createExpressProfile': " + error },
      { status: 400 }
    );
  }
  const promise = await Promise.allSettled([
    callBrevo_createContact(email, name),
  ]);
  return NextResponse.json({
    msg: 'Successfuly created new Profile: ' + newProfile.email,
  });
}

export const maxDuration = 5;
