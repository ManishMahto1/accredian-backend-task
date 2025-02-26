import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Initialize Express app and Prisma Client
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cors());

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // Use the App Password from Google
  },
});

// Function to send a referral email
const sendReferralEmail = async (friendEmail, friendName, userName) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: friendEmail,
    subject: 'You Have Been Referred!',
    text: `Hello ${friendName},\n\n${userName} has referred you for an opportunity. We look forward to connecting with you!\n\nBest Regards,\nYour Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Referral email sent to ${friendEmail}`);
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
  }
};

// POST endpoint to handle referral submission
app.post('/api/referrals', async (req, res) => {
  try {
    const { userName, userEmail, userPhone, friendName, friendEmail, friendPhone, vertical } = req.body;

    // Validate request body
    if (!userName || !userEmail || !userPhone || !friendName || !friendEmail || !friendPhone || !vertical) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if user exists, create if not
    let user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: { name: userName, email: userEmail, phone: userPhone },
      });
    }

    // Create friend entry linked to user
    const friend = await prisma.friend.create({
      data: { name: friendName, email: friendEmail, phone: friendPhone, vertical, userId: user.id },
    });

    // Send referral email
    await sendReferralEmail(friendEmail, friendName, userName);

    res.status(201).json({ message: 'Referral submitted successfully!', data: friend });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET endpoint to fetch all referrals
app.get('/api/referrals', async (req, res) => {
  try {
    const referrals = await prisma.friend.findMany({ include: { user: true } });
    res.json(referrals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
