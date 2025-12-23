import { NextRequest, NextResponse } from 'next/server';
import {
  emailMigrationConfirmationHtml,
  emailMigrationConfirmationText,
} from '@/auth';
import dbConnect from '@/lib/connectdb';
import user from '@/lib/model/user';
import profile from '@/lib/model/profile';
import emailMigration from '@/lib/model/emailMigration';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Migration token is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find migration record
    const migration = await emailMigration.findOne({
      migrationToken: token,
    });

    if (!migration) {
      return NextResponse.json(
        { error: 'Invalid migration token' },
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date() > migration.expiresAt) {
      await emailMigration.deleteOne({ _id: migration._id });
      return NextResponse.json(
        {
          error:
            'Migration link has expired. Please request a new email migration.',
        },
        { status: 400 }
      );
    }

    const { userId, oldEmail, newEmail } = migration;

    // Check if new email was taken while migration was pending
    const existingUser = await user.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== userId) {
      await emailMigration.deleteOne({ _id: migration._id });
      return NextResponse.json(
        { error: 'Email address is no longer available' },
        { status: 400 }
      );
    }

    // Perform atomic migration with MongoDB transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update user email in nextauth_users collection
      await user.updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        {
          $set: {
            email: newEmail,
            emailVerified: new Date(),
          },
        },
        { session }
      );

      // Update profile email (if profile exists)
      await profile.updateOne(
        { userId: userId },
        { $set: { email: newEmail } },
        { session }
      );

      // Invalidate all sessions for this user (sign out from all devices)
      const client = await clientPromise;
      const db = client.db();
      await db.collection('nextauth_sessions').deleteMany(
        { userId: userId },
        // @ts-ignore - MongoDB client session type mismatch between mongoose and mongodb driver
        { session }
      );

      // Delete the migration record
      await emailMigration.deleteOne({ _id: migration._id }, { session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    // Send confirmation email to old address
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST!,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER!,
        pass: process.env.EMAIL_SERVER_PASSWORD!,
      },
    });

    // Send confirmation to old email (non-blocking - don't fail migration if this fails)
    transport
      .sendMail({
        from: process.env.EMAIL_FROM!,
        to: oldEmail,
        subject: 'Your Pana MIA Account Email Was Changed',
        html: emailMigrationConfirmationHtml({
          oldEmail,
          newEmail,
          timestamp,
        }),
        text: emailMigrationConfirmationText({
          oldEmail,
          newEmail,
          timestamp,
        }),
      })
      .catch((error: Error) => {
        console.error('Failed to send confirmation email:', error);
      });

    return NextResponse.json({
      success: true,
      message: 'Email migrated successfully',
      newEmail,
    });
  } catch (error) {
    console.error('Email migration completion error:', error);
    return NextResponse.json(
      { error: 'Failed to complete email migration. Please try again.' },
      { status: 500 }
    );
  }
}

export const maxDuration = 10;
