const webpush = require('web-push');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

webpush.setVapidDetails(
  'mailto:dedo159@example.com',
  'BEXSYqsumAG8bxVv4JLqPD7wmsfWnOhRCsDHmII9sBgEs_vjTLuIC67bKjbjh2fC6ngharDrfqnjO-IGv04jDdI',
  'aHOrks_1saMyiqgMPAC_yu1uUplmpVZ5NOFbxsI0TtE'
);

async function main() {
  const student = await prisma.student.findUnique({
    where: { studentId: '202510377' },
    include: { pushSubscriptions: true }
  });

  if (student && student.pushSubscriptions && student.pushSubscriptions.length > 0) {
    for (const sub of student.pushSubscriptions) {
      try {
        await webpush.sendNotification({
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth }
        }, JSON.stringify({
          title: 'مسار',
          body: 'هذا إشعار مباشر من السيرفر! يعمل في الخلفية 🚀',
          url: '/profile'
        }));
        console.log('Push sent to', sub.endpoint);
      } catch (e) {
        console.error('Error sending', e);
      }
    }
  } else {
    console.log('No subscriptions found for student.');
  }
}

main().finally(() => prisma.$disconnect());
