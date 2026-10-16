# MB Global Appointment Booking System

A professional, modern appointment booking platform built specifically for MB Global. The system allows clients to seamlessly schedule consultations while providing administrators with full control over meeting types, working schedule, blocked holiday dates, booking records, CSV/JSON reporting exports, and Google Calendar sync settings.

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
- **Dynamic Slot Availability:** Real-time time slot calculations based on working hours, blocked dates, and existing appointments.
- **User Booking Details:** Collect Name, Email Address, Phone Number, Company Name, and Notes with inline validation.
- **Instant Booking Confirmation:** Displays a unique booking reference ID, summary, and auto-generated Google Meet video link.
- **Self-Service Lookup:** Lookup appointments by Booking ID or Email to reschedule or cancel sessions.

### Admin Dashboard
- **Meeting Types Manager:** Create, edit, toggle active status, and remove meeting types.
- **Schedule Controls:** Set daily working hours, enable/disable working days, and configure time slot intervals.
- **Blocked Dates:** Mark specific single dates or holidays as unavailable for appointments.
- **Bookings Management:** Search, filter by status (Confirmed, Rescheduled, Completed, Cancelled), and update appointment statuses inline.
- **Data Export:** Export booking reports to CSV and JSON formats instantly.
- **Google Calendar Integration:** Simulated OAuth connection manager, sync toggle, and manual trigger action.

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

### Option 1: Vercel / Netlify (Recommended for Frontend Static Hosting)
1. Push your code to GitHub/GitLab.
2. Import the project into Vercel or Netlify.
3. Set the build parameters:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**.

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

Create a `.env` or `.env.local` file in the root directory for standard production or backend integration settings:

```env
# Application Settings
VITE_APP_TITLE="MB Global Appointment Booking"
VITE_APP_PORT=3000

# Google Workspace / Calendar Credentials (Required when connecting backend OAuth API)
VITE_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
VITE_GOOGLE_API_KEY="your-google-api-key"
VITE_GOOGLE_CALENDAR_ID="primary"

# Database Backend URL (Optional if extending beyond LocalStorage)
VITE_API_BASE_URL="https://api.mbglobal.com/v1"
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
   - Add Authorized Redirect URIs for OAuth callback handling.

3. **Configure Environment Variables:**
   - Copy `Client ID` and `API Key` into your `.env` file (`VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_API_KEY`).

4. **In-App Synchronization:**
   - Access the **Admin Dashboard > Google Calendar** tab in the MB Global Portal to connect the account and trigger sync tests.

---

## Database Setup & Persistence

### Current Client-Side Persistence
The application comes pre-configured with a lightweight `LocalStorage` persistence layer in `src/services/storage.js`. It automatically seeds default MB Global meeting types, schedule configurations, blocked dates, and sample bookings on first load.

### Enterprise Database Integration (e.g. PostgreSQL / Supabase / MongoDB)
If you wish to attach a persistent SQL or NoSQL database backend:

1. **Database Schema (PostgreSQL Example):**

```sql
CREATE TABLE meeting_types (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  description TEXT,
  location VARCHAR(100),
  color VARCHAR(20),
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE bookings (
  id VARCHAR(50) PRIMARY KEY,
  meeting_type_id VARCHAR(50) REFERENCES meeting_types(id),
  meeting_type_title VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_phone VARCHAR(50) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'Confirmed',
  meeting_link VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blocked_dates (
  id VARCHAR(50) PRIMARY KEY,
  blocked_date DATE NOT NULL,
  reason VARCHAR(255)
);
```

2. Replace the fetch/write methods in `src/services/storage.js` with `fetch()` calls to your REST or GraphQL backend endpoints.

---

## License
&copy; MB Global. All rights reserved.
