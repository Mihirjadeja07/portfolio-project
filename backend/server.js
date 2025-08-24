// server.js

// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path'); // Import the 'path' module

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3001; // Use Render's port or 3001 for local

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());

// --- Serve Frontend Files ---
// CORRECTED PATH: This now correctly points to the 'frontend' folder in the root.
app.use(express.static(path.join(__dirname, '..', 'frontend')));


// --- Nodemailer Transporter Setup ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('Error with email transporter configuration:', error);
  } else {
    console.log('Email server is ready to take our messages');
  }
});

// --- API Endpoint for Sending Email ---
app.post('/send', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Submission from ${name}`,
        html: `
            <h2>New Message from Portfolio Contact Form</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, message: 'Failed to send email.' });
        }
        console.log('Email sent: ' + info.response);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    });
});

// --- Catch-all to serve index.html for any other request ---
// CORRECTED PATH: This also points to the correct index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});


// --- Start the Server ---
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
