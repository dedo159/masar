const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const subs = await prisma.pushSubscription.findMany();
  console.log('Total subs:', subs.length);
  console.log(subs);
}
main().finally(() => prisma.$disconnect());
