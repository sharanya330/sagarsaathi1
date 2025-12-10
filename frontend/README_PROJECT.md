# SagarSaathi - Travel Partner Platform

A comprehensive travel partner platform connecting users with verified drivers for safe and reliable transportation.

## 🚀 Quick Start

### Development

```bash
# Clone the repository
git clone <your-repo-url>
cd sagarsaathi

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Set up environment variables
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# Start development servers
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
sagarsaathi/
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/      # Next.js app router pages
│   │   ├── components/ # React components
│   │   └── lib/      # Utilities and helpers
│   ├── public/       # Static assets
│   └── vercel.json   # Vercel configuration
├── backend/          # Express.js backend API
│   ├── config/       # Database configuration
│   ├── controllers/  # Route controllers
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   └── server.js     # Server entry point
├── DEPLOYMENT.md     # Detailed deployment guide
└── VERCEL_QUICK_START.md # Quick Vercel deployment reference
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod
- **Real-time**: Socket.io Client

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT
- **Real-time**: Socket.io
- **Email**: Nodemailer
- **File Upload**: Multer + Cloudinary

## ✨ Features

- 🔐 **Authentication**: Secure JWT-based authentication for users and drivers
- 👥 **Role-based Access**: Separate interfaces for users, drivers, and admins
- 🚗 **Trip Management**: Request, accept, and track trips in real-time
- 📍 **GPS Tracking**: Live location tracking during trips
- 🆘 **SOS Alerts**: Emergency alert system for passenger safety
- 📧 **Email Verification**: OTP-based email verification
- 📊 **Admin Dashboard**: Comprehensive admin panel for platform management
- 💳 **Driver Verification**: Document upload and verification system

## 🌐 Deployment

### Quick Deploy to Vercel (Frontend)

```bash
cd frontend
vercel --prod
```

See [VERCEL_QUICK_START.md](./VERCEL_QUICK_START.md) for quick deployment steps.

### Complete Deployment Guide

For detailed deployment instructions including backend setup, environment variables, and troubleshooting:

**📖 [Complete Deployment Guide](./DEPLOYMENT.md)**

## 🔧 Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Backend (.env)
```bash
MONGODB_URI=mongodb://localhost:27017/sagarsaathi
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

See `.env.example` files in each directory for complete configuration.

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Complete deployment instructions
- [Quick Start Guide](./VERCEL_QUICK_START.md) - Fast Vercel deployment
- [Frontend README](./README.md) - Frontend-specific documentation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions:
- Check the [Deployment Guide](./DEPLOYMENT.md)
- Review [Quick Start Guide](./VERCEL_QUICK_START.md)
- Open an issue on GitHub

---

**Built with ❤️ for safe and reliable travel**
