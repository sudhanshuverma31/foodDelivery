import mongoose from 'mongoose';

export let isMockDatabase = false;

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  console.log('Database URI:', uri);
  if (!uri || uri.trim() === '') {
    console.warn('\n⚠️  No MONGODB_URI found in .env. Booting in MOCK (in-memory) mode.');
    isMockDatabase = true;
    return;
  }

  try {
    // Set a quick timeout of 3000ms so if the local database isn't running, it doesn't hang
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('\n✅ Connected to MongoDB successfully.');
  } catch (error) {
    console.error(`\n❌ MongoDB connection failed: ${(error as Error).message}`);
    console.warn('⚠️  Falling back to MOCK (in-memory) mode.');
    isMockDatabase = true;
  }
}
