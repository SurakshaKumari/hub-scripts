const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.notification.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.script.deleteMany();
  await prisma.executor.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password123', salt);

  const users = [];
  for (let i = 0; i < 10; i++) {
    users.push({
      username: faker.internet.username(),
      email: faker.internet.email(),
      password,
      role: i === 0 ? 'admin' : 'user',
      avatar: faker.image.avatar(),
    });
  }
  
  const createdUsers = [];
  for (const user of users) {
    createdUsers.push(await prisma.user.create({ data: user }));
  }

  const executors = [];
  for (let i = 0; i < 5; i++) {
    executors.push({
      name: faker.software.name ? faker.software.name() : faker.company.name(),
      description: faker.lorem.sentence(),
      imageUrl: faker.image.url(),
      downloadUrl: faker.internet.url(),
      isVerified: faker.datatype.boolean(),
      isFeatured: faker.datatype.boolean(),
    });
  }
  await prisma.executor.createMany({ data: executors });

  const scripts = [];
  for (let i = 0; i < 20; i++) {
    const script = await prisma.script.create({
      data: {
        title: faker.word.words(3),
        description: faker.lorem.paragraph(),
        code: `print("Hello World ${i}")`,
        game: faker.word.words(2),
        category: 'General',
        thumbnailUrl: faker.image.url(),
        status: 'approved',
        isVerified: faker.datatype.boolean(),
        isBumped: faker.datatype.boolean(),
        isKeyless: faker.datatype.boolean(),
        viewCount: faker.number.int({ min: 0, max: 1000 }),
        authorId: createdUsers[faker.number.int({ min: 0, max: 9 })].id,
      }
    });
    scripts.push(script);
  }

  for (let i = 0; i < 30; i++) {
    await prisma.comment.create({
      data: {
        content: faker.lorem.sentence(),
        userId: createdUsers[faker.number.int({ min: 0, max: 9 })].id,
        scriptId: scripts[faker.number.int({ min: 0, max: 19 })].id,
      }
    });
  }

  for (const user of createdUsers) {
    const scriptsVoted = new Set();
    for(let i=0; i<5; i++) {
      const scriptId = scripts[faker.number.int({ min: 0, max: 19 })].id;
      if (!scriptsVoted.has(scriptId)) {
        scriptsVoted.add(scriptId);
        await prisma.vote.create({
          data: {
            type: faker.helpers.arrayElement(['UP', 'DOWN']),
            userId: user.id,
            scriptId,
          }
        });
      }
    }
  }

  for (const user of createdUsers) {
    const scriptsFaved = new Set();
    for(let i=0; i<3; i++) {
      const scriptId = scripts[faker.number.int({ min: 0, max: 19 })].id;
      if (!scriptsFaved.has(scriptId)) {
        scriptsFaved.add(scriptId);
        await prisma.favorite.create({
          data: {
            userId: user.id,
            scriptId,
          }
        });
      }
    }
  }

  for (const user of createdUsers) {
    await prisma.notification.create({
      data: {
        message: faker.lorem.sentence(),
        userId: user.id,
      }
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
