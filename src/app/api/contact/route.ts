import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const MY_EMAIL = 'bradtitus615@gmail.com';
const FROM_EMAIL = 'noreply@bradtitus.dev';
const LOGO_URL = 'https://bradtitus.dev/Logo.svg';

// Shared email styles
const emailStyle = `
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const headerStyle = `
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid #eaeaea;
`;

const contentStyle = `
  background-color: #f3f4f6;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
`;

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // Send notification to yourself
    await resend.emails.send({
      from: FROM_EMAIL,
      to: MY_EMAIL,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="${emailStyle}">
          <div style="${headerStyle}">
            <img src="${LOGO_URL}" alt="Brad Titus Logo" style="max-width: 200px; height: auto;" />
            <h2 style="color: #2563eb; margin-top: 15px;">New Contact Form Submission</h2>
          </div>
          <div style="${contentStyle}">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
            <p>This message was sent via your website contact form</p>
          </div>
        </div>
      `
    });

    // Send confirmation to the user
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Thanks for reaching out!',
      html: `
        <div style="${emailStyle}">
          <div style="${headerStyle}">
            <img src="${LOGO_URL}" alt="Brad Titus Logo" style="max-width: 200px; height: auto;" />
            <h2 style="color: #2563eb; margin-top: 15px;">Thank you for your message!</h2>
          </div>
          <p>Hi ${name},</p>
          <p>I've received your message and will get back to you as soon as possible.</p>
          <div style="${contentStyle}">
            <p><strong>Your message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p>Best regards,<br>Brad Titus</p>
          <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #eaeaea; padding-top: 20px;">
            <p>© ${new Date().getFullYear()} Brad Titus. All rights reserved.</p>
          </div>
        </div>
      `
    });

    return NextResponse.json(
      { message: 'Emails sent successfully' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error sending emails:', err);
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}