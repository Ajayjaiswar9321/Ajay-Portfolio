/**
 * ==========================================================
 * PORTFOLIO WEBSITE - EXPRESS BACKEND SERVER
 * ==========================================================
 * Author: Ajay Jaiswar
 * Description: Node.js/Express backend for portfolio website
 *
 * HOW TO RUN:
 * 1. Run: npm install
 * 2. Configure .env file with your email credentials
 * 3. Run: npm start
 * 4. Open: http://localhost:3001
 * ==========================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

// ==========================================================
// FILE PATH FOR SAVING FORM SUBMISSIONS
// ==========================================================
const SUBMISSIONS_FILE = path.join(__dirname, 'contact_submissions.txt');

const app = express();
const PORT = process.env.PORT || 3001;

// ==========================================================
// MIDDLEWARE CONFIGURATION
// ==========================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// ==========================================================
// EMAIL CONFIGURATION
// ==========================================================
/**
 * Configure your email in .env file:
 *
 * EMAIL_HOST=smtp.gmail.com
 * EMAIL_PORT=587
 * EMAIL_USER=your-email@gmail.com
 * EMAIL_PASS=your-16-char-app-password
 * EMAIL_TO=ajayjaiswar6340@gmail.com
 */

let transporter = null;
let testEmailUrl = null;

const setupEmailTransporter = async () => {
    // Check if real Gmail credentials are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS &&
        process.env.EMAIL_PASS !== 'YOUR_APP_PASSWORD' &&
        process.env.EMAIL_PASS !== 'PASTE_YOUR_16_CHAR_APP_PASSWORD_HERE') {

        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        transporter.verify((error, success) => {
            if (error) {
                console.log('⚠️  Email configuration error:', error.message);
                console.log('📝 Falling back to test email service...');
                setupTestEmail();
            } else {
                console.log('✅ Email server is ready to send messages');
                console.log(`📧 Emails will be sent to: ${process.env.EMAIL_TO || process.env.EMAIL_USER}`);
            }
        });
    } else {
        // Use Ethereal test email service
        await setupTestEmail();
    }
};

const setupTestEmail = async () => {
    try {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        console.log('📧 Using Ethereal test email service');
        console.log('🔗 View test emails at: https://ethereal.email');
        console.log(`   Login: ${testAccount.user}`);
        console.log(`   Pass:  ${testAccount.pass}`);
    } catch (error) {
        console.log('⚠️  Could not set up test email:', error.message);
    }
};

setupEmailTransporter();

// ==========================================================
// SAVE SUBMISSION TO TEXT FILE
// ==========================================================
/**
 * Save form submission to a local text file
 * @param {Object} data - Form data { name, email, subject, message }
 */
const saveSubmissionToFile = ({ name, email, subject, message }) => {
    const timestamp = new Date().toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'medium'
    });

    const entry = `
════════════════════════════════════════════════════════════
                    NEW CONTACT SUBMISSION
════════════════════════════════════════════════════════════
📅 Date/Time: ${timestamp}
────────────────────────────────────────────────────────────
👤 Name:      ${name}
📧 Email:     ${email}
📝 Subject:   ${subject}
────────────────────────────────────────────────────────────
💬 Message:
${message}
════════════════════════════════════════════════════════════

`;

    try {
        fs.appendFileSync(SUBMISSIONS_FILE, entry, 'utf8');
        console.log('💾 Submission saved to:', SUBMISSIONS_FILE);
    } catch (error) {
        console.error('❌ Error saving to file:', error.message);
    }
};

// ==========================================================
// EMAIL TEMPLATE - Beautiful HTML Design
// ==========================================================

/**
 * Generate beautiful HTML email template
 * @param {Object} data - Form data { name, email, subject, message }
 * @returns {string} HTML email content
 */
const generateEmailTemplate = ({ name, email, subject, message }) => {
    const currentDate = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0f;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0f; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background: linear-gradient(145deg, #0d1b2a, #1a1a2e); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 212, 255, 0.15);">

                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #00d4ff, #00ffcc); padding: 30px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #0a0a0f; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
                                ✉️ New Message Received
                            </h1>
                            <p style="margin: 10px 0 0; color: #0d1b2a; font-size: 14px; opacity: 0.8;">
                                Someone contacted you through your portfolio
                            </p>
                        </td>
                    </tr>

                    <!-- Timestamp -->
                    <tr>
                        <td style="padding: 20px 40px 0; text-align: center;">
                            <p style="margin: 0; color: #a0a0a0; font-size: 12px;">
                                📅 ${currentDate}
                            </p>
                        </td>
                    </tr>

                    <!-- Contact Details -->
                    <tr>
                        <td style="padding: 30px 40px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">

                                <!-- Name -->
                                <tr>
                                    <td style="padding: 15px 20px; background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 10px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="40" style="vertical-align: top;">
                                                    <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #00d4ff, #00ffcc); border-radius: 8px; text-align: center; line-height: 36px; font-size: 16px;">
                                                        👤
                                                    </div>
                                                </td>
                                                <td style="padding-left: 15px; vertical-align: top;">
                                                    <p style="margin: 0 0 4px; color: #a0a0a0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Name</p>
                                                    <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${escapeHtml(name)}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr><td style="height: 12px;"></td></tr>

                                <!-- Email -->
                                <tr>
                                    <td style="padding: 15px 20px; background: rgba(255,255,255,0.03); border-radius: 12px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="40" style="vertical-align: top;">
                                                    <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #00d4ff, #00ffcc); border-radius: 8px; text-align: center; line-height: 36px; font-size: 16px;">
                                                        📧
                                                    </div>
                                                </td>
                                                <td style="padding-left: 15px; vertical-align: top;">
                                                    <p style="margin: 0 0 4px; color: #a0a0a0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Email</p>
                                                    <a href="mailto:${escapeHtml(email)}" style="color: #00d4ff; font-size: 16px; font-weight: 600; text-decoration: none;">${escapeHtml(email)}</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr><td style="height: 12px;"></td></tr>

                                <!-- Subject -->
                                <tr>
                                    <td style="padding: 15px 20px; background: rgba(255,255,255,0.03); border-radius: 12px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="40" style="vertical-align: top;">
                                                    <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #00d4ff, #00ffcc); border-radius: 8px; text-align: center; line-height: 36px; font-size: 16px;">
                                                        📝
                                                    </div>
                                                </td>
                                                <td style="padding-left: 15px; vertical-align: top;">
                                                    <p style="margin: 0 0 4px; color: #a0a0a0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Subject</p>
                                                    <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${escapeHtml(subject)}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                    <!-- Message -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 12px; padding: 25px;">
                                <p style="margin: 0 0 12px; color: #00d4ff; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                                    💬 Message
                                </p>
                                <p style="margin: 0; color: #e0e0e0; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${escapeHtml(message)}</p>
                            </div>
                        </td>
                    </tr>

                    <!-- Reply Button -->
                    <tr>
                        <td style="padding: 0 40px 30px; text-align: center;">
                            <a href="mailto:${escapeHtml(email)}?subject=Re: ${escapeHtml(subject)}"
                               style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #00ffcc); color: #0a0a0f; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 600; font-size: 14px; letter-spacing: 0.5px;">
                                Reply to ${escapeHtml(name.split(' ')[0])} →
                            </a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: rgba(0,0,0,0.3); padding: 25px 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
                            <p style="margin: 0 0 8px; color: #ffffff; font-size: 16px; font-weight: 700;">
                                Ajay Jaiswar
                            </p>
                            <p style="margin: 0; color: #a0a0a0; font-size: 12px;">
                                QA Analyst & Frontend Developer
                            </p>
                            <p style="margin: 15px 0 0; color: #6b6b6b; font-size: 11px;">
                                This email was sent from your portfolio contact form
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

/**
 * Generate plain text email (fallback)
 */
const generatePlainTextEmail = ({ name, email, subject, message }) => {
    return `
═══════════════════════════════════════════
       NEW CONTACT FORM SUBMISSION
═══════════════════════════════════════════

📅 Date: ${new Date().toLocaleString('en-IN')}

───────────────────────────────────────────
CONTACT DETAILS
───────────────────────────────────────────

👤 Name:    ${name}
📧 Email:   ${email}
📝 Subject: ${subject}

───────────────────────────────────────────
MESSAGE
───────────────────────────────────────────

${message}

═══════════════════════════════════════════
Sent from Ajay Jaiswar's Portfolio Website
═══════════════════════════════════════════
    `;
};

// ==========================================================
// API ROUTES
// ==========================================================

/**
 * GET /api/health - Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Portfolio API is running',
        timestamp: new Date().toISOString(),
        emailConfigured: !!transporter
    });
});

/**
 * POST /api/contact - Handle contact form submissions
 *
 * Request body: { name, email, subject, message }
 * Response: { success: boolean, message: string }
 */
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        const errors = [];

        if (!name || name.trim().length < 2) {
            errors.push('Name is required (min 2 characters)');
        }

        if (!email || !isValidEmail(email)) {
            errors.push('Valid email address is required');
        }

        if (!subject || subject.trim().length < 3) {
            errors.push('Subject is required (min 3 characters)');
        }

        if (!message || message.trim().length < 20) {
            errors.push('Message is required (min 20 characters)');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors: errors
            });
        }

        // Log submission to console
        console.log('\n╔═══════════════════════════════════════════╗');
        console.log('║     NEW CONTACT FORM SUBMISSION           ║');
        console.log('╠═══════════════════════════════════════════╣');
        console.log(`║ Time:    ${new Date().toLocaleString()}`);
        console.log(`║ Name:    ${name}`);
        console.log(`║ Email:   ${email}`);
        console.log(`║ Subject: ${subject}`);
        console.log('╠═══════════════════════════════════════════╣');
        console.log(`║ Message: ${message.substring(0, 50)}...`);
        console.log('╚═══════════════════════════════════════════╝\n');

        // Save submission to text file
        saveSubmissionToFile({ name, email, subject, message });

        // Send email if configured
        if (transporter) {
            const mailOptions = {
                from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_TO || process.env.EMAIL_USER,
                replyTo: email,
                subject: `🚀 Portfolio: ${subject}`,
                html: generateEmailTemplate({ name, email, subject, message }),
                text: generatePlainTextEmail({ name, email, subject, message })
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Email sent successfully!');

            // If using Ethereal test service, show preview URL
            const previewUrl = nodemailer.getTestMessageUrl(info);
            if (previewUrl) {
                console.log('🔗 Preview email at:', previewUrl);
            } else {
                console.log('📧 Sent to:', process.env.EMAIL_TO || process.env.EMAIL_USER);
            }
        } else {
            console.log('⚠️  Email not sent (not configured). Data logged above.');
        }

        res.json({
            success: true,
            message: 'Thank you for your message! I will get back to you soon.'
        });

    } catch (error) {
        console.error('❌ Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error sending your message. Please try again later.'
        });
    }
});

/**
 * GET /api/projects - Return projects list
 */
app.get('/api/projects', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 1,
                title: 'Food Taxi',
                subtitle: 'Zomato Clone',
                description: 'A food delivery web application with restaurant listings, menu browsing, and cart functionality.',
                techStack: ['HTML', 'CSS', 'JavaScript']
            },
            {
                id: 2,
                title: 'CLICKER',
                subtitle: 'Camera Rental Website',
                description: 'A platform for renting professional camera equipment with booking and catalog features.',
                techStack: ['HTML', 'CSS', 'JavaScript']
            }
        ]
    });
});

// ==========================================================
// SERVE FRONTEND
// ==========================================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ success: false, message: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ==========================================================
// HELPER FUNCTIONS
// ==========================================================

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, char => map[char]);
}

// ==========================================================
// START SERVER
// ==========================================================

app.listen(PORT, () => {
    console.log('\n╔═══════════════════════════════════════════╗');
    console.log('║     AJAY JAISWAR - PORTFOLIO SERVER       ║');
    console.log('╠═══════════════════════════════════════════╣');
    console.log(`║ 🌐 Server:  http://localhost:${PORT}         ║`);
    console.log(`║ 📧 Email:   ${transporter ? 'Configured ✓' : 'Not configured ✗'}             ║`);
    console.log('╚═══════════════════════════════════════════╝\n');
});

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => { console.log('\n👋 Server shutting down...'); process.exit(0); });

module.exports = app;
