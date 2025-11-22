# SagarSaathi - P2P Travel Platform MVP

A peer-to-peer travel platform connecting users with large-vehicle owner-drivers for multi-day trips.

## 🚀 Features

- ✅ **OTP-based Authentication** (Twilio-ready)
- ✅ **Trip Request System** with multi-stop destinations
- ✅ **Driver Trip Queue** with real-time updates
- ✅ **Trip Acceptance Flow** for drivers
- ✅ **Admin Vetting Dashboard** for driver verification
- ✅ **File Upload System** for driver documents
- ✅ **Real-time GPS Tracking** via WebSocket
- ✅ **SOS Alert System** for emergency situations
- ✅ **Safety Monitoring** dashboard for admins

## 🛠️ Tech Stack

### Frontend
- Next.js 16 (Turbopack)
- TypeScript
- TailwindCSS
- Radix UI
- Socket.io Client

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- Socket.io
- Twilio (optional)

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/sagarsaathi
JWT_SECRET=your_secret_key
PORT=5001

# Optional: Twilio SMS
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

Start backend:
```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps
```

Start frontend:
```bash
PORT=3002 npm run dev
```

## 🌐 Access

- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:5001

## 🔐 Default Login

- **OTP**: Random 6-digit code (shown in toast notification)
- **Phone**: Any format (e.g., +919876543210)

## 📱 User Flows

### User Flow
1. Login with phone number
2. Request trip with origin, destinations, dates
3. View trip status in "My Trips"
4. Track driver location (when trip is active)

### Driver Flow
1. Login as driver
2. Upload documents (license, RC, insurance, etc.)
3. View pending trips in Trip Queue
4. Accept trip
5. Start GPS tracking in "Active Trip" tab
6. Use SOS button if needed

### Admin Flow
1. Login as admin
2. View pending drivers in "Driver Vetting"
3. Approve/reject drivers
4. Monitor active trips in "Safety Monitor"
5. Receive SOS alerts

## 🗂️ Project Structure

```
sagarsaathi/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── config/          # Database config
│   └── server.js        # Express + Socket.io server
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js pages
│   │   ├── components/  # React components
│   │   └── lib/         # Utilities
│   └── public/          # Static assets
└── README.md
```

## 🔧 Configuration

### Enable Real SMS (Optional)
1. Sign up for Twilio: https://www.twilio.com
2. Add credentials to `backend/.env`
3. Restart backend server

See `TWILIO_SETUP.md` for detailed instructions.

## 🚦 API Endpoints

### Authentication
- `POST /api/auth/login` - Send OTP
- `POST /api/auth/verify` - Verify OTP

### Trips
- `GET /api/trips` - Get all trips
- `POST /api/trips` - Create trip
- `PUT /api/trips/:id/accept` - Accept trip
- `GET /api/trips/user/:userId` - Get user trips

### Admin
- `GET /api/admin/drivers` - Get all drivers
- `PUT /api/admin/drivers/:id/verify` - Verify driver
- `GET /api/admin/trips/active` - Get active trips

### Drivers
- `POST /api/drivers/documents` - Upload documents
- `GET /api/drivers/:id` - Get driver profile

## 🔌 WebSocket Events

### Client → Server
- `join-trip` - Join trip room
- `location-update` - Send GPS coordinates
- `trigger-sos` - Trigger emergency alert

### Server → Client
- `location-updated` - Receive location update
- `sos-alert` - Receive SOS notification

## 📝 License

MIT

## 👨‍💻 Author

SagarSaathi Team

---

**Note**: This is an MVP. For production deployment, ensure proper security measures, environment variables, and API key management.
