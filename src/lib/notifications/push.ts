import { prisma } from '@/lib/prisma';
import webpush from 'web-push';

const vapidPublicKey = "BEXSYqsumAG8bxVv4JLqPD7wmsfWnOhRCsDHmII9sBgEs_vjTLuIC67bKjbjh2fC6ngharDrfqnjO-IGv04jDdI";
const vapidPrivateKey = "aHOrks_1saMyiqgMPAC_yu1uUplmpVZ5NOFbxsI0TtE";
const vapidSubject = 'mailto:admin@example.com';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export async function sendNotificationToStudent(studentId: string, title: string, body: string, url: string = '/profile', type: string = 'announcement') {
  try {
    // 1. Create in-app notification in DB (for the bell icon dropdown)
    await prisma.notification.create({
      data: {
        studentId,
        title,
        body,
        type,
        link: url,
      },
    });

    // 2. Send Web Push to all active devices
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { studentId },
    });

    if (subscriptions.length === 0) return;

    const payload = JSON.stringify({
      title,
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      url,
    });

    const pushPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification({
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        }, payload);
      } catch (err: any) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          // Subscription expired or revoked
          await prisma.pushSubscription.delete({ where: { id: sub.id } });
        }
      }
    });

    await Promise.allSettled(pushPromises);
  } catch (error) {
    console.error('Failed to send notification to student:', studentId, error);
  }
}

export async function sendNotificationToAllStudents(title: string, body: string, url: string = '/profile', type: string = 'announcement') {
  try {
    const students = await prisma.student.findMany({ select: { id: true } });
    
    // Instead of doing it one by one and waiting, we can do it in background or chunks
    // For demo purposes, we'll just loop
    for (const student of students) {
      await sendNotificationToStudent(student.id, title, body, url, type);
    }
  } catch (error) {
    console.error('Failed to send broadcast notification', error);
  }
}
