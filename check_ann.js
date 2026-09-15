const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.announcement.findMany().then(a => {
  console.log('Count:', a.length);
  a.forEach(x => console.log('-', x.title));
}).finally(() => p.$disconnect());
