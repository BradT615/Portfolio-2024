import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const resend = new Resend(process.env.RESEND_API_KEY);

const MY_EMAIL = 'bradtitus615@gmail.com';
const FROM_EMAIL = 'noreply@bradtitus.dev';

export async function POST() {
  try {
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || 'Unknown';
    const referer = headersList.get('referer') || 'Direct visit';
    
    // Send notification email
    await resend.emails.send({
      from: FROM_EMAIL,
      to: MY_EMAIL,
      subject: 'New Website Visit',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Website Visit Detected</h2>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Referrer:</strong> ${referer}</p>
          <p><strong>User Agent:</strong> ${userAgent}</p>
        </div>
      `
    });

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