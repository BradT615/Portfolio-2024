import sgMail from '@sendgrid/mail';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const MY_EMAIL = 'bradtitus615@gmail.com';
const FROM_EMAIL = 'noreply@bradtitus.dev';
const FROM_NAME = 'Brad Titus';

// List of bot identifiers
const BOT_IDENTIFIERS = [
  'bot',
  'spider',
  'crawl',
  'prerender',
  'headless',
  'lighthouse',
  'pingdom',
  'pagespeed',
  'googlebot',
  'chrome-lighthouse',
  'gtmetrix'
];

function isBot(userAgent: string) {
  const lowerUA = userAgent.toLowerCase();
  return BOT_IDENTIFIERS.some(bot => lowerUA.includes(bot));
}

function getDeviceType(userAgent: string) {
  const lowerUA = userAgent.toLowerCase();
  const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
  return mobileKeywords.some(keyword => lowerUA.includes(keyword)) ? 'Mobile' : 'Desktop';
}

export async function POST() {
  try {
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || 'Unknown';
    const referer = headersList.get('referer') || 'Direct visit';
    
    // Skip bot traffic
    if (isBot(userAgent)) {
      return NextResponse.json(
        { message: 'Bot visit ignored' },
        { status: 200 }
      );
    }

    const deviceType = getDeviceType(userAgent);
    
    // Prepare notification email
    const msg = {
      to: MY_EMAIL,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME
      },
      subject: `New Website Visit - ${deviceType}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Website Visit Detected</h2>
          <p><strong>Device Type:</strong> ${deviceType}</p>
          <p><strong>Referrer:</strong> ${referer}</p>
        </div>
      `
    };

    await sgMail.send(msg);

    return NextResponse.json(
      { message: 'View tracked successfully' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error tracking view:', err);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}