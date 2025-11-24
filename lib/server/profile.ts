import dbConnect from 'pages/api/auth/lib/connectdb';
import profile from 'pages/api/auth/lib/model/profile';

export const getProfile = async (email: string) => {
  await dbConnect();
  // TODO: Remove type assertion after upgrading to Mongoose v8 in Phase 5
  return await (profile as any).findOne({ email: email });
};

export const getPublicProfile = async (handle: string) => {
  await dbConnect();
  // TODO: Remove type assertion after upgrading to Mongoose v8 in Phase 5
  return await (profile as any).findOne({ slug: handle });
};
