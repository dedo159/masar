import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import webpush from 'web-push';

const vapidPublicKey = "BEXSYqsumAG8bxVv4JLqPD7wmsfWnOhRCsDHmII9sBgEs_vjTLuIC67bKjbjh2fC6ngharDrfqnjO-IGv04jDdI";
const vapidPrivateKey = "aHOrks_1saMyiqgMPAC_yu1uUplmpVZ5NOFbxsI0TtE";
const vapidSubject = 'mailto:dedo159@example.com';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    let body: any = {};
    try {
      body = await request.json();
    } catch {}

    const targetStudentId = (session && session.userType === 'student' && session.userId)
      ? session.userId
      : (body.studentId || 's-001');

    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
    }

    // Get all subscriptions for this user
    let subscriptions = await prisma.pushSubscription.findMany({
      where: { studentId: targetStudentId },
      orderBy: { createdAt: 'desc' },
    });

    // Fallback: if none found for targetStudentId, check any registered push subscriptions
    if (subscriptions.length === 0) {
      subscriptions = await prisma.pushSubscription.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
      });
    }

    if (subscriptions.length === 0) {
      return NextResponse.json({
        error: 'لم يتم العثور على أجهزة مسجلة في خدمة الإشعارات. يرجى تفعيل إشعارات الهاتف أولاً.',
        noSubscriptions: true
      }, { status: 404 });
    }

    const payload = JSON.stringify({
      title: body.title || 'مسار — إشعار تجريبي 🔔',
      body: body.body || 'هذا إشعار تجريبي ناجح من تطبيق مسار يعمل حتى خارج المتصفح! 🚀',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      url: body.url || '/notifications'
    });

    let sentCount = 0;
    const errors: string[] = [];

    // Send push to all registered devices
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

export async function GET(request: Request) {
  return POST(request);
}
