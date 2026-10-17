# MB Global Appointment Booking System

A professional appointment booking platform built specifically for MB Global. The system provides client appointment scheduling and administrative control over meeting types, working schedule, blocked holiday dates, booking records, CSV/JSON reporting exports, and Google Calendar OAuth 2.0 integration configured for `Africa/Dar_es_Salaam` timezone.

## MB Global Brand Palette
- **Primary Dark Background:** `#12141e`
- **MB Global Blue Accent:** `#3878bc`
- **Pure White / Typography:** `#ffffff`

---

## Table of Contents
1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installing Dependencies](#installing-dependencies)
4. [Running the App Locally](#running-the-app-locally)
5. [Building for Production](#building-for-production)
6. [Environment Variables](#environment-variables)
7. [Exact Google Cloud Console Setup & Redirect URI](#exact-google-cloud-console-setup--redirect-uri)
8. [License](#license)

---

## Features

### Client Portal
- **Meeting Type Selection:** Browse active meeting types with custom durations and descriptions.
- **Calendar Availability:** Slot availability combines admin working hours, blocked dates, and Google Calendar busy events in `Africa/Dar_es_Salaam` timezone.
- **User Booking Details:** Collect Name, Email Address, Phone Number, Company Name, and Notes with inline validation.
- **Instant Booking Confirmation:** Displays a unique booking reference ID, summary, and auto-generated Google Meet video conference link.
- **Self-Service Lookup:** Lookup appointments by Booking ID or Email to reschedule or cancel sessions and update Google Calendar events.

### Admin Dashboard
- **Meeting Types Manager:** Create, edit, toggle active status, and remove meeting types.
- **Schedule Controls:** Set daily working hours, enable/disable working days, and configure time slot intervals.
- **Blocked Dates:** Mark specific single dates or holidays as unavailable for appointments.
- **Bookings Management:** Search, filter by status (Confirmed, Rescheduled, Completed, Cancelled), and update appointment statuses inline.
- **Data Export:** Export booking reports to CSV and JSON formats instantly.
- **Google Calendar OAuth Page:** Dedicated Google Calendar status view, OAuth authorization trigger, Disconnect button, connected account indicator, and Test Calendar Connection action.

---

## Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

---

## Installing Dependencies

```bash
# Clone the repository
git clone https://github.com/malickbilly70/work-try-ons-.git
cd work-try-ons-

# Install node dependencies
npm install
```

---

## Running the App Locally

To start the Vite development server:

```bash
npm run dev
```

The application runs locally at `http://localhost:3000`.

---

## Building for Production

To compile production static assets:

```bash
npm run build
```

The output assets will be placed in the `dist/` directory.

To preview locally:

```bash
npm run preview
```

---

## Environment Variables

Configure environment variables in `.env` based on `.env.example`:

```env
# Google OAuth 2.0 Credentials
VITE_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
VITE_GOOGLE_REDIRECT_URI="https://work-try-ons.vercel.app/api/google/oauth/callback"

# Application Settings & Timezone Configuration
VITE_APP_TIMEZONE="Africa/Dar_es_Salaam"
```

---

## Exact Google Cloud Console Setup & Redirect URI

### Exact Redirect URI for Google Cloud Console Credentials
You must enter the following exact URI under **Authorized redirect URIs** in Google Cloud Console:

```text
https://work-try-ons.vercel.app/api/google/oauth/callback
```

### Step-by-Step Google Cloud Console Setup
1. **Google Cloud Console Setup:**
   - Log into [Google Cloud Console](https://console.cloud.google.com/).
   - Create or select a project named `MB-Global-Appointments`.
   - Enable the **Google Calendar API**.

2. **OAuth Credentials:**
   - Go to **APIs & Services > Credentials > Create Credentials > OAuth Client ID**.
   - Select **Application Type: Web application**.
   - **Authorized Redirect URIs (Exact):**
     `https://work-try-ons.vercel.app/api/google/oauth/callback`

3. **Admin Dashboard Integration:**
   - Access **Admin Dashboard > Google Calendar** tab.
   - Click **Connect Google Calendar** to trigger OAuth authorization.
   - Click **Test Calendar Connection** to verify status and timezone settings (`Africa/Dar_es_Salaam`).

---

## License
&copy; MB Global. All rights reserved.
