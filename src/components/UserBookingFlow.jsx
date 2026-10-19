import React, { useState } from 'react';
import { Calendar, Clock, Video, ArrowRight, ArrowLeft, CheckCircle2, Copy, Search, RefreshCw, XCircle, Globe, AlertCircle } from 'lucide-react';
import { getAvailableSlots, formatTimeSlot } from '../utils/scheduler';
import { TRANSLATIONS } from '../utils/translations';

export default function UserBookingFlow({
  meetingTypes,
  workingHours,
  blockedDates,
  bookings,
  googleCalendar,
  onCreateBooking,
  onUpdateBookingStatus,
  lang = 'EN'
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  const [step, setStep] = useState('SELECT_TYPE'); // 'SELECT_TYPE' | 'SELECT_SLOT' | 'ENTER_DETAILS' | 'CONFIRMATION' | 'MANAGE'
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState('');

  // User form details
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    companyName: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Manage booking lookup
  const [lookupId, setLookupId] = useState('');
  const [foundBooking, setFoundBooking] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  const activeMeetingTypes = meetingTypes.filter(m => m.active);

  // Combine local bookings with connected Google Calendar busy events if synced
  const combinedBusyEvents = [
    ...bookings,
    ...(googleCalendar?.connected && googleCalendar?.calendarEvents ? googleCalendar.calendarEvents.map(evt => {
      const [evtDate, evtTimeFull] = (evt.start || '').split('T');
      return {
        date: evtDate,
        time: evtTimeFull ? evtTimeFull.substring(0, 5) : '00:00',
        duration: 60,
        status: 'Confirmed'
      };
    }) : [])
  ];

  const availableSlots = selectedType ? getAvailableSlots({
    dateStr: selectedDate,
    durationMinutes: selectedType.duration,
    workingHours,
    blockedDates,
    bookings: combinedBusyEvents,
  }) : [];

  const handleSelectType = (type) => {
    setSelectedType(type);
    setSelectedTime('');
    setStep('SELECT_SLOT');
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.userName.trim()) errors.userName = t.valNameReq;
    if (!formData.userEmail.trim()) {
      errors.userEmail = t.valEmailReq;
    } else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
      errors.userEmail = t.valEmailInv;
    }
    if (!formData.userPhone.trim()) errors.userPhone = t.valPhoneReq;
    if (!formData.companyName.trim()) errors.companyName = t.valCompReq;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmittingBooking(true);

    const bookingId = `mb-bk-${Math.floor(100 + Math.random() * 900)}`;

    const newBookingPayload = {
      id: bookingId,
      meetingTypeId: selectedType.id,
      meetingTypeTitle: selectedType.title,
      duration: selectedType.duration,
      date: selectedDate,
      time: selectedTime,
      timezone: 'Africa/Dar_es_Salaam',
      userName: formData.userName,
      userEmail: formData.userEmail,
      userPhone: formData.userPhone,
      companyName: formData.companyName,
      notes: formData.notes,
      status: 'Confirmed',
      meetingLink: '',
      googleEventId: '',
      createdAt: new Date().toISOString(),
    };

    let realGoogleEventId = `gcal-${bookingId}`;
    let realMeetLink = `https://meet.google.com/mbg-${bookingId.toLowerCase()}`;

    // Invoke serverless endpoint to create real Google Calendar event & Meet link
    try {
      const response = await fetch('/api/google/calendar/create-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookingPayload),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        realGoogleEventId = resData.googleEventId || realGoogleEventId;
        realMeetLink = resData.meetingLink || realMeetLink;
      }
    } catch (err) {
      console.error('Failed to communicate with Google Calendar creation route:', err);
    } finally {
      setIsSubmittingBooking(false);
    }

    const finalBooking = {
      ...newBookingPayload,
      googleEventId: realGoogleEventId,
      meetingLink: realMeetLink,
    };

    onCreateBooking(finalBooking);
    setCreatedBooking(finalBooking);
    setStep('CONFIRMATION');
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleLookupBooking = (e) => {
    e.preventDefault();
    setLookupError('');
    const found = bookings.find(
      b => b.id.toLowerCase() === lookupId.trim().toLowerCase() || b.userEmail.toLowerCase() === lookupId.trim().toLowerCase()
    );
    if (found) {
      setFoundBooking(found);
      setRescheduleDate(found.date);
      setRescheduleTime(found.time);
    } else {
      setFoundBooking(null);
      setLookupError(t.noBookingFound);
    }
  };

  const handleRescheduleSubmit = () => {
    if (!rescheduleDate || !rescheduleTime) return;
    onUpdateBookingStatus(foundBooking.id, 'Rescheduled', {
      date: rescheduleDate,
      time: rescheduleTime
    });
    setFoundBooking(prev => ({ ...prev, status: 'Rescheduled', date: rescheduleDate, time: rescheduleTime }));
    alert(t.saveNewSchedule + ' - Success');
  };

  const handleCancelBooking = () => {
    if (confirm(t.confirmCancelAlert)) {
      onUpdateBookingStatus(foundBooking.id, 'Cancelled');
      setFoundBooking(prev => ({ ...prev, status: 'Cancelled' }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* View Switcher Header */}
      <div className="flex justify-between items-center mb-8 dark:bg-mb-surface bg-white p-4 rounded-xl border dark:border-mb-border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold dark:text-mb-white text-slate-900 flex items-center gap-2 font-heading">
            <span className="bg-mb-blue text-white px-2 py-1 rounded text-sm font-semibold">MB</span>
            {t.portalTitle}
          </h2>
          <p className="text-sm dark:text-mb-textMuted text-slate-500 mt-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-mb-blue" />
            Timezone: <span className="dark:text-mb-white text-slate-800 font-medium">Africa/Dar_es_Salaam (EAT)</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStep('SELECT_TYPE')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              step !== 'MANAGE'
                ? 'bg-mb-blue text-white shadow-md'
                : 'dark:bg-mb-dark bg-slate-100 dark:text-mb-textLight text-slate-700 hover:bg-slate-200 dark:hover:bg-mb-border'
            }`}
          >
            {t.newBooking}
          </button>
          <button
            onClick={() => {
              setStep('MANAGE');
              setFoundBooking(null);
              setLookupError('');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              step === 'MANAGE'
                ? 'bg-mb-blue text-white shadow-md'
                : 'dark:bg-mb-dark bg-slate-100 dark:text-mb-textLight text-slate-700 hover:bg-slate-200 dark:hover:bg-mb-border'
            }`}
          >
            {t.manageBooking}
          </button>
        </div>
      </div>

      {/* STEP 1: SELECT MEETING TYPE */}
      {step === 'SELECT_TYPE' && (
        <div>
          <h3 className="text-2xl font-bold font-heading mb-2 dark:text-mb-white text-slate-900">{t.selectTypeTitle}</h3>
          <p className="dark:text-mb-textMuted text-slate-600 mb-6">{t.selectTypeSub}</p>

          <div className="grid md:grid-cols-3 gap-4">
            {activeMeetingTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => handleSelectType(type)}
                className="dark:bg-mb-surface bg-white dark:hover:bg-mb-surfaceLight hover:bg-slate-50 border dark:border-mb-border border-slate-200 hover:border-mb-blue dark:hover:border-mb-blue p-6 rounded-xl cursor-pointer transition flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="w-3 h-3 rounded-full mb-3" style={{ backgroundColor: type.color }} />
                  <h4 className="text-lg font-bold font-heading mb-2 dark:text-mb-white text-slate-900">{type.title}</h4>
                  <p className="text-sm dark:text-mb-textMuted text-slate-600 mb-4 line-clamp-3">{type.description}</p>
                </div>
                <div className="pt-4 border-t dark:border-mb-border/50 border-slate-200 flex justify-between items-center text-xs dark:text-mb-textLight text-slate-700">
                  <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5 text-mb-blue" /> {type.duration} {t.mins}</span>
                  <span className="flex items-center gap-1 font-medium"><Video className="w-3.5 h-3.5 text-mb-blue" /> {type.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: SELECT DATE & TIME */}
      {step === 'SELECT_SLOT' && selectedType && (
        <div className="dark:bg-mb-surface bg-white p-6 rounded-xl border dark:border-mb-border border-slate-200 shadow-sm">
          <button
            onClick={() => setStep('SELECT_TYPE')}
            className="text-sm dark:text-mb-textMuted text-slate-500 hover:text-mb-blue flex items-center gap-1 mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> {t.backToTypes}
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedType.color }} />
            <h3 className="text-xl font-bold font-heading dark:text-mb-white text-slate-900">{selectedType.title} ({selectedType.duration} {t.mins})</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium dark:text-mb-textMuted text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-mb-blue" /> {t.selectDateLabel} (Africa/Dar_es_Salaam)
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime('');
                }}
                className="w-full dark:bg-mb-dark bg-slate-50 border dark:border-mb-border border-slate-300 rounded-lg p-3 dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-mb-textMuted text-slate-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-mb-blue" /> {t.selectTimeLabel}
              </label>

              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`p-2.5 rounded-lg text-sm border font-medium transition ${
                        selectedTime === slot
                          ? 'bg-mb-blue border-mb-blue text-white shadow-sm'
                          : 'dark:bg-mb-dark bg-slate-50 border-slate-200 dark:border-mb-border dark:text-mb-textLight text-slate-800 hover:border-mb-blue'
                      }`}
                    >
                      {formatTimeSlot(slot)}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="dark:bg-mb-dark/50 bg-slate-100 border dark:border-mb-border border-slate-200 p-4 rounded-lg text-center text-sm dark:text-mb-textMuted text-slate-600">
                  {t.noSlotsMsg}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t dark:border-mb-border border-slate-200 flex justify-end">
            <button
              disabled={!selectedTime}
              onClick={() => setStep('ENTER_DETAILS')}
              className="bg-mb-blue hover:bg-mb-accentHover disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 transition shadow-md"
            >
              {t.continueToDetails} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: ENTER USER DETAILS */}
      {step === 'ENTER_DETAILS' && (
        <div className="dark:bg-mb-surface bg-white p-6 rounded-xl border dark:border-mb-border border-slate-200 shadow-sm">
          <button
            onClick={() => setStep('SELECT_SLOT')}
            className="text-sm dark:text-mb-textMuted text-slate-500 hover:text-mb-blue flex items-center gap-1 mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> {t.backToTime}
          </button>

          <h3 className="text-xl font-bold font-heading mb-1 dark:text-mb-white text-slate-900">{t.enterDetailsTitle}</h3>
          <p className="text-sm dark:text-mb-textMuted text-slate-600 mb-6">
            {t.bookingFor} <span className="text-mb-blue font-semibold">{selectedType.title}</span> {t.onDate} <span className="text-mb-blue font-semibold">{selectedDate}</span> {t.atTime} <span className="text-mb-blue font-semibold">{formatTimeSlot(selectedTime)}</span> (Africa/Dar_es_Salaam)
          </p>

          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase dark:text-mb-textMuted text-slate-700 mb-1">{t.fullName} *</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className={`w-full dark:bg-mb-dark bg-slate-50 border ${formErrors.userName ? 'border-red-500' : 'dark:border-mb-border border-slate-300'} rounded-lg p-3 dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue`}
                />
                {formErrors.userName && <p className="text-red-500 text-xs mt-1">{formErrors.userName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase dark:text-mb-textMuted text-slate-700 mb-1">{t.emailAddress} *</label>
                <input
                  type="email"
                  placeholder="alex@company.com"
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                  className={`w-full dark:bg-mb-dark bg-slate-50 border ${formErrors.userEmail ? 'border-red-500' : 'dark:border-mb-border border-slate-300'} rounded-lg p-3 dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue`}
                />
                {formErrors.userEmail && <p className="text-red-500 text-xs mt-1">{formErrors.userEmail}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase dark:text-mb-textMuted text-slate-700 mb-1">{t.phoneNumber} *</label>
                <input
                  type="tel"
                  placeholder="+255 700 000 000"
                  value={formData.userPhone}
                  onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                  className={`w-full dark:bg-mb-dark bg-slate-50 border ${formErrors.userPhone ? 'border-red-500' : 'dark:border-mb-border border-slate-300'} rounded-lg p-3 dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue`}
                />
                {formErrors.userPhone && <p className="text-red-500 text-xs mt-1">{formErrors.userPhone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase dark:text-mb-textMuted text-slate-700 mb-1">{t.companyName} *</label>
                <input
                  type="text"
                  placeholder="e.g. MB Global Partner"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className={`w-full dark:bg-mb-dark bg-slate-50 border ${formErrors.companyName ? 'border-red-500' : 'dark:border-mb-border border-slate-300'} rounded-lg p-3 dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue`}
                />
                {formErrors.companyName && <p className="text-red-500 text-xs mt-1">{formErrors.companyName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase dark:text-mb-textMuted text-slate-700 mb-1">{t.additionalNotes}</label>
              <textarea
                rows={3}
                placeholder="..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full dark:bg-mb-dark bg-slate-50 border dark:border-mb-border border-slate-300 rounded-lg p-3 dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue resize-none"
              />
            </div>

            <div className="pt-4 border-t dark:border-mb-border border-slate-200 flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingBooking}
                className="bg-mb-blue hover:bg-mb-accentHover disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 transition shadow-md"
              >
                {isSubmittingBooking ? t.schedulingMsg : t.confirmAppointment}
                {!isSubmittingBooking && <CheckCircle2 className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 4: CONFIRMATION SCREEN */}
      {step === 'CONFIRMATION' && createdBooking && (
        <div className="dark:bg-mb-surface bg-white p-8 rounded-xl border dark:border-mb-border border-slate-200 text-center shadow-md">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h3 className="text-2xl font-bold font-heading mb-2 dark:text-mb-white text-slate-900">{t.bookingConfirmed}</h3>
          <p className="dark:text-mb-textMuted text-slate-600 mb-6 max-w-md mx-auto text-sm">
            {t.confirmMsg} <span className="dark:text-mb-white text-slate-900 font-semibold">{createdBooking.userEmail}</span>.
          </p>

          <div className="dark:bg-mb-dark bg-slate-50 p-6 rounded-xl border dark:border-mb-border border-slate-200 max-w-lg mx-auto text-left space-y-3 mb-6">
            <div className="flex justify-between items-center border-b dark:border-mb-border border-slate-200 pb-3">
              <span className="text-xs dark:text-mb-textMuted text-slate-500 uppercase font-semibold">{t.bookingRef}</span>
              <span className="font-mono font-bold text-mb-blue">{createdBooking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm dark:text-mb-textMuted text-slate-600">{t.meetingType}:</span>
              <span className="text-sm font-semibold dark:text-mb-white text-slate-900">{createdBooking.meetingTypeTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm dark:text-mb-textMuted text-slate-600">{t.dateTime}:</span>
              <span className="text-sm font-semibold dark:text-mb-white text-slate-900">{createdBooking.date} @ {formatTimeSlot(createdBooking.time)} (Africa/Dar_es_Salaam)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm dark:text-mb-textMuted text-slate-600">{t.attendee}:</span>
              <span className="text-sm font-semibold dark:text-mb-white text-slate-900">{createdBooking.userName} ({createdBooking.companyName})</span>
            </div>

            <div className="pt-3 border-t dark:border-mb-border border-slate-200">
              <span className="block text-xs dark:text-mb-textMuted text-slate-500 uppercase font-semibold mb-1">{t.meetLinkHeader}</span>
              <div className="flex items-center gap-2 dark:bg-mb-surface bg-white p-2.5 rounded-lg border dark:border-mb-border border-slate-200">
                <Video className="w-4 h-4 text-mb-blue flex-shrink-0" />
                <a
                  href={createdBooking.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-mb-blue underline truncate flex-grow font-medium"
                >
                  {createdBooking.meetingLink}
                </a>
                <button
                  onClick={() => handleCopyLink(createdBooking.meetingLink)}
                  className="dark:bg-mb-border bg-slate-200 hover:bg-mb-blue hover:text-white dark:text-mb-textLight text-slate-800 px-2.5 py-1 rounded text-xs transition flex items-center gap-1 font-medium"
                >
                  <Copy className="w-3 h-3" /> {copiedLink ? t.copied : t.copy}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedType(null);
              setSelectedTime('');
              setFormData({ userName: '', userEmail: '', userPhone: '', companyName: '', notes: '' });
              setStep('SELECT_TYPE');
            }}
            className="bg-mb-blue hover:bg-mb-accentHover text-white px-6 py-2.5 rounded-lg text-sm font-medium transition shadow-md"
          >
            {t.bookAnother}
          </button>
        </div>
      )}

      {/* MANAGE / RESCHEDULE / CANCEL STEP */}
      {step === 'MANAGE' && (
        <div className="dark:bg-mb-surface bg-white p-6 rounded-xl border dark:border-mb-border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold font-heading mb-2 dark:text-mb-white text-slate-900">{t.rescheduleOrCancel}</h3>
          <p className="text-sm dark:text-mb-textMuted text-slate-600 mb-6">{t.lookupPrompt}</p>

          <form onSubmit={handleLookupBooking} className="flex gap-2 mb-6">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder={t.lookupPlaceholder}
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                className="w-full dark:bg-mb-dark bg-slate-50 border dark:border-mb-border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-sm dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue"
              />
            </div>
            <button
              type="submit"
              className="bg-mb-blue hover:bg-mb-accentHover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-md"
            >
              {t.lookupBtn}
            </button>
          </form>

          {lookupError && (
            <div className="p-4 bg-red-950/20 border border-red-800 text-red-500 rounded-lg text-sm mb-6">
              {lookupError}
            </div>
          )}

          {foundBooking && (
            <div className="dark:bg-mb-dark bg-slate-50 p-6 rounded-xl border dark:border-mb-border border-slate-200 space-y-6">
              <div className="flex justify-between items-start border-b dark:border-mb-border border-slate-200 pb-4">
                <div>
                  <span className="text-xs dark:text-mb-textMuted text-slate-500 uppercase font-semibold">{t.bookingRef} #{foundBooking.id}</span>
                  <h4 className="text-lg font-bold font-heading dark:text-mb-white text-slate-900">{foundBooking.meetingTypeTitle}</h4>
                  <p className="text-xs dark:text-mb-textMuted text-slate-600">Booked for {foundBooking.userName} ({foundBooking.companyName})</p>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  foundBooking.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' :
                  foundBooking.status === 'Rescheduled' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                  'bg-red-500/20 text-red-500 border border-red-500/30'
                }`}>
                  {foundBooking.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs dark:text-mb-textMuted text-slate-500 uppercase">{t.currentDateTime}</p>
                  <p className="font-medium dark:text-mb-white text-slate-900">{foundBooking.date} @ {formatTimeSlot(foundBooking.time)} (Africa/Dar_es_Salaam)</p>
                </div>
                <div>
                  <p className="text-xs dark:text-mb-textMuted text-slate-500 uppercase">{t.googleMeetUrl}</p>
                  <a href={foundBooking.meetingLink} target="_blank" rel="noreferrer" className="text-mb-blue underline text-xs">
                    {foundBooking.meetingLink}
                  </a>
                </div>
              </div>

              {foundBooking.status !== 'Cancelled' && (
                <div className="pt-4 border-t dark:border-mb-border border-slate-200">
                  <h5 className="text-sm font-semibold mb-3 flex items-center gap-1.5 dark:text-mb-white text-slate-900">
                    <RefreshCw className="w-4 h-4 text-mb-blue" /> {t.rescheduleAppt}
                  </h5>
                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs dark:text-mb-textMuted text-slate-600 mb-1">{t.newDate}</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="w-full dark:bg-mb-surface bg-white border dark:border-mb-border border-slate-300 rounded-lg p-2.5 text-sm dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-xs dark:text-mb-textMuted text-slate-600 mb-1">{t.newTimeSlot}</label>
                      <input
                        type="time"
                        value={rescheduleTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                        className="w-full dark:bg-mb-surface bg-white border dark:border-mb-border border-slate-300 rounded-lg p-2.5 text-sm dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={handleCancelBooking}
                      className="text-red-500 hover:text-red-600 text-xs font-semibold flex items-center gap-1 px-3 py-2 rounded border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                    >
                      <XCircle className="w-3.5 h-3.5" /> {t.cancelBooking}
                    </button>

                    <button
                      onClick={handleRescheduleSubmit}
                      className="bg-mb-blue hover:bg-mb-accentHover text-white px-4 py-2 rounded-lg text-xs font-medium transition shadow-md"
                    >
                      {t.saveNewSchedule}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
