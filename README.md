# SagarSaathi - Women's Safety Travel Platform

A comprehensive travel safety platform designed to enhance women's safety during travel through real-time GPS tracking, emergency SOS features, and administrative monitoring.

## 🌟 Features

- **Real-time GPS Tracking**: Live location tracking for active trips
- **SOS Emergency System**: One-tap emergency alerts with location sharing
- **Multi-role Dashboard**: Separate interfaces for users, drivers, and administrators
- **Trip Management**: Book, track, and manage travel trips
- **Safety Monitoring**: Administrative oversight of all active trips
- **Driver Management**: Driver registration, verification, and trip assignment

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI, shadcn/ui
- **Real-time**: Socket.io Client
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js + Express
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT
- **Real-time**: Socket.io
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer

## 📁 Project Structure

```
sagarsaathi/
├── frontend/           # Next.js application (Full Stack)
│   ├── src/
│   │   ├── app/       # App router pages & API routes
│   │   ├── components/ # React components
│   │   ├── lib/       # Utilities (DB, Auth, etc.)
│   │   └── models/    # Mongoose models
│   └── package.json
├── DEPLOYMENT.md     # Deployment guide
└── package.json      # Root workspace config
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sagarsaathi
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**
   
   **Frontend** (`frontend/.env.local`):
   ```env
   # Backend API (Internal)
   NEXT_PUBLIC_API_URL=http://localhost:3000
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/sagarsaathi
   
   # Auth & Email
   JWT_SECRET=your_secret_key
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - App: http://localhost:3000

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deployment Summary

**Deploy to Vercel** (Frontend + Backend API):

```bash
vercel --prod
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Trips
- `GET /api/trips` - Get all trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/drivers` - Get all drivers
- `PUT /api/admin/drivers/:id/verify` - Verify driver

### Drivers
- `POST /api/drivers/register` - Driver registration
- `GET /api/drivers/trips` - Get driver's trips
- `PUT /api/drivers/trips/:id/status` - Update trip status

## 🔌 WebSocket Events

> **Note:** Socket.io support is limited on Vercel. For production real-time features, consider using Pusher or Ably.

### Client → Server
- `join-trip` - Join a trip room
- `location-update` - Send location update
- `trigger-sos` - Trigger emergency SOS

### Server → Client
- `location-updated` - Receive location update
- `sos-alert` - Receive SOS alert

## 🛠️ Development Scripts

```bash
# Root level
npm run dev              # Start dev server
npm run build            # Build for production
npm run install:all      # Install dependencies

# Frontend (Direct)
cd frontend
npm run dev              # Development server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
```

## 🧪 Testing

```bash
# Test build
cd frontend
npm run build
```

## 🔐 Security

- JWT-based authentication
- Password hashing (implement bcrypt)
- CORS configuration for production
- Environment variable protection
- Input validation with Zod
- XSS protection headers

## 📝 Environment Variables

### Required Frontend Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_SOCKET_URL` - Socket.io server URL

### Required Backend Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS
- `EMAIL_SERVICE` - Email service provider
- `EMAIL_USER` - Email username
- `EMAIL_PASS` - Email password

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For deployment issues, see [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section.

For other issues, please open a GitHub issue.

---

**Built with ❤️ for women's safety**
