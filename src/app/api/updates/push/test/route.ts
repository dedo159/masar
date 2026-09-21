import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import webpush from 'web-push';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@masar.edu.jo';

if (vapidPublicKey && vapidPrivateKey) {
  try {
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
  } catch (e) {
    console.error('Failed to set VAPID details:', e);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.userType !== 'student' || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {}

    const targetStudentId = session.userId;

    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json({ error: 'VAPID keys not configured on server' }, { status: 500 });
    }

    // Get all subscriptions for this student strictly
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { studentId: targetStudentId },
      orderBy: { createdAt: 'desc' },
    });

    if (subscriptions.length === 0) {
      return NextResponse.json({
        error: 'لم يتم العثور على أجهزة مسجلة في خدمة الإشعارات لحسابك. يرجى تفعيل إشعارات الهاتف أولاً من الإعدادات.',
        noSubscriptions: true
      }, { status: 404 });
    }

    const payload = JSON.stringify({
      title: body.title || 'مسار — إشعار تجريبي 🔔',
      body: body.body || 'هذا إشعار تجريبي ناجح من تطبيق مسار يعمل حتى خارج المتصفح! 🚀',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      url: body.url || '/announcements'
    });

    let sentCount = 0;
    const errors: string[] = [];

    // Send push to all registered devices of this student
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification({
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        }, payload);
        sentCount++;
      } catch (err: any) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          console.log('Push subscription expired/unsubscribed:', sub.endpoint);
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        } else {
          console.error('Error sending push:', err);
          errors.push(err.message || String(err));
        }
      }
    }

    if (sentCount === 0 && errors.length > 0) {
      return NextResponse.json({
        error: 'فشل تسليم الإشعار للهاتف (قد يكون اشتراك الجهاز قديماً أو انتهت صلاحيته)',
        details: errors
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      sentCount,
      totalDevices: subscriptions.length,
      message: `تم إرسال الإشعار بنجاح إلى ${sentCount} جهاز!`
    });
  } catch (error: any) {
    console.error('Test push error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
