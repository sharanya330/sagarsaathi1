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


## 🌐 Access

- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:5001



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


## 🔧 Configuration

### Enable Real SMS (Optional)
1. Sign up for Twilio: https://www.twilio.com
2. Add credentials to `backend/.env`
3. Restart backend server


