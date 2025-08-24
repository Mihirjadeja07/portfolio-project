// server.js

// Load environment variables from .env file
// Make sure to run 'npm install dotenv' in your terminal
require('dotenv').config();

// Import required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

// Initialize the Express app
const app = express();
const port = 3001; // You can use any port you prefer

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) so your frontend can communicate with this backend
app.use(cors());
// Parse incoming request bodies in JSON format
app.use(bodyParser.json());

// --- Nodemailer Transporter Setup ---
// This is how Nodemailer will connect to your email service to send emails.
// For security, you MUST use environment variables.
//
// STEPS TO SET UP YOUR .env FILE:
// 1. Create a new file named `.env` in the same directory as this server.js file.
// 2. Open the .env file and add the following two lines, replacing the placeholder values:
//
//    EMAIL_USER=mihirsinh2911@gmail.com
//    EMAIL_PASS=your-gmail-app-password
//
// 3. To get a "gmail-app-password", you need to enable 2-Step Verification on your Google Account
//    and then generate an "App Password". Search "Google App Password" for instructions.
//
const transporter = nodemailer.createTransport({
    service: 'gmail', // Using Gmail service
    auth: {
        user: process.env.EMAIL_USER, // Your email address from .env file
        pass: process.env.EMAIL_PASS  // Your Gmail App Password from .env file
    }
});

// Verify transporter configuration on server start
transporter.verify(function(error, success) {
  if (error) {
    console.log('Error with email transporter configuration:', error);
    console.log('Please ensure you have a .env file with correct EMAIL_USER and EMAIL_PASS variables.');
  } else {
    console.log('Email server is ready to take our messages');
  }
});


// --- API Endpoint for Sending Email ---
// This is the endpoint that your frontend form will send data to.
app.post('/send', (req, res) => {
    // Extract data from the request body sent by the frontend
    const { name, email, message } = req.body;

    // Check if all required fields are present
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Define the email content
    const mailOptions = {
        from: `"${name}" <${email}>`, // Sender address (shows the user's name and email)
        to: process.env.EMAIL_USER, // Receiver address (this will be your email from the .env file)
        subject: `New Contact Form Submission from ${name}`,
        html: `
            <h2>New Message from Portfolio Contact Form</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `
    };

    // Send the email using the transporter
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            // Send an error response back to the frontend
            return res.status(500).json({ success: false, message: 'Failed to send email.' });
        }
        console.log('Email sent: ' + info.response);
        // Send a success response back to the frontend
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    });
});

// --- Start the Server ---
// This starts the server and makes it listen for incoming requests on the specified port.
app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});
