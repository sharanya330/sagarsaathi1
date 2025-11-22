# Twilio SMS Setup Guide

This guide explains how to configure real SMS/OTP functionality using Twilio.

## Current Status

✅ **Mock OTP Mode** (Default)
- System generates random 6-digit OTPs
- OTPs are logged to console
- OTPs expire after 5 minutes
- Perfect for development and testing

🔧 **Real SMS Mode** (Optional)
- Requires Twilio account and credentials
- Sends actual SMS to users
- Production-ready

## How to Enable Real SMS

### Step 1: Create Twilio Account

1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free account
3. Verify your email and phone number

### Step 2: Get Twilio Credentials

1. From Twilio Console Dashboard, find:
   - **Account SID** (starts with `AC...`)
   - **Auth Token** (click to reveal)
2. Get a Twilio phone number:
   - Go to Phone Numbers → Manage → Buy a number
   - Choose a number with SMS capability
   - Note: Free trial accounts can only send to verified numbers

### Step 3: Configure Backend

1. Open `/backend/.env`
2. Replace the placeholder values:

```env
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcd
TWILIO_AUTH_TOKEN=your_actual_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

3. Restart the backend server:
```bash
cd backend
npm start
```

### Step 4: Verify Setup

1. Check backend console for: `✓ Twilio SMS enabled`
2. Try logging in with a phone number
3. You should receive an actual SMS!

## Phone Number Format

Twilio requires phone numbers in E.164 format:
- **Correct**: `+919876543210` (India)
- **Correct**: `+12025551234` (USA)
- **Incorrect**: `9876543210` (missing country code)

## Free Trial Limitations

Twilio free trial accounts have restrictions:
- Can only send SMS to **verified phone numbers**
- To verify a number: Twilio Console → Phone Numbers → Verified Caller IDs
- Limited credits (~$15 USD)
- Each SMS costs ~$0.0075

## Troubleshooting

### "Twilio not configured, using mock OTP"
- Check that `.env` values are correct
- Ensure no typos in credentials
- Restart backend after changing `.env`

### "SMS Error: ..."
- Check phone number format (must include country code)
- Verify the recipient number is verified (free trial)
- Check Twilio account balance

### OTP not received
- Check phone number format
- Look in backend console for error messages
- Verify Twilio phone number has SMS capability

## Production Deployment

For production:
1. Upgrade Twilio account (remove trial restrictions)
2. Set `NODE_ENV=production` in `.env`
3. Remove `devOTP` from API responses (security)
4. Consider using Redis for OTP storage instead of in-memory

## Cost Estimation

- SMS cost: ~$0.0075 per message
- 1000 OTPs = ~$7.50
- Consider implementing rate limiting to prevent abuse
