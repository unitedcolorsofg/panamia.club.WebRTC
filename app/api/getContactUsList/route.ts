// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

import dbConnect from '@/lib/connectdb';
import contactUs from '@/lib/model/contactus';
import user from '@/lib/model/user';

interface ResponseData {
  error?: string;
  success?: boolean;
  msg?: string;
  data?: any[];
  pagination?: {};
}

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session) {
    // secured route
    return NextResponse.json(
      { error: 'Not Authorized:session' },
      { status: 401 }
    );
  }

  await dbConnect();
  const userSession = session?.user?.email
    ? await user.findOne({ email: session.user.email })
    : null;
  if (!(userSession?.status?.role === 'admin')) {
    return NextResponse.json(
      { error: 'Not Authorized:admin' },
      { status: 401 }
    );
  }

  let page_number = 1;
  if (request.nextUrl.searchParams.get('page_number')) {
    page_number = parseInt(
      request.nextUrl.searchParams.get('page_number')!.toString()
    );
    if (page_number < 1) {
      page_number = 1;
    }
  }

  const per_page = 20;
  const offset = per_page * page_number - per_page;

  const contactUsCount = await contactUs.countDocuments();
  const pagination = {
    count: contactUsCount,
    per_page: per_page,
    offset: offset,
    page_number: page_number,
    total_pages: contactUsCount > 0 ? Math.ceil(contactUsCount / per_page) : 1,
  };
  const contactUsList = await contactUs
    .find()
    .sort({ createdAt: 'desc' })
    .limit(per_page)
    .skip(offset);
  if (contactUsList) {
    return NextResponse.json({
      success: true,
      data: contactUsList,
      pagination: pagination,
    });
  }
  return NextResponse.json({ success: true, data: [], pagination: pagination });
}
