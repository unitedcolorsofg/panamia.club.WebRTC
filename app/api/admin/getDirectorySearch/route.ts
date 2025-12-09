// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

import dbConnect from '@/lib/connectdb';
import { forceInt, forceString } from '@/lib/standardized';
import { getSearch } from '@/lib/server/directory';
import user from '@/lib/model/user';
import { getAdminSearch } from '@/lib/server/admin';

interface ResponseData {
  error?: string;
  success?: boolean;
  msg?: string;
  data?: any[];
  pagination?: {};
}

export async function GET(request: NextRequest) {
  const session = await auth();

  //if (!session) { // secured route
  //  return NextResponse.json({ error: "Not Authorized:session" }, { status: 401 });
  //}

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

  const rq = request.nextUrl.searchParams;
  const pageNum = forceInt(forceString(rq?.get('page') || undefined, '1'), 1);
  const pageLimit = forceInt(
    forceString(rq?.get('limit') || undefined, '20'),
    20
  );
  const searchTerm = forceString(rq?.get('q') || undefined, '');

  const params = { pageNum, pageLimit, searchTerm };

  const apiResponse = await getAdminSearch(params);
  if (apiResponse) {
    // console.log(apiResponse);
    return NextResponse.json(apiResponse, { status: 200 });
  }
  return NextResponse.json(
    { success: true, data: [], pagination: {} },
    { status: 200 }
  );
}
