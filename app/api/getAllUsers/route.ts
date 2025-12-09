// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectdb';
import users from '@/lib/model/users';
import bcrypt from 'bcrypt';

interface ResponseData {
  error?: string;
  success?: boolean;
  msg?: string;
  data?: any[];
}
const getAllUsers = async (page: number) => {
  await dbConnect();
  const Users = await users
    .find()
    .skip(page * 5)
    .limit(10);
  return Users;
};

export async function GET(request: NextRequest) {
  // validate if it is a GET
  let page = 0;
  let queryVal = '';

  if (request.nextUrl.searchParams.get('page')) {
    page = parseInt(request.nextUrl.searchParams.get('page')!.toString());
  }

  // get all users
  try {
    console.log(page);
    var Users = await getAllUsers(page);
    //console.log(Users);
    return NextResponse.json({ success: true, data: Users }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Error on '/api/getAllusers': " + err });
  }
}
