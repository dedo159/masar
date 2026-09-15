import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import webpush from 'web-push';

const vapidPublicKey = "BEXSYqsumAG8bxVv4JLqPD7wmsfWnOhRCsDHmII9sBgEs_vjTLuIC67bKjbjh2fC6ngharDrfqnjO-IGv04jDdI";
const vapidPrivateKey = "aHOrks_1saMyiqgMPAC_yu1uUplmpVZ5NOFbxsI0TtE";
const vapidSubject = 'mailto:admin@example.com';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export async function POST() {
  try {
    const session = await requireAuth();
    if (session.userType !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
    }

    // Get all subscriptions for this user
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { studentId: session.userId },
    });

    if (subscriptions.length === 0) {
      return NextResponse.json({ error: 'No active subscriptions found for this user' }, { status: 404 });
    }

    const payload = JSON.stringify({
      title: 'مسار',
      body: 'هذا إشعار تجريبي يعمل حتى خارج التطبيق! 🚀',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      url: '/profile'
    });

    // Send push to all registered devices
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
        // If the subscription is no longer valid (e.g. user revoked permission in browser settings)
        if (err.statusCode === 404 || err.statusCode === 410) {
          console.log('Subscription has expired or is no longer valid: ', err);
          await prisma.pushSubscription.delete({ where: { id: sub.id } });
        } else {
          console.error('Error sending push: ', err);
        }
      }
    });

    await Promise.all(pushPromises);

    return NextResponse.json({ success: true, count: subscriptions.length });
  } catch (error) {
    console.error('Test push error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
