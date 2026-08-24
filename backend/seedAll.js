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

  const executorsList = ['Synapse X', 'Krnl', 'Fluxus', 'Electron', 'Oxygen U', 'Comet', 'JJSploit', 'Script-Ware', 'Celery', 'Hydrogen'];
  const executors = [];
  for (let i = 0; i < executorsList.length; i++) {
    executors.push({
      name: executorsList[i],
      description: `The best executor for Roblox. ${faker.lorem.sentence()}`,
      imageUrl: `https://picsum.photos/seed/${faker.string.alphanumeric(10)}/800/600`,
      downloadUrl: faker.internet.url(),
      isVerified: true,
      isFeatured: i < 3,
    });
  }
  await prisma.executor.createMany({ data: executors });

  const games = ['Blox Fruits', 'Arsenal', 'Adopt Me!', 'Jailbreak', 'Murder Mystery 2', 'Pet Simulator X', 'King Legacy', 'Da Hood', 'BedWars', 'Tower of Hell'];
  const scriptTypes = ['Auto Farm', 'Aimbot', 'ESP', 'Infinite Jump', 'Speed Hack', 'Kill All', 'Auto Quest', 'God Mode', 'Money Glitch', 'Item Dupe'];
  const categories = ['Combat', 'Farming', 'Minigame', 'Utility', 'Movement', 'Visuals'];

  const scripts = [];
  for (let i = 0; i < 50; i++) {
    const game = faker.helpers.arrayElement(games);
    const scriptType = faker.helpers.arrayElement(scriptTypes);
    const script = await prisma.script.create({
      data: {
        title: `${game} - ${scriptType} Script 2026`,
        description: `This is a highly advanced script for ${game} featuring ${scriptType} and many more features. Completely keyless and undetected.\n\nFeatures:\n- ${scriptType}\n- Anti-Ban\n- Clean UI`,
        code: `print("Loaded ${scriptType} for ${game}")\n-- Awesome script logic here\nwhile true do wait(1) print("farming...") end`,
        game: game,
        category: faker.helpers.arrayElement(categories),
        thumbnailUrl: `https://picsum.photos/seed/${faker.string.alphanumeric(10)}/800/600`,
        status: 'approved',
        isVerified: faker.datatype.boolean(0.8), // 80% verified
        isBumped: faker.datatype.boolean(0.3),
        isKeyless: faker.datatype.boolean(0.6),
        viewCount: faker.number.int({ min: 50, max: 50000 }),
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
