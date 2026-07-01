// scripts/seedAdmin.ts
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { dbConnect } from '../lib/mongoose';

const ADMIN_EMAIL = 'aditya16@gmail.com';
const ADMIN_PASSWORD = 'Aditya@735515';

async function seed() {
  try {
    await dbConnect();
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log('Admin user already exists');
      return;
    }
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({ email: ADMIN_EMAIL, passwordHash, role: 'admin' });
    console.log('Admin user created');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed().then(() => process.exit());
