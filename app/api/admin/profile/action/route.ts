// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/connectdb';
import profile from '@/lib/model/profile';
import BrevoApi from '@/lib/brevo_api';
import { getBrevoConfig } from '@/config/brevo';

interface ResponseData {
  error?: string;
  success?: boolean;
  msg?: string;
  data?: any[];
}

const getProfile = async (email: string) => {
  await dbConnect();
  const Profile = await profile.findOne({ email: email });
  return Profile;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, access, action } = body;
  let totalProfiles = 0;
  try {
    totalProfiles = await profile.countDocuments({ active: true });
  } catch (e: any) {
    console.log('profile.countDocuments failed', e);
  }
  if (email) {
    const emailCheck = email.toString().toLowerCase();
    const existingProfile = await getProfile(emailCheck);
    if (!existingProfile) {
      return NextResponse.json({ success: false, error: 'Profile Not Found' });
    }
    if (existingProfile.status.access !== access) {
      return NextResponse.json({ success: false, error: 'Invalid Access Key' });
    }
    if (action === 'approve') {
      existingProfile.active = true;
      const original_approved_date = existingProfile?.status?.approved;
      existingProfile.status = {
        ...existingProfile.status,
        approved: new Date(),
      };
      await existingProfile.save();
      if (!original_approved_date) {
        // Send Approval email if first time approved
        const brevo = new BrevoApi();
        const brevo_config = getBrevoConfig();
        if (brevo_config.templates.profile.published) {
          const params = {
            name: existingProfile.name,
          };
          const response = await brevo.sendTemplateEmail(
            brevo_config.templates.profile.published,
            params,
            existingProfile.email
          );
        }
      }
      return NextResponse.json(
        {
          success: true,
          data: [
            {
              message: 'Profile has been set active',
              name: existingProfile.name,
              handle: existingProfile.slug,
              total: totalProfiles,
            },
          ],
        },
        { status: 200 }
      );
    }
    if (action === 'decline') {
      existingProfile.active = false;
      const original_declined_date = existingProfile?.status?.declined;
      existingProfile.status = {
        ...existingProfile.status,
        declined: new Date(),
      };
      await existingProfile.save();
      if (!original_declined_date) {
        const brevo = new BrevoApi();
        const brevo_config = getBrevoConfig();
        if (brevo_config.templates.profile.not_published) {
          const params = {
            name: existingProfile.name,
          };
          const response = await brevo.sendTemplateEmail(
            brevo_config.templates.profile.not_published,
            params,
            existingProfile.email
          );
        }
      }
      return NextResponse.json(
        {
          success: true,
          data: [
            {
              message: 'Profile has been declined',
              name: existingProfile.name,
              handle: existingProfile.slug,
              total: totalProfiles,
            },
          ],
        },
        { status: 200 }
      );
    }
  }

  return NextResponse.json(
    { success: false, error: `No Profile Found` },
    { status: 200 }
  );
}
