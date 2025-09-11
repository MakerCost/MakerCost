# Contact Form Email Setup

The contact form has been implemented and will send emails to `makercostapp@gmail.com`. To enable the email functionality, you need to set up Gmail SMTP credentials.

## Setup Instructions

### 1. Gmail Account Setup

1. Make sure you have access to the `makercostapp@gmail.com` Gmail account
2. Enable 2-Factor Authentication if not already enabled:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable "2-Step Verification"

### 2. Generate App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click "App passwords"
3. Generate a new app password:
   - Select app: "Mail"
   - Select device: "Other" → Name it "MakerCost Contact Form"
4. Copy the generated 16-character password (no spaces)

### 3. Environment Variables

Add these variables to your `.env` or `.env.local` file:

```bash
SMTP_FROM_EMAIL=makercostapp@gmail.com
SMTP_PASSWORD=your-16-character-app-password
```

### 4. Testing

1. Start the development server: `pnpm dev`
2. Go to the contact page: `/contact`
3. Fill out and submit the form
4. Check the `makercostapp@gmail.com` inbox for the email

## Email Features

- **Professional formatting**: HTML email template with proper styling
- **Contact details**: Includes sender's name, email, and subject
- **Reply-to support**: You can reply directly to the sender's email
- **Form validation**: Server-side validation for all required fields
- **Error handling**: Proper error messages for various failure scenarios

## Troubleshooting

### Common Issues

1. **"Invalid login" error**:
   - Check that the Gmail app password is correct
   - Ensure 2FA is enabled on the Gmail account

2. **"Failed to send email" error**:
   - Check your internet connection
   - Verify the Gmail account is not locked or suspended

3. **Environment variables not loaded**:
   - Restart the development server after adding new env variables
   - Check that the `.env.local` file is in the project root

### Testing Without Gmail Setup

If you don't have the Gmail credentials yet, the form will show an error but won't crash. The API will return a proper error message that can help with debugging.

## Security Notes

- App passwords are safer than using your main Gmail password
- Never commit real SMTP credentials to version control
- The `.env` files are already in `.gitignore`
- All email validation is done server-side for security