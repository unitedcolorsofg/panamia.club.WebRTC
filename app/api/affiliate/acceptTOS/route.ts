// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/connectdb';
import user from '@/lib/model/user';
import { unguardUser } from '@/lib/user';
import BrevoApi from '@/lib/brevo_api';
import { getBrevoConfig } from '@/config/brevo';

interface ResponseData {
  error?: string;
  success?: boolean;
  msg?: string;
  data?: any[] | any;
}

const getUserByEmail = async (email: string) => {
  await dbConnect();
  return await user.findOne({ email: email });
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'No user session available',
      });
    }
    const email = session.user?.email;
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'No valid email' },
        { status: 200 }
      );
    }

    const { accept_tos } = body;
    console.log('accept_tos', accept_tos);

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      if (existingUser?.affiliate?.accepted_tos) {
        return NextResponse.json(
          {
            success: false,
            error: "You've already accepted the Affiliate Terms of Service",
          },
          { status: 200 }
        );
      }
      if (accept_tos) {
        const affiliate = {
          ...existingUser.affiliate,
        };
        affiliate.accepted_tos = new Date();
        affiliate.activated = true;
        existingUser.affiliate = affiliate;
        try {
          await existingUser.save();
          console.log('existingUser.affilate', existingUser.affiliate);
        } catch (e) {
          if (e instanceof Error) {
            console.log(e.message);
            return NextResponse.json(
              { success: false, error: e.message },
              { status: 500 }
            );
          }
        }
      }
      // send Brevo template email
      const brevo = new BrevoApi();
      const brevo_config = getBrevoConfig();
      const template_id = brevo_config.templates.admin.affiliate_submission;
      if (template_id) {
        const params = {
          name: existingUser.name,
          email: existingUser.email,
          affiliate: existingUser?.affiliate?.code
            ? existingUser.affiliate?.code
            : 'n/a',
        };
        const response = await brevo.sendTemplateEmail(template_id, params);
        console.log('response', response);
      }
      // TODO: Send Brevo email
      return NextResponse.json({
        success: true,
        data: unguardUser(existingUser),
      });
    }
    return NextResponse.json({ success: false, error: 'Could not find User' });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error: `Server Error ${error}`,
    });
  }
}
