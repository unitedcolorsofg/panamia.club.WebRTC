require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const ADMIN_EMAIL = process.argv[2];
const Schema = mongoose.Schema;

// Define User schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    status: {
      role: String,
      locked: Date,
    },
    affiliate: {},
    alternate_emails: [],
    zip_code: String,
    following: [],
  },
  {
    timestamps: true,
  }
);

// Define Profile schema
const profileSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: String,
    active: Boolean,
    status: {},
    administrative: {},
    locally_based: String,
    details: String,
    background: String,
    five_words: {
      type: String,
      required: true,
      index: true,
    },
    socials: {},
    phone_number: String,
    whatsapp_community: Boolean,
    pronouns: {},
    tags: String,
    hearaboutus: String,
    affiliate: String,
    counties: {},
    categories: {},
    primary_address: {},
    gentedepana: {},
    geo: {},
    locations: [],
    images: {},
    linked_profiles: [],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.user || mongoose.model('user', userSchema);
const Profile =
  mongoose.models.profile || mongoose.model('profile', profileSchema);

const MONGODB_URI = process.env.MONGODB_URI;

async function addAdmin() {
  if (!ADMIN_EMAIL) {
    console.error('❌ Error: Please provide an email address');
    console.log('Usage: node scripts/add-admin.js <email>');
    process.exit(1);
  }
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    // Update or create User with admin role
    console.log(`\nSetting up user: ${ADMIN_EMAIL}`);
    const user = await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        $set: {
          email: ADMIN_EMAIL,
          'status.role': 'admin',
        },
      },
      { upsert: true, new: true }
    );
    console.log('✓ User updated/created with admin role');

    // Check if profile exists and update active status
    console.log(`\nChecking profile for: ${ADMIN_EMAIL}`);
    const profile = await Profile.findOne({ email: ADMIN_EMAIL });

    if (profile) {
      profile.active = true;
      await profile.save();
      console.log('✓ Profile marked as active');
      console.log(`  Profile name: ${profile.name}`);
      console.log(`  Profile slug: ${profile.slug || 'Not set'}`);
    } else {
      console.log(
        '⚠ No profile found - user will need to create a profile through the UI'
      );
    }

    console.log('\n✅ Admin setup complete!');
    console.log(`\nUser ${ADMIN_EMAIL} is now:`);
    console.log('  - Admin role: ✓');
    console.log(`  - Profile active: ${profile ? '✓' : 'N/A (no profile)'}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

addAdmin();
