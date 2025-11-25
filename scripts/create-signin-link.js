require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const crypto = require('crypto');

const EMAIL = process.argv[2];
const Schema = mongoose.Schema;

// Define VerificationToken schema (NextAuth)
const verificationTokenSchema = new Schema({
  identifier: String,
  token: String,
  expires: Date,
});

const VerificationToken =
  mongoose.models.nextauth_verification_tokens ||
  mongoose.model(
    'nextauth_verification_tokens',
    verificationTokenSchema,
    'nextauth_verification_tokens'
  );

const MONGODB_URI = process.env.MONGODB_URI;

async function createSignInLink() {
  if (!EMAIL) {
    console.error('❌ Error: Please provide an email address');
    console.log('Usage: node scripts/create-signin-link.js <email>');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!\n');

    // Delete any existing tokens for this email
    await VerificationToken.deleteMany({ identifier: EMAIL });

    // Generate a random token (similar to how NextAuth does it)
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiration to 24 hours from now
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    // Create new verification token
    const newToken = new VerificationToken({
      identifier: EMAIL,
      token: token,
      expires: expires,
    });

    await newToken.save();

    // Construct the sign-in URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const signInUrl = `${baseUrl}/api/auth/callback/email?token=${token}&email=${encodeURIComponent(EMAIL)}`;

    console.log('✅ New sign-in link created!\n');
    console.log('Email:', EMAIL);
    console.log('Expires:', expires.toISOString());
    console.log('\n📧 Sign-in link:');
    console.log(signInUrl);
    console.log('\nCopy and paste this URL into your browser to sign in.\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

createSignInLink();
