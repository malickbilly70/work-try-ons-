# MB Global Appointment Booking System

A professional, production-grade appointment booking platform built specifically for MB Global. The system provides seamless client appointment scheduling and full administrative control over meeting types, working schedule, blocked holiday dates, booking records, CSV/JSON reporting exports, and real Google Calendar OAuth 2.0 integration configured for `Africa/Dar_es_Salaam` timezone.

## MB Global Brand Palette
- **Primary Dark Background:** `#12141e`
- **MB Global Blue Accent:** `#3878bc`
- **Pure White / Typography:** `#ffffff`

---

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Prerequisites](#prerequisites)
3. [Installing Dependencies](#installing-dependencies)
4. [Running the App Locally](#running-the-app-locally)
5. [Building for Production](#building-for-production)
6. [Vercel & Server Environment Variables](#vercel--server-environment-variables)
7. [Google Cloud Console & OAuth 2.0 Setup](#google-cloud-console--oauth-20-setup)
8. [Connecting Google Calendar from Admin Dashboard](#connecting-google-calendar-from-admin-dashboard)
9. [Google Meet Video Link Generation](#google-meet-video-link-generation)
10. [Reschedule and Cancellation Synchronization](#reschedule-and-cancellation-synchronization)
11. [Supabase & PostgreSQL Database Migration SQL](#supabase--postgresql-database-migration-sql)
12. [Step-by-Step Production Deployment Instructions](#step-by-step-production-deployment-instructions)

---

## System Architecture

The MB Global Appointment Booking System uses a production Web Application architecture:
- **Frontend Layer:** React 18, Vite, Tailwind CSS, Lucide Icons, and date-fns.
- **Timezone Standard:** `Africa/Dar_es_Salaam` (EAT) across availability calculations and calendar event creation.
- **Backend API & OAuth Layer:** Google OAuth 2.0 Web Application client flow.
- **Calendar Engine:** Queries Google Calendar API free/busy availability and creates live calendar events with Google Meet conferencing links.
- **Database Persistence Layer:** Supabase / PostgreSQL relational schema storing tokens, meeting types, working hours, blocked dates, bookings, Google Calendar Event IDs, and Meet URLs.

---

## Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Google Cloud Console Project**: With Google Calendar API enabled.
- **Supabase / PostgreSQL Database Instance**

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

The optimized build assets will be placed in the `dist/` directory.

To preview locally:

```bash
npm run preview
```

---

## Vercel & Server Environment Variables

Configure environment variables in Vercel or your production server. Client-side variables exposed to Vite must start with `VITE_`. Server-side credentials must never be exposed to the browser.

### Server-Side Secrets (Never Exposed to Frontend Browser)
- `GOOGLE_CLIENT_SECRET`: Your Google Cloud OAuth 2.0 Web Client Secret.
- `DATABASE_URL`: PostgreSQL connection string (`postgresql://postgres:password@db-host:5432/mb_global`).
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase elevated service role API key.

### Public Client-Side Environment Variables (Exposed via Vite)
- `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth 2.0 Web Client ID.
- `VITE_GOOGLE_REDIRECT_URI`: OAuth callback route (`https://your-app.vercel.app/admin/oauth/callback` or `http://localhost:3000/admin/oauth/callback`).
- `VITE_APP_TIMEZONE`: Default timezone (`Africa/Dar_es_Salaam`).
- `VITE_SUPABASE_URL`: Supabase project URL (`https://your-project.supabase.co`).
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous public API key.

---

## Google Cloud Console & OAuth 2.0 Setup

1. **Create Google Cloud Project:**
   - Log into [Google Cloud Console](https://console.cloud.google.com/).
   - Click **Select a Project > New Project** and name it `MB-Global-Appointments`.

2. **Enable Calendar API:**
   - Go to **APIs & Services > Library**.
   - Search for **Google Calendar API** and click **Enable**.

3. **Configure OAuth Consent Screen:**
   - Go to **APIs & Services > OAuth consent screen**.
   - Select **User Type: External** (or Internal for Workspace).
   - Fill in Application Name (`MB Global Appointments`) and Support Email.
   - Add scopes: `https://www.googleapis.com/auth/calendar` and `https://www.googleapis.com/auth/calendar.events`.

4. **Create OAuth 2.0 Credentials:**
   - Go to **APIs & Services > Credentials > Create Credentials > OAuth Client ID**.
   - Select **Application Type: Web application**.
   - **Authorized JavaScript Origins:**
     - `http://localhost:3000`
     - `https://your-app.vercel.app`
   - **Authorized Redirect URIs (Exact Route):**
     - `http://localhost:3000/admin/oauth/callback`
     - `https://your-app.vercel.app/admin/oauth/callback`

---

## Connecting Google Calendar from Admin Dashboard

1. Navigate to the **Admin Dashboard > Google Calendar** tab in the MB Global Portal.
2. Click **Connect Google Calendar**.
3. You will be redirected to Google OAuth consent screen (`accounts.google.com/o/oauth2/v2/auth`).
4. Authorize MB Global to access Google Calendar.
5. Google will redirect back to `/admin/oauth/callback` with authorization code.
6. The backend exchanges the code for access & refresh tokens, storing them securely in the database.
7. Click **Test Calendar Connection** to verify live connection status, account email (`admin@mbglobal.com`), and primary calendar ID.

---

## Google Meet Video Link Generation

- When a client books an appointment, the system automatically creates a Google Calendar event with conference data enabled.
- Real Google Meet links (`https://meet.google.com/mbg-...`) are auto-generated for each confirmed session.
- The Google Meet link is stored in the database record and displayed on the customer booking confirmation screen.
- Attendee details (Customer Name, Email, Phone, Company, Notes) are attached to the Google Calendar event, and a calendar invitation is sent to the customer's email.

---

## Reschedule and Cancellation Synchronization

- **Reschedule:** When a booking is updated via the Client Manage view or Admin Dashboard, the system updates the date/time in the database and updates the start/end time of the corresponding Google Calendar Event ID.
- **Cancellation:** When a booking status is set to `Cancelled`, the status is updated in the database and the corresponding Google Calendar Event is removed/deleted from the connected admin calendar.

---

## Supabase & PostgreSQL Database Migration SQL

Run this SQL migration in your Supabase SQL Editor or PostgreSQL database console:

```sql
-- Admin OAuth Tokens Table
CREATE TABLE IF NOT EXISTS admin_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_email VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Meeting Types Table
CREATE TABLE IF NOT EXISTS meeting_types (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  description TEXT,
  location VARCHAR(100) DEFAULT 'Google Meet',
  color VARCHAR(20) DEFAULT '#3878bc',
  active BOOLEAN DEFAULT TRUE
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
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
  meeting_link VARCHAR(255) NOT NULL,
  google_event_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blocked Dates Table
CREATE TABLE IF NOT EXISTS blocked_dates (
  id VARCHAR(50) PRIMARY KEY,
  blocked_date DATE NOT NULL,
  reason VARCHAR(255)
);

-- Working Schedule Settings Table
CREATE TABLE IF NOT EXISTS working_hours (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'primary',
  timezone VARCHAR(100) DEFAULT 'Africa/Dar_es_Salaam',
  schedule_json JSONB NOT NULL,
  slot_interval INT DEFAULT 30
);
```

---

## Step-by-Step Production Deployment Instructions

### Deploying to Vercel
1. Push your repository to GitHub / GitLab.
2. Go to [Vercel Dashboard](https://vercel.com/new) and click **Import Project**.
3. Under **Environment Variables**, add:
   - `GOOGLE_CLIENT_SECRET`
   - `DATABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_GOOGLE_REDIRECT_URI` = `https://your-project.vercel.app/admin/oauth/callback`
   - `VITE_APP_TIMEZONE` = `Africa/Dar_es_Salaam`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Set Build Settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**.
6. Copy your assigned Vercel URL and add `https://your-project.vercel.app/admin/oauth/callback` to Google Cloud Console **Authorized Redirect URIs**.

---

## License
&copy; MB Global. All rights reserved.
