// scripts/resetAdmin.js
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://adityadharhipl_db_user:wj6E4z0vUpeR60Ir@cluster0.lvolpp6.mongodb.net/wedding?appName=Cluster0";
const ADMIN_EMAIL = 'aditya16@gmail.com';
const ADMIN_PASSWORD = 'Aditya@735515';

// Define schema directly to avoid import errors
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function reset() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    
    // Find or create admin
    const admin = await User.findOne({ email: ADMIN_EMAIL });
    if (admin) {
      admin.passwordHash = hash;
      await admin.save();
      console.log(`Updated admin password for ${ADMIN_EMAIL}`);
    } else {
      await User.create({
        email: ADMIN_EMAIL,
        passwordHash: hash,
        role: 'admin'
      });
      console.log(`Created admin user with email ${ADMIN_EMAIL}`);
    }

    const users = await User.find();
    console.log('Current users in DB:', users.map(u => ({ email: u.email, role: u.role })));

  } catch (err) {
    console.error('Reset error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

reset();
