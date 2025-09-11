import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if SMTP credentials are configured
    if (!process.env.SMTP_FROM_EMAIL || !process.env.SMTP_PASSWORD) {
      console.error('SMTP credentials not configured. Please set SMTP_FROM_EMAIL and SMTP_PASSWORD environment variables.');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support directly at makercostapp@gmail.com' },
        { status: 503 }
      );
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_FROM_EMAIL, // Your Gmail address
        pass: process.env.SMTP_PASSWORD,   // Your Gmail app password
      },
    });

    // Prepare email content
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: 'makercostapp@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2563eb;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #2563eb;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-radius: 8px; font-size: 14px; color: #1e40af;">
            <p style="margin: 0;"><strong>Reply directly to:</strong> ${email}</p>
            <p style="margin: 5px 0 0 0;">This message was sent from the MakerCost contact form.</p>
          </div>
        </div>
      `,
      replyTo: email, // This allows you to reply directly to the sender
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Check if it's a configuration error
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        return NextResponse.json(
          { error: 'Email service configuration error. Please check SMTP credentials.' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}