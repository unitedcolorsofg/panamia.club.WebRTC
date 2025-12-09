// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/connectdb';
import contactUs from '@/lib/model/contactus';
import BrevoApi from '@/lib/brevo_api';
import { splitName } from '@/lib/standardized';

interface ResponseData {
  error?: string;
  msg?: string;
}

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
    if (brevo.config.lists.webformContactUs) {
      list_ids.push(parseInt(brevo.config.lists.webformContactUs));
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
  // validate if it is a POST

  // get and validate body variables
  const { name, email, message } = body;

  if (!validateEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' });
  }

  await dbConnect();
  const newContactUs = new contactUs({
    name: name,
    email: email,
    message: message,
    acknowledged: false,
  });

  try {
    const dbResponse = await newContactUs.save();
  } catch (error) {
    return NextResponse.json({
      error: "Error on '/api/createContactUs': " + error,
    });
  }
  const promise = await Promise.allSettled([
    callBrevo_createContact(email, name),
  ]);
  return NextResponse.json({
    msg: 'Successfuly created new Contact Us: ' + newContactUs,
  });
}
