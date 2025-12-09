// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/connectdb';
import signup from '@/lib/model/signup';
import brevoContact from '@/lib/model/brevo_contact';
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
  const existingContact = await brevoContact.findOne({ email: email });
  if (existingContact) {
    return false; // skip since already created/updated in Brevo
  }

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
    if (brevo.config.lists.webformNewsletter) {
      list_ids.push(parseInt(brevo.config.lists.webformNewsletter));
    }
    const brevoResponse = await brevo.createOrUpdateContact(
      email,
      attributes,
      list_ids
    );
    const new_contact = new brevoContact();
    new_contact.email = email;
    new_contact.brevo_id = brevoResponse.id;
    await new_contact.save();
  }
};

const callBrevo_sendAdminNoticeEmail = async (
  name: string,
  email: string,
  signup_type: string
) => {
  const brevo = new BrevoApi();
  const template_id = brevo.config.templates.adminSignupConfirmation;
  if (template_id) {
    const params = {
      name: name,
      email: email,
      signup_type: signup_type,
    };
    const response = await brevo.sendTemplateEmail(
      parseInt(template_id),
      params
    );
    // TODO: Confirm 201 response from Brevo
  }
};

export async function POST(request: NextRequest) {
  const body = await request.json();

  // get and validate body variables
  const { name, email, signup_type } = body;

  await dbConnect();
  const emailUser = await signup.findOne({ email: email });
  if (emailUser) {
    return NextResponse.json(
      { error: 'You are already registered.' },
      { status: 200 }
    );
  }

  if (!validateEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' });
  }

  const newSignup = new signup({
    name: name,
    email: email,
    signupType: signup_type,
  });

  try {
    const dbResponse = await newSignup.save();
  } catch (error) {
    return NextResponse.json({
      error: "Error on '/api/createSignup': " + error,
    });
  }
  const promise = await Promise.allSettled([
    callBrevo_createContact(email, name),
    callBrevo_sendAdminNoticeEmail(name, email, signup_type),
  ]);
  return NextResponse.json({
    msg: 'Successfuly created new Signup: ' + newSignup,
  });
}
