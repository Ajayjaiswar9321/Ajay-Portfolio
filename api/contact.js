const nodemailer = require('nodemailer');

// Email validation helper
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// HTML escape helper
function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, char => map[char]);
}

// Generate HTML email template
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
                    <tr>
                        <td style="background: linear-gradient(135deg, #00d4ff, #00ffcc); padding: 30px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #0a0a0f; font-size: 28px; font-weight: 700;">New Message Received</h1>
                            <p style="margin: 10px 0 0; color: #0d1b2a; font-size: 14px;">Someone contacted you through your portfolio</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 40px 0; text-align: center;">
                            <p style="margin: 0; color: #a0a0a0; font-size: 12px;">${currentDate}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px 40px;">
                            <div style="padding: 15px 20px; background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 12px;">
                                <p style="margin: 0 0 4px; color: #a0a0a0; font-size: 11px; text-transform: uppercase;">Name</p>
                                <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${escapeHtml(name)}</p>
                            </div>
                            <div style="padding: 15px 20px; background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 12px;">
                                <p style="margin: 0 0 4px; color: #a0a0a0; font-size: 11px; text-transform: uppercase;">Email</p>
                                <a href="mailto:${escapeHtml(email)}" style="color: #00d4ff; font-size: 16px; font-weight: 600; text-decoration: none;">${escapeHtml(email)}</a>
                            </div>
                            <div style="padding: 15px 20px; background: rgba(255,255,255,0.03); border-radius: 12px;">
                                <p style="margin: 0 0 4px; color: #a0a0a0; font-size: 11px; text-transform: uppercase;">Subject</p>
                                <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">${escapeHtml(subject)}</p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 12px; padding: 25px;">
                                <p style="margin: 0 0 12px; color: #00d4ff; font-size: 13px; text-transform: uppercase; font-weight: 600;">Message</p>
                                <p style="margin: 0; color: #e0e0e0; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${escapeHtml(message)}</p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 40px 30px; text-align: center;">
                            <a href="mailto:${escapeHtml(email)}?subject=Re: ${escapeHtml(subject)}" style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #00ffcc); color: #0a0a0f; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 600; font-size: 14px;">Reply to ${escapeHtml(name.split(' ')[0])}</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="background: rgba(0,0,0,0.3); padding: 25px 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
                            <p style="margin: 0 0 8px; color: #ffffff; font-size: 16px; font-weight: 700;">Ajay Jaiswar</p>
                            <p style="margin: 0; color: #a0a0a0; font-size: 12px;">QA Analyst & Frontend Developer</p>
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

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { name, email, subject, message } = req.body;

        // Validation
        const errors = [];
        if (!name || name.trim().length < 2) errors.push('Name is required (min 2 characters)');
        if (!email || !isValidEmail(email)) errors.push('Valid email address is required');
        if (!subject || subject.trim().length < 3) errors.push('Subject is required (min 3 characters)');
        if (!message || message.trim().length < 20) errors.push('Message is required (min 20 characters)');

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        // Setup email transporter
        let transporter;

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            // Use real Gmail credentials if configured
            transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.EMAIL_PORT) || 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
        } else {
            // Use Ethereal test email
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
        }

        // Send email
        const mailOptions = {
            from: `"Portfolio Contact" <${process.env.EMAIL_USER || 'noreply@portfolio.com'}>`,
            to: process.env.EMAIL_TO || process.env.EMAIL_USER || 'ajayjaiswar6340@gmail.com',
            replyTo: email,
            subject: `Portfolio: ${subject}`,
            html: generateEmailTemplate({ name, email, subject, message }),
            text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: 'Thank you for your message! I will get back to you soon.'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({
            success: false,
            message: 'Sorry, there was an error sending your message. Please try again later.'
        });
    }
};
