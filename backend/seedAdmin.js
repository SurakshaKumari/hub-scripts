const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedAdmin() {
  const adminEmail = 'admin@probesthub.com';
  const adminUsername = 'admin';
  const adminPassword = 'adminpassword123'; // They can change it later

  try {
    const existing = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existing) {
      console.log(`✅ Admin user already exists. Email: ${adminEmail}`);
      // Ensure role is admin
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: 'admin' }
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await prisma.user.create({
      data: {
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      }
    });

    console.log('✅ Default Admin account created successfully!');
    console.log('-------------------------------------------');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('-------------------------------------------');
    console.log('You can now log in with these credentials and access the /admin portal.');
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
