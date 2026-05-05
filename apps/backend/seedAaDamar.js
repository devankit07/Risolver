import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import userModel from './src/models/user.model.js';
import organizationModel from './src/models/organization.model.js';

const seedUser = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/resolver');
    console.log('Connected to DB');

    let org = await organizationModel.findOne({ name: 'Damar Inc' });
    if (!org) {
      org = await organizationModel.create({ name: 'Damar Inc' });
    }

    const email = 'aa@damar.com';
    const password = 'password123'; // Standard password

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.log('User already exists. Updating password to "password123".');
      existingUser.password = password; // Will be hashed by pre-save hook
      await existingUser.save();
    } else {
      await userModel.create({
        name: 'AA Damar',
        email,
        password, // Handled by pre-save
        organizationId: org._id,
        role: 'admin',
        jobTitle: 'Admin',
      });
      console.log('User created successfully.');
    }

    console.log('Done! You can now login with:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUser();
