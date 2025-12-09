// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

import dbConnect from '@/lib/connectdb';
import { forceInt, forceString } from '@/lib/standardized';
import { getSearch } from '@/lib/server/directory';
import user from '@/lib/model/user';
import { getAdminDashboard, getAdminSearch } from '@/lib/server/admin';

interface ResponseData {
  error?: string;
  success?: boolean;
  msg?: string;
  data?: any[] | any;
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

  const dashboardMetrics = await getAdminDashboard();
  // console.log("dashboardMetrics", dashboardMetrics);
  if (dashboardMetrics) {
    return NextResponse.json({
      success: true,
      data: dashboardMetrics,
      pagination: {},
    });
  }
  return NextResponse.json(
    { success: true, data: [], pagination: {} },
    { status: 200 }
  );
}
