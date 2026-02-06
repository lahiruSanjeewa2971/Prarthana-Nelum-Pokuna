import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Seed Admin User
  console.log('👤 Seeding admin user...');
  const adminEmail = 'rathne1997@gmail.com';
  const adminPassword = 'Abcd@1234';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
    },
  });
  console.log(`✅ Admin user created: ${adminEmail}`);

  // Seed Hotel Info
  console.log('🏨 Seeding hotel info...');
  await prisma.hotel.upsert({
    where: { id: 'default-hotel-id' },
    update: {
      name: 'Prarthana Nelum Pokuna',
      description: 'A serene and elegant venue nestled in the heart of Pothuhera, perfect for weddings, celebrations, and special gatherings. Our beautiful lotus pond setting provides a tranquil atmosphere for your memorable events.',
      address: 'Prarthana, Bulugolla-Dombemada-Wahawa Rd, Pothuhera',
      phone: '0773630458',
      email: 'nelumpokuna@gmail.com',
      map_link: null,
    },
    create: {
      id: 'default-hotel-id',
      name: 'Prarthana Nelum Pokuna',
      description: 'A serene and elegant venue nestled in the heart of Pothuhera, perfect for weddings, celebrations, and special gatherings. Our beautiful lotus pond setting provides a tranquil atmosphere for your memorable events.',
      address: 'Prarthana, Bulugolla-Dombemada-Wahawa Rd, Pothuhera',
      phone: '0773630458',
      email: 'nelumpokuna@gmail.com',
      map_link: null,
    },
  });
  console.log('✅ Hotel info created');

  // Seed Function Types
  const functionTypes = [
    { name: 'Wedding', slug: 'wedding' },
    { name: 'Party', slug: 'party' },
    { name: 'Family Function', slug: 'family-function' },
    { name: 'Birthday Party', slug: 'birthday-party' },
    { name: 'Anniversary Celebration', slug: 'anniversary' },
    { name: 'Corporate Event', slug: 'corporate-event' },
    { name: 'Religious Ceremony', slug: 'religious-ceremony' },
    { name: 'Engagement', slug: 'engagement' },
    { name: 'Reception', slug: 'reception' },
    { name: 'Conference', slug: 'conference' },
    { name: 'Workshop', slug: 'workshop' },
    { name: 'Cultural Event', slug: 'cultural-event' },
  ];

  console.log('📋 Seeding function types...');
  for (const ft of functionTypes) {
    await prisma.functionType.upsert({
      where: { name: ft.name },
      update: { slug: ft.slug },
      create: ft,
    });
  }
  console.log(`✅ Created ${functionTypes.length} function types`);

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
