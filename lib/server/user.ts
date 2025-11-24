import dbConnect from 'pages/api/auth/lib/connectdb';
import user from 'pages/api/auth/lib/model/user';
import { generateAffiliateCode } from '../standardized';

export const getUser = async (email: string) => {
  await dbConnect();
  // TODO: Remove type assertion after upgrading to Mongoose v8 in Phase 5
  return await (user as any).findOne({ email: email });
};

export const uniqueAffiliateCode = async () => {
  let affiliateCode = '';
  for (let i = 0; i < 5; i++) {
    // if 5 loops all match something is wrong
    affiliateCode = generateAffiliateCode();
    const user = await getUserByAffiliateCode(affiliateCode);
    if (!user) {
      break; // unique affiliate code found
    }
  }
  return affiliateCode;
};

export const getUserByAffiliateCode = async (code: string) => {
  await dbConnect();
  // TODO: Remove type assertion after upgrading to Mongoose v8 in Phase 5
  return await (user as any).findOne({ 'affiliate.code': code });
};
