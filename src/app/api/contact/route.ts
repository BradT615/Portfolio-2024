import { NextResponse } from 'next/server';
import { sgMail, MY_EMAIL, FROM_EMAIL, FROM_NAME, LOGO_IMG, emailStyle, headerStyle, contentStyle } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // Prepare notification email to yourself
    const notificationEmail = {
      to: MY_EMAIL,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME
      },
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="${emailStyle}">
          <div style="${headerStyle}">
            ${LOGO_IMG}
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
    };

    // Prepare confirmation email to the user
    const confirmationEmail = {
      to: email,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME
      },
      replyTo: MY_EMAIL,
      subject: 'Thanks for reaching out!',
      html: `
        <div style="${emailStyle}">
          <div style="${headerStyle}">
            ${LOGO_IMG}
            <h2 style="color: #2563eb; margin-top: 15px;">Thank you for your message!</h2>
          </div>
          <p>Hi ${name},</p>
          <p>I've received your message and will get back to you as soon as possible.</p>
          <div style="${contentStyle}">
            <p><strong>Your message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p>Best regards,<br>Brad Titus</p>
          <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
            <p>© ${new Date().getFullYear()} Brad Titus</p>
          </div>
        </div>
      `
    };

    // Send both emails
    await Promise.all([
      sgMail.send(notificationEmail),
      sgMail.send(confirmationEmail)
    ]);

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
