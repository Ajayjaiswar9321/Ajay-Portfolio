# Ajay Jaiswar - Portfolio Website

A premium, modern portfolio website with advanced 3D interactions, glassmorphism design, and Node.js backend.

## Features

- **3D Interactive Cube** - Rotating skills cube with mouse tracking
- **3D Logo Animation** - Animated logo with depth effect on hover
- **Glassmorphism Design** - Modern glass-effect UI components
- **Contact Form** - Real-time validation with backend email support
- **Fully Responsive** - Optimized for all device sizes
- **Scroll Animations** - AOS.js powered reveal animations

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Open in browser
http://localhost:3000
```

## Project Structure

```
portfolio/
├── index.html          # Main HTML file
├── styles.css          # CSS with variables
├── script.js           # JavaScript interactions
├── server.js           # Express backend
├── package.json        # Dependencies
├── .env.example        # Environment template
└── assets/
    ├── images/         # Project images
    └── cv/             # CV/Resume file
```

## Customization Guide

### Changing Personal Information

**index.html:**
- Update name, role, and contact details in respective sections
- Modify project cards with your actual projects
- Update social media links

### Changing Colors

**styles.css - Line 31-42:**
```css
:root {
    --accent-primary: #00d4ff;    /* Main accent */
    --accent-secondary: #00ffcc;   /* Secondary accent */
    --accent-tertiary: #7b2cbf;    /* Purple accent */
}
```

### Updating CV

1. Replace `/assets/cv/Ajay_Jaiswar_CV.pdf` with your CV
2. Update the download button href in index.html

### Modifying 3D Cube Text

**index.html - Line 75-82:**
```html
<div class="cube-face cube-front"><span>HTML</span></div>
<div class="cube-face cube-back"><span>CSS</span></div>
<!-- Edit the text inside <span> tags -->
```

## Email Configuration

1. Copy `.env.example` to `.env`
2. Configure your email credentials:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=ajayjaiswar6340@gmail.com
```

For Gmail, generate an App Password:
1. Enable 2-Factor Authentication
2. Go to Google Account > Security > App Passwords
3. Generate password for "Mail"

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express
- **Libraries:** AOS.js (scroll animations)
- **Email:** Nodemailer

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/contact` | POST | Submit contact form |
| `/api/projects` | GET | Get projects list |
| `/api/skills` | GET | Get skills data |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - Feel free to use for your own portfolio!

---

**Author:** Ajay Jaiswar
**Contact:** ajayjaiswar6340@gmail.com
