# MB Global Appointment Booking System

A professional, modern appointment booking platform built specifically for MB Global. The system allows clients to seamlessly schedule consultations while providing administrators with full control over meeting types, working schedule, blocked holiday dates, booking records, CSV/JSON reporting exports, and real production Google Calendar OAuth integration in `Africa/Dar_es_Salaam` timezone.

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
6. [Deploying the App](#deploying-the-app)
7. [Required Environment Variables](#required-environment-variables)
8. [Google Calendar Setup](#google-calendar-setup)
9. [Database Setup & Persistence](#database-setup--persistence)

---

## Features

### Client Portal
- **Meeting Type Selection:** Browse active meeting types with custom durations and descriptions.
- **Real-Time Calendar Availability:** Slot availability combines admin working hours, blocked dates, and Google Calendar busy events in `Africa/Dar_es_Salaam` timezone.
- **User Booking Details:** Collect Name, Email Address, Phone Number, Company Name, and Notes with server-side validation.
- **Instant Booking Confirmation:** Displays a unique booking reference ID, summary, and auto-generated Google Meet video conference link.
- **Self-Service Lookup:** Lookup appointments by Booking ID or Email to reschedule or cancel sessions and update Google Calendar events.

### Admin Dashboard
- **Meeting Types Manager:** Create, edit, toggle active status, and remove meeting types.
- **Schedule Controls:** Set daily working hours, enable/disable working days, and configure time slot intervals.
- **Blocked Dates:** Mark specific single dates or holidays as unavailable for appointments.
- **Bookings Management:** Search, filter by status (Confirmed, Rescheduled, Completed, Cancelled), and update appointment statuses inline.
- **Data Export:** Export booking reports to CSV and JSON formats instantly.
- **Google Calendar OAuth Page:** Dedicated Google Calendar OAuth status view, OAuth authorization trigger, Disconnect button, connected account indicator, and Test Calendar Connection action.

---

## Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

---

## Installing Dependencies

To install all required packages, clone the repository and run:

```bash
# Clone the repository
git clone https://github.com/malickbilly70/work-try-ons-.git
cd work-try-ons-

# Install node dependencies
npm install
```

---

## Running the App Locally

To start the Vite development server locally:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The production output assets will be generated in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## Deploying the App

### Option 1: Vercel / Netlify Deployment
1. Push your code to GitHub/GitLab repository.
2. Import the repository into Vercel or Netlify.
3. Configure the environment variables (refer to `.env.example`).
4. Set the build parameters:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**.

### Option 2: Docker Container Deployment
Create a `Dockerfile` in the root directory:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run the Docker image:

```bash
docker build -t mb-global-booking .
docker run -p 80:80 mb-global-booking
```

---

## Required Environment Variables

Copy `.env.example` to `.env` or `.env.local` and configure your production secrets:

```env
# Google OAuth 2.0 Credentials (Server-Side Secure)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
VITE_GOOGLE_REDIRECT_URI="http://localhost:3000/admin/oauth/callback"

# Database Connection (PostgreSQL / Supabase)
DATABASE_URL="postgresql://postgres:password@localhost:5432/mb_global_booking"
SUPABASE_URL="https://your-supabase-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Application Settings & Timezone Configuration
VITE_APP_TIMEZONE="Africa/Dar_es_Salaam"
VITE_API_BASE_URL="http://localhost:3000/api"
```

---

## Google Calendar Setup

To connect live Google Calendar sync and auto-generate real Google Meet links:

1. **Google Cloud Console Setup:**
   - Navigate to [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project named `MB-Global-Appointments`.
   - Enable the **Google Calendar API**.

2. **OAuth Credentials:**
   - Go to **APIs & Services > Credentials**.
   - Create an **OAuth 2.0 Client ID** (Web Application).
   - Set Authorized JavaScript Origins to your domain (e.g., `http://localhost:3000` or `https://booking.mbglobal.com`).
   - Add Authorized Redirect URIs for OAuth callback handling:
     `http://localhost:3000/admin/oauth/callback`

3. **Configure Environment Variables:**
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` into your production environment settings or `.env` file.

4. **Admin Dashboard Google Calendar Page:**
   - Navigate to the **Admin Dashboard > Google Calendar** tab in the MB Global Portal.
   - Click **Connect Google Calendar** to trigger OAuth 2.0 authorization.
   - Use **Test Calendar Connection** to verify live API connectivity and timezone settings (`Africa/Dar_es_Salaam`).

---

## Database Setup & Persistence

### Supabase / PostgreSQL Database Migration Steps
To run a persistent database for bookings, tokens, meeting types, working hours, and blocked dates:

1. **Database Schema (PostgreSQL / Supabase Migration SQL):**

```sql
-- Admin Tokens & Credentials
CREATE TABLE admin_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_email VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Meeting Types
CREATE TABLE meeting_types (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  description TEXT,
  location VARCHAR(100),
  color VARCHAR(20),
  active BOOLEAN DEFAULT TRUE
);

-- Bookings
CREATE TABLE bookings (
  id VARCHAR(50) PRIMARY KEY,
  meeting_type_id VARCHAR(50) REFERENCES meeting_types(id),
  meeting_type_title VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  timezone VARCHAR(100) DEFAULT 'Africa/Dar_es_Salaam',
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_phone VARCHAR(50) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'Confirmed',
  meeting_link VARCHAR(255),
  google_event_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blocked Dates
CREATE TABLE blocked_dates (
  id VARCHAR(50) PRIMARY KEY,
  blocked_date DATE NOT NULL,
  reason VARCHAR(255)
);
```

2. Run the migration SQL in your database query editor.

---

## License
&copy; MB Global. All rights reserved.
