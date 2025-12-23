import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const emailMigrationSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    oldEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    newEmail: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    migrationToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Auto-delete expired migrations
emailMigrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const emailMigration =
  mongoose.models.emailMigration ||
  mongoose.model('emailMigration', emailMigrationSchema);

export default emailMigration;
