// English and Tanzanian Kiswahili (SW) Translation Dictionaries for MB Global

export const TRANSLATIONS = {
  EN: {
    // Header & Navigation
    slogan: 'Building Tomorrow, Today.',
    portalTitle: 'Appointment Portal',
    newBooking: 'New Booking',
    manageBooking: 'Manage Booking',
    adminPortal: 'Admin Portal',
    clientPortal: 'Client Portal',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    language: 'Language',

    // Client Flow - Step 1: Select Type
    selectTypeTitle: 'Select a Meeting Type',
    selectTypeSub: 'Choose the consultation or session that best matches your requirement.',
    mins: 'mins',

    // Client Flow - Step 2: Select Slot
    selectSlotTitle: 'Select Date & Time',
    backToTypes: 'Back to Meeting Types',
    selectDateLabel: 'Select Date',
    selectTimeLabel: 'Select Available Time Slot',
    noSlotsMsg: 'No slots available on this date due to existing events or non-working hours. Please select another date.',
    continueToDetails: 'Continue to Details',

    // Client Flow - Step 3: Enter Details
    enterDetailsTitle: 'Enter Your Information',
    backToTime: 'Back to Time Selection',
    bookingFor: 'Booking',
    onDate: 'on',
    atTime: 'at',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    phoneNumber: 'Phone Number',
    companyName: 'Company Name',
    additionalNotes: 'Additional Notes / Agenda',
    confirmAppointment: 'Confirm Appointment',
    schedulingMsg: 'Scheduling on Google Calendar...',
    valNameReq: 'Full name is required',
    valEmailReq: 'Email address is required',
    valEmailInv: 'Invalid email format',
    valPhoneReq: 'Phone number is required',
    valCompReq: 'Company name is required',

    // Client Flow - Step 4: Confirmation
    bookingConfirmed: 'Booking Confirmed!',
    confirmMsg: 'Your appointment has been successfully scheduled and added to Google Calendar. A calendar invite has been sent to',
    bookingRef: 'Booking Reference',
    meetingType: 'Meeting Type',
    dateTime: 'Date & Time',
    attendee: 'Attendee',
    meetLinkHeader: 'Your Real Google Meet Video Link:',
    copy: 'Copy',
    copied: 'Copied!',
    bookAnother: 'Book Another Session',

    // Client Flow - Manage / Reschedule
    rescheduleOrCancel: 'Reschedule or Cancel Booking',
    lookupPrompt: 'Enter your Booking Reference ID (e.g. mb-bk-101) or Email address to look up your appointment.',
    lookupPlaceholder: 'Enter Booking ID or Email...',
    lookupBtn: 'Lookup',
    noBookingFound: 'No booking found matching that Reference ID or Email.',
    currentDateTime: 'Current Date & Time',
    googleMeetUrl: 'Google Meet Link',
    rescheduleAppt: 'Reschedule Appointment',
    newDate: 'New Date',
    newTimeSlot: 'New Time Slot',
    cancelBooking: 'Cancel Booking',
    saveNewSchedule: 'Save New Schedule',
    confirmCancelAlert: 'Are you sure you want to cancel this booking? This will remove the event from Google Calendar.',

    // Admin Authentication & Login
    adminAuthTitle: 'Admin Authentication',
    adminAuthPrompt: 'Enter administrator password to access the MB Global Management Portal.',
    adminPassword: 'Admin Password',
    signInAdmin: 'Sign In as Administrator',
    authenticating: 'Authenticating...',
    signOut: 'Sign Out',
    invalidPassword: 'Invalid administrator credentials',

    // Admin Dashboard
    adminPortalHeader: 'MB Global Management Portal',
    configuredTimezone: 'Configured Timezone:',
    exportCSV: 'Export CSV',
    exportJSON: 'Export JSON',
    tabBookings: 'Bookings',
    tabMeetingTypes: 'Meeting Types',
    tabWorkingHours: 'Working Hours',
    tabBlockedDates: 'Blocked Dates',
    tabGoogleCalendar: 'Google Calendar',

    // Admin Bookings Table
    searchPlaceholder: 'Search by name, email, company, or reference ID...',
    allStatuses: 'All Statuses',
    colRefId: 'Ref ID',
    colAttendee: 'Attendee',
    colType: 'Meeting Type',
    colDateTime: 'Date & Time',
    colStatus: 'Status',
    colMeet: 'Google Meet',
    noBookingsFound: 'No bookings match your current criteria.',

    // Admin Meeting Types
    createMeetingType: 'Create Meeting Type',
    active: 'Active',
    disabled: 'Disabled',
    edit: 'Edit',
    delete: 'Delete',
    saveType: 'Save Meeting Type',

    // Admin Working Hours
    weeklySchedule: 'Weekly Available Schedule',
    slotDuration: 'Slot Duration:',
    saveSchedule: 'Save Schedule Settings',

    // Admin Blocked Dates
    blockDateTitle: 'Block Date / Holiday',
    reasonLabel: 'Reason / Event Name',
    addBlockedDate: 'Add Blocked Date',
    currentlyBlocked: 'Currently Blocked Dates',

    // Admin Google Calendar Integration
    gcalIntegrationTitle: 'Google Calendar Integration',
    oauthStatus: 'OAuth Connection Status',
    connected: 'Connected',
    disconnected: 'Disconnected',
    connectedAccount: 'Connected Google Account:',
    lastSynced: 'Last Synced:',
    autoAddMeet: 'Automatically generate Google Meet video links for all customer bookings',
    connectGCal: 'Connect Google Calendar',
    disconnectGCal: 'Disconnect Google Calendar',
    testConnection: 'Test Calendar Connection',

    // Footer
    allRightsReserved: 'MB Global. All rights reserved.',
  },
  SW: {
    // Header & Navigation
    slogan: 'Kujenga Kesho, Leo.',
    portalTitle: 'Tovuti ya Miadi',
    newBooking: 'Miadi Mpya',
    manageBooking: 'Manage Miadi',
    adminPortal: 'Tovuti ya Admin',
    clientPortal: 'Tovuti ya Wateja',
    lightMode: 'Muonekano Mweupe',
    darkMode: 'Muonekano Mweusi',
    language: 'Lugha',

    // Client Flow - Step 1: Select Type
    selectTypeTitle: 'Chagua Aina ya Mkutano',
    selectTypeSub: 'Chagua aina ya ushauri au kikao kinachofaa mahitaji yako.',
    mins: 'dakika',

    // Client Flow - Step 2: Select Slot
    selectSlotTitle: 'Chagua Tarehe na Muda',
    backToTypes: 'Rudi kwenye Aina za Mikutano',
    selectDateLabel: 'Chagua Tarehe',
    selectTimeLabel: 'Chagua Muda Unaopatikana',
    noSlotsMsg: 'Hakuna nafasi kwenye tarehe hii kwa sababu ya ratiba iliyopo. Tafadhali chagua tarehe nyingine.',
    continueToDetails: 'Endelea Kujaza Taarifa',

    // Client Flow - Step 3: Enter Details
    enterDetailsTitle: 'Ingiza Taarifa Zako',
    backToTime: 'Rudi Kwenye Uchaguzi wa Muda',
    bookingFor: 'Kuhifadhi',
    onDate: 'tarehe',
    atTime: 'muda wa',
    fullName: 'Jina Kamili',
    emailAddress: 'Barua Pepe',
    phoneNumber: 'Nambari ya Simu',
    companyName: 'Jina la Kampuni',
    additionalNotes: 'Maelezo ya Ziada / Ajenda',
    confirmAppointment: 'Thibitisha Miadi',
    schedulingMsg: 'Inasawazishwa kwenye Google Calendar...',
    valNameReq: 'Jina kamili linahitajika',
    valEmailReq: 'Barua pepe inahitajika',
    valEmailInv: 'Anwani ya barua pepe si sahihi',
    valPhoneReq: 'Nambari ya simu inahitajika',
    valCompReq: 'Jina la kampuni linahitajika',

    // Client Flow - Step 4: Confirmation
    bookingConfirmed: 'Miadi Imethibitishwa!',
    confirmMsg: 'Miadi yako imeratibiwa kikamilifu na kuongezwa kwenye Google Calendar. Mwaliko umetumwa kwa',
    bookingRef: 'Nambari ya Kumbukumbu',
    meetingType: 'Aina ya Mkutano',
    dateTime: 'Tarehe na Muda',
    attendee: 'Mshiriki',
    meetLinkHeader: 'Kiungo Yako Halisi ya Google Meet:',
    copy: 'Nakili',
    copied: 'Imenakiliwa!',
    bookAnother: 'Hifadhi Miadi Nyingine',

    // Client Flow - Manage / Reschedule
    rescheduleOrCancel: 'Badilisha Tarehe au Ghairi Miadi',
    lookupPrompt: 'Ingiza Nambari ya Kumbukumbu (mf. mb-bk-101) au Barua Pepe ili kutafuta miadi yako.',
    lookupPlaceholder: 'Ingiza ID ya Miadi au Barua Pepe...',
    lookupBtn: 'Tafuta',
    noBookingFound: 'Hakuna miadi iliyopatikana kulingana na ID au Barua Pepe hiyo.',
    currentDateTime: 'Tarehe na Muda wa Sasa',
    googleMeetUrl: 'Kiungo cha Google Meet',
    rescheduleAppt: 'Panga Upya Miadi',
    newDate: 'Tarehe Mpya',
    newTimeSlot: 'Muda Mpya',
    cancelBooking: 'Ghairi Miadi',
    saveNewSchedule: 'Hifadhi Ratiba Mpya',
    confirmCancelAlert: 'Je, una uhakika unataka kughairi miadi hii? Hii itaondoa tukio kwenye Google Calendar.',

    // Admin Authentication & Login
    adminAuthTitle: 'Uthibitisho wa Admin',
    adminAuthPrompt: 'Ingiza nenosiri la msimamizi ili kuingia kwenye Tovuti ya MB Global.',
    adminPassword: 'Nenosiri la Admin',
    signInAdmin: 'Ingia Kama Admin',
    authenticating: 'Inathibitisha...',
    signOut: 'Ondoka',
    invalidPassword: 'Nenosiri la msimamizi si sahihi',

    // Admin Dashboard
    adminPortalHeader: 'Mfumo wa Usimamizi wa MB Global',
    configuredTimezone: 'Saa za Ukanda:',
    exportCSV: 'Pakua CSV',
    exportJSON: 'Pakua JSON',
    tabBookings: 'Miadi Yote',
    tabMeetingTypes: 'Aina za Mikutano',
    tabWorkingHours: 'Saa za Kazi',
    tabBlockedDates: 'Siku Zilizofungwa',
    tabGoogleCalendar: 'Google Calendar',

    // Admin Bookings Table
    searchPlaceholder: 'Tafuta kwa jina, barua pepe, kampuni au Kumbukumbu ID...',
    allStatuses: 'Hali Zote',
    colRefId: 'ID ya Kumbukumbu',
    colAttendee: 'Mshiriki',
    colType: 'Aina ya Mkutano',
    colDateTime: 'Tarehe na Muda',
    colStatus: 'Hali',
    colMeet: 'Google Meet',
    noBookingsFound: 'Hakuna miadi inayolingana na utafutaji wako.',

    // Admin Meeting Types
    createMeetingType: 'Tengeneza Aina ya Mkutano',
    active: 'Inafanya Kazi',
    disabled: 'Imezimwa',
    edit: 'Hariri',
    delete: 'Futa',
    saveType: 'Hifadhi Aina ya Mkutano',

    // Admin Working Hours
    weeklySchedule: 'Ratiba ya Saa za Kazi kwa Wiki',
    slotDuration: 'Muda wa Kila Miadi:',
    saveSchedule: 'Hifadhi Mipangilio ya Ratiba',

    // Admin Blocked Dates
    blockDateTitle: 'Funga Tarehe / Siku ya Likizo',
    reasonLabel: 'Sababu / Jina la Tukio',
    addBlockedDate: 'Ongeza Tarehe Iliyofungwa',
    currentlyBlocked: 'Tarehe Zilizofungwa Hivi Sasa',

    // Admin Google Calendar Integration
    gcalIntegrationTitle: 'Muunganiko wa Google Calendar',
    oauthStatus: 'Hali ya Muunganiko wa OAuth',
    connected: 'Imeunganishwa',
    disconnected: 'Haijaunganishwa',
    connectedAccount: 'Akaunti ya Google Iliyoundwa:',
    lastSynced: 'Mara ya Mwisho Kusawazishwa:',
    autoAddMeet: 'Tengeneza viungo vya mikutano ya video ya Google Meet kiotomatiki kwa miadi yote',
    connectGCal: 'Unganisha Google Calendar',
    disconnectGCal: 'Tenganisha Google Calendar',
    testConnection: 'Pima Muunganiko wa Kalenda',

    // Footer
    allRightsReserved: 'MB Global. Haki zote zimehifadhiwa.',
  }
};

export function getLanguagePreference() {
  try {
    return localStorage.getItem('mb_global_language') || 'EN';
  } catch (e) {
    return 'EN';
  }
}

export function setLanguagePreference(lang) {
  try {
    localStorage.setItem('mb_global_language', lang);
  } catch (e) {
    console.error('Failed to set language in storage:', e);
  }
}

export function getThemePreference() {
  try {
    return localStorage.getItem('mb_global_theme') || 'dark';
  } catch (e) {
    return 'dark';
  }
}

export function setThemePreference(theme) {
  try {
    localStorage.setItem('mb_global_theme', theme);
  } catch (e) {
    console.error('Failed to set theme in storage:', e);
  }
}
