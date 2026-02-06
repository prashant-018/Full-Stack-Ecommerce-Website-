const nodemailer = require('nodemailer');

/**
 * Create reusable transporter object using SMTP transport
 * Configure based on environment variables
 */
const createTransporter = () => {
  // For development, you can use Gmail or other SMTP services
  // For production, use a service like SendGrid, Mailgun, or AWS SES
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * Send password reset email
 * @param {String} email - User's email address
 * @param {String} resetToken - Password reset token
 * @param {String} resetUrl - Password reset URL
 */
const sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'E-Commerce Store'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Password Reset Request</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">You requested to reset your password. Click the button below to reset it:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
            </div>
            <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #999; word-break: break-all;">${resetUrl}</p>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">This link will expire in 1 hour.</p>
            <p style="font-size: 14px; color: #666;">If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} E-Commerce Store. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request
        
        You requested to reset your password. Click the link below to reset it:
        ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request this, please ignore this email.
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

module.exports = {
  createTransporter,
  sendPasswordResetEmail
};

