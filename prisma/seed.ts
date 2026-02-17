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
    { name: 'Wedding', slug: 'wedding', price: 150000, description: 'Complete wedding ceremony venue with full amenities' },
    { name: 'Party', slug: 'party', price: 75000, description: 'Perfect venue for social gatherings and celebrations' },
    { name: 'Family Function', slug: 'family-function', price: 60000, description: 'Intimate setting for family gatherings' },
    { name: 'Birthday Party', slug: 'birthday-party', price: 50000, description: 'Fun and vibrant space for birthday celebrations' },
    { name: 'Anniversary Celebration', slug: 'anniversary', price: 65000, description: 'Elegant setting for anniversary celebrations' },
    { name: 'Corporate Event', slug: 'corporate-event', price: 100000, description: 'Professional venue for corporate gatherings' },
    { name: 'Religious Ceremony', slug: 'religious-ceremony', price: 55000, description: 'Peaceful environment for religious events' },
    { name: 'Engagement', slug: 'engagement', price: 85000, description: 'Romantic setting for engagement ceremonies' },
    { name: 'Reception', slug: 'reception', price: 120000, description: 'Grand reception hall with premium facilities' },
    { name: 'Conference', slug: 'conference', price: 90000, description: 'Modern conference facilities with AV equipment' },
    { name: 'Workshop', slug: 'workshop', price: 70000, description: 'Interactive space for workshops and training' },
    { name: 'Cultural Event', slug: 'cultural-event', price: 80000, description: 'Versatile venue for cultural programs' },
  ];

  console.log('📋 Seeding function types...');
  for (const ft of functionTypes) {
    await prisma.functionType.upsert({
      where: { name: ft.name },
      update: { slug: ft.slug, price: ft.price, description: ft.description },
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
