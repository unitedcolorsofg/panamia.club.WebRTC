import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    screenname: String,
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

// Case-insensitive unique index for screenname
userSchema.index(
  { screenname: 1 },
  {
    unique: true,
    sparse: true,
    collation: { locale: 'en', strength: 2 },
  }
);

const user = mongoose.models.user || mongoose.model('user', userSchema);
export default user;
