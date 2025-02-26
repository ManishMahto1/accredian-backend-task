import prisma from '../config/db.js';
import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config(); // Load environment variables

// Function to configure and validate the Nodemailer transporter
const configureTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD;

  // Validate environment variables
  if (!emailUser || !emailPass) {
    throw new Error('Email credentials (EMAIL_USER and EMAIL_PASSWORD) are missing in .env');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass, // Use App Password if 2FA is enabled
      login: true, //  Enable login for less secure apps
    },
  });
};

// Function to send a referral email with enhanced error handling
const sendReferralEmail = async (friendEmail, friendName, userName, transporter) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: friendEmail,
    subject: 'You Have Been Referred!',
    text: `Hello ${friendName},\n\n${userName} has referred you for an opportunity. We look forward to connecting with you!\n\nBest Regards,\nYour Team`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Referral email sent to ${friendEmail}, Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${friendEmail}:`, error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

const createReferral = async (req, res) => {
  let transporter;

  try {
    // Configure the transporter
    transporter = configureTransporter();

    // Validate request body
    const { userName, userEmail, userPhone, friendName, friendEmail, friendPhone, vertical } = req.body || {};
    if (!userName || !userEmail || !userPhone || !friendName || !friendEmail || !friendPhone || !vertical) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields in the request body',
      });
    }

    // Check if user exists, create if not
    let user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: { name: userName, email: userEmail, phone: userPhone },
      });
    }

    // Create referral
    const referral = await prisma.referral.create({
      data: {
        userId: user.id,
        friendName,
        friendEmail,
        friendPhone,
        vertical,
      },
    });

    // Send referral email
    await sendReferralEmail(friendEmail, friendName, userName, transporter);

    res.status(201).json({ success: true, message: 'Referral submitted successfully', referral });
  } catch (error) {
    console.error('Error in createReferral:', error.stack); // Log full stack trace for debugging

    // Handle specific errors
    if (error.message.includes('Email sending failed')) {
      return res.status(500).json({
        success: false,
        error: 'Failed to send referral email',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    } else if (error.message.includes('Email credentials are missing')) {
      return res.status(500).json({
        success: false,
        error: 'Server misconfiguration: Email credentials are missing',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    } else if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }

    // Generic internal server error
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  } finally {
    // Ensure transporter is closed if it supports it (optional for some configurations)
    if (transporter && typeof transporter.close === 'function') {
      transporter.close();
    }
  }
};

export default createReferral;