# Backend Environment Variables - Update Instructions

Please update your `backend/.env` file with these values:

```env
# MongoDB Configuration (IMPORTANT: Use MONGODB_URI instead of MONGO_URI)
MONGODB_URI=mongodb://mongodb:27017/sagarsaathi

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret - SECURE RANDOM KEY (COPY THIS EXACTLY)
JWT_SECRET=ExVWrUV9ADHbTed31TdHp+5tHG6JejznzBpaRwhExu0=

# Twilio Configuration (Optional - leave as placeholders for now)
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
```

## Key Changes:
1. **MONGO_URI → MONGODB_URI** (industry standard)
2. **JWT_SECRET** - Use the secure generated key above
3. **PORT** - Ensure it's 5000 (not 5001)
4. **MONGODB_URI** - Use `mongodb://mongodb:27017/sagarsaathi` for Docker (not localhost)
