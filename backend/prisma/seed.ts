import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Створюємо адміністратора
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@musicshop.com' },
    update: {},
    create: {
      email: 'admin@musicshop.com',
      password: adminPassword,
          firstName: 'Адміністратор',
    lastName: 'Системи',
      role: 'ADMIN',
    },
  });

  // Створюємо тестового користувача
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@musicshop.com' },
    update: {},
    create: {
      email: 'user@musicshop.com',
      password: userPassword,
              firstName: 'Тестовий',
      lastName: 'Користувач',
      role: 'USER',
    },
  });

  // Створюємо категорії
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Гітари' },
      update: {},
      create: {
        name: 'Гітари',
        description: 'Акустичні та електрогітари',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Клавішні' },
      update: {},
      create: {
        name: 'Клавішні',
        description: 'Піаніно, синтезатори, MIDI-клавіатури',
        imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Ударні' },
      update: {},
      create: {
        name: 'Ударні',
        description: 'Барабани, перкусія, тарілки',
        imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Духові' },
      update: {},
      create: {
        name: 'Духові',
        description: 'Саксофони, труби, флейти',
        imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Струнні' },
      update: {},
      create: {
        name: 'Струнні',
        description: 'Скрипки, віолончелі, контрабаси',
        imageUrl: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=400',
      },
    }),
  ]);

  // Створюємо товари
  const products = await Promise.all([
    // Гітари
    prisma.product.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Fender Stratocaster',
        description: 'Легендарна електрогітара з характерним звуком',
        price: 899.99,
        stock: 5,
        brand: 'Fender',
        model: 'Stratocaster',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Gibson Les Paul',
        description: 'Класична електрогітара з потужним звуком',
        price: 1299.99,
        stock: 3,
        brand: 'Gibson',
        model: 'Les Paul',
        imageUrl: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=400',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Martin D-28',
        description: 'Преміум акустична гітара',
        price: 2499.99,
        stock: 2,
        brand: 'Martin',
        model: 'D-28',
        imageUrl: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400',
        categoryId: categories[0].id,
      },
    }),

    // Клавішні
    prisma.product.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Yamaha P-125',
        description: 'Цифрове піаніно з 88 клавішами',
        price: 699.99,
        stock: 8,
        brand: 'Yamaha',
        model: 'P-125',
        imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400',
        categoryId: categories[1].id,
      },
    }),
    prisma.product.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: 'Roland Juno-DS61',
        description: 'Синтезатор з 61 клавішею',
        price: 899.99,
        stock: 4,
        brand: 'Roland',
        model: 'Juno-DS61',
        imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
        categoryId: categories[1].id,
      },
    }),

    // Ударні
    prisma.product.upsert({
      where: { id: 6 },
      update: {},
      create: {
        name: 'Pearl Export',
        description: 'Ударна установка для початківців',
        price: 599.99,
        stock: 6,
        brand: 'Pearl',
        model: 'Export',
        imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400',
        categoryId: categories[2].id,
      },
    }),
    prisma.product.upsert({
      where: { id: 7 },
      update: {},
      create: {
        name: 'Zildjian A Custom',
        description: 'Набір тарілок професійного рівня',
        price: 799.99,
        stock: 3,
        brand: 'Zildjian',
        model: 'A Custom',
        imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400',
        categoryId: categories[2].id,
      },
    }),

    // Духові
    prisma.product.upsert({
      where: { id: 8 },
      update: {},
      create: {
        name: 'Selmer Mark VI',
        description: 'Саксофон альт професійного рівня',
        price: 3499.99,
        stock: 1,
        brand: 'Selmer',
        model: 'Mark VI',
        imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
        categoryId: categories[3].id,
      },
    }),

    // Струнні
    prisma.product.upsert({
      where: { id: 9 },
      update: {},
      create: {
        name: 'Stradivarius Violin',
        description: 'Скрипка ручної роботи',
        price: 15999.99,
        stock: 1,
        brand: 'Stradivarius',
        model: 'Classic',
        imageUrl: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=400',
        categoryId: categories[4].id,
      },
    }),

    // Додаткові позиції для більш багатого каталогу
    prisma.product.upsert({
      where: { id: 10 },
      update: {},
      create: {
        name: 'Taylor 214ce',
        description: 'Універсальна акустична гітара для сцени та студії',
        price: 1099.99,
        stock: 4,
        brand: 'Taylor',
        model: '214ce',
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { id: 11 },
      update: {},
      create: {
        name: 'Korg Minilogue XD',
        description: 'Напів-аналоговий синтезатор з потужним звуком',
        price: 629.99,
        stock: 7,
        brand: 'Korg',
        model: 'Minilogue XD',
        imageUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=400',
        categoryId: categories[1].id,
      },
    }),
    prisma.product.upsert({
      where: { id: 12 },
      update: {},
      create: {
        name: 'DW Performance Series',
        description: 'Професійна ударна установка',
        price: 2499.99,
        stock: 2,
        brand: 'DW',
        model: 'Performance',
        imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400',
        categoryId: categories[2].id,
      },
    }),
    prisma.product.upsert({
      where: { id: 13 },
      update: {},
      create: {
        name: 'Yamaha YAS-280',
        description: 'Навчальний альт-саксофон для початківців',
        price: 999.99,
        stock: 5,
        brand: 'Yamaha',
        model: 'YAS-280',
        imageUrl: 'https://images.unsplash.com/photo-1516922478860-67bcd477a389?w=400',
        categoryId: categories[3].id,
      },
    }),
    prisma.product.upsert({
      where: { id: 14 },
      update: {},
      create: {
        name: 'Yamaha V5',
        description: 'Скрипка для учнів з відмінним співвідношенням ціна/якість',
        price: 349.99,
        stock: 10,
        brand: 'Yamaha',
        model: 'V5',
        imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
        categoryId: categories[4].id,
      },
    }),
  ]);

  console.log('✅ База даних успішно заповнена тестовими даними!');
  console.log('👤 Адміністратор: admin@musicshop.com / admin123');
  console.log('👤 Користувач: user@musicshop.com / user123');
  console.log(`📦 Створено ${categories.length} категорій та ${products.length} товарів`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
