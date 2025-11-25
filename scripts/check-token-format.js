require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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

async function checkTokens() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const tokens = await VerificationToken.find().limit(5).exec();
    console.log('Sample verification tokens in database:');
    console.log(JSON.stringify(tokens, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkTokens();
