import React, { useState } from 'react';
import { Calendar, Clock, Video, ArrowRight, ArrowLeft, CheckCircle2, Copy, Search, RefreshCw, XCircle, Globe } from 'lucide-react';
import { getAvailableSlots, formatTimeSlot } from '../utils/scheduler';
import { generateMeetingLink } from '../services/storage';

export default function UserBookingFlow({ meetingTypes, workingHours, blockedDates, bookings, googleCalendar, onCreateBooking, onUpdateBookingStatus }) {
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
    if (!formData.userName.trim()) errors.userName = 'Full name is required';
    if (!formData.userEmail.trim()) {
      errors.userEmail = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
      errors.userEmail = 'Invalid email format';
    }
    if (!formData.userPhone.trim()) errors.userPhone = 'Phone number is required';
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const bookingId = `mb-bk-${Math.floor(100 + Math.random() * 900)}`;
    const googleEventId = `gcal-${bookingId}`;
    const realMeetUrl = generateMeetingLink(bookingId);

    const newBooking = {
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
      meetingLink: realMeetUrl,
      googleEventId: googleEventId,
      createdAt: new Date().toISOString(),
    };

    onCreateBooking(newBooking);
    setCreatedBooking(newBooking);
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
      setLookupError('No booking found matching that Reference ID or Email.');
    }
  };

  const handleRescheduleSubmit = () => {
    if (!rescheduleDate || !rescheduleTime) return;
    onUpdateBookingStatus(foundBooking.id, 'Rescheduled', {
      date: rescheduleDate,
      time: rescheduleTime
    });
    setFoundBooking(prev => ({ ...prev, status: 'Rescheduled', date: rescheduleDate, time: rescheduleTime }));
    alert('Booking successfully rescheduled and updated in Google Calendar!');
  };

  const handleCancelBooking = () => {
    if (confirm('Are you sure you want to cancel this booking? This will remove the event from Google Calendar.')) {
      onUpdateBookingStatus(foundBooking.id, 'Cancelled');
      setFoundBooking(prev => ({ ...prev, status: 'Cancelled' }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* View Switcher Header */}
      <div className="flex justify-between items-center mb-8 bg-mb-surface p-4 rounded-xl border border-mb-border">
        <div>
          <h2 className="text-xl font-bold text-mb-white flex items-center gap-2">
            <span className="bg-mb-blue text-white px-2 py-1 rounded text-sm font-semibold">MB</span>
            Global Schedule
          </h2>
          <p className="text-sm text-mb-textMuted mt-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-mb-blue" />
            Timezone: <span className="text-mb-white font-medium">Africa/Dar_es_Salaam (EAT)</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStep('SELECT_TYPE')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              step !== 'MANAGE' ? 'bg-mb-blue text-white' : 'bg-mb-dark text-mb-textLight hover:bg-mb-border'
            }`}
          >
            New Booking
          </button>
          <button
            onClick={() => {
              setStep('MANAGE');
              setFoundBooking(null);
              setLookupError('');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              step === 'MANAGE' ? 'bg-mb-blue text-white' : 'bg-mb-dark text-mb-textLight hover:bg-mb-border'
            }`}
          >
            Manage Booking
          </button>
        </div>
      </div>

      {/* STEP 1: SELECT MEETING TYPE */}
      {step === 'SELECT_TYPE' && (
        <div>
          <h3 className="text-2xl font-bold mb-2">Select a Meeting Type</h3>
          <p className="text-mb-textMuted mb-6">Choose the consultation or session that best matches your requirement.</p>

          <div className="grid md:grid-cols-3 gap-4">
            {activeMeetingTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => handleSelectType(type)}
                className="bg-mb-surface hover:bg-mb-surfaceLight border border-mb-border hover:border-mb-blue p-6 rounded-xl cursor-pointer transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-3 h-3 rounded-full mb-3" style={{ backgroundColor: type.color }} />
                  <h4 className="text-lg font-semibold mb-2">{type.title}</h4>
                  <p className="text-sm text-mb-textMuted mb-4 line-clamp-3">{type.description}</p>
                </div>
                <div className="pt-4 border-t border-mb-border/50 flex justify-between items-center text-xs text-mb-textLight">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-mb-blue" /> {type.duration} mins</span>
                  <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5 text-mb-blue" /> {type.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: SELECT DATE & TIME */}
      {step === 'SELECT_SLOT' && selectedType && (
        <div className="bg-mb-surface p-6 rounded-xl border border-mb-border">
          <button
            onClick={() => setStep('SELECT_TYPE')}
            className="text-sm text-mb-textMuted hover:text-white flex items-center gap-1 mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Meeting Types
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedType.color }} />
            <h3 className="text-xl font-bold">{selectedType.title} ({selectedType.duration} mins)</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-mb-textMuted mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-mb-blue" /> Select Date (Africa/Dar_es_Salaam)
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime('');
                }}
                className="w-full bg-mb-dark border border-mb-border rounded-lg p-3 text-mb-white focus:outline-none focus:border-mb-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-mb-textMuted mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-mb-blue" /> Select Available Time Slot
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
                          ? 'bg-mb-blue border-mb-blue text-white'
                          : 'bg-mb-dark border-mb-border text-mb-textLight hover:border-mb-blue'
                      }`}
                    >
                      {formatTimeSlot(slot)}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-mb-dark/50 border border-mb-border p-4 rounded-lg text-center text-sm text-mb-textMuted">
                  No slots available on this date due to existing events or non-working hours. Please select another date.
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-mb-border flex justify-end">
            <button
              disabled={!selectedTime}
              onClick={() => setStep('ENTER_DETAILS')}
              className="bg-mb-blue hover:bg-mb-accentHover disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 transition"
            >
              Continue to Details <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: ENTER USER DETAILS */}
      {step === 'ENTER_DETAILS' && (
        <div className="bg-mb-surface p-6 rounded-xl border border-mb-border">
          <button
            onClick={() => setStep('SELECT_SLOT')}
            className="text-sm text-mb-textMuted hover:text-white flex items-center gap-1 mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Time Selection
          </button>

          <h3 className="text-xl font-bold mb-1">Enter Your Information</h3>
          <p className="text-sm text-mb-textMuted mb-6">
            Booking {selectedType.title} on <span className="text-mb-blue font-semibold">{selectedDate}</span> at <span className="text-mb-blue font-semibold">{formatTimeSlot(selectedTime)}</span> (Africa/Dar_es_Salaam)
          </p>

          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-mb-textMuted mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className={`w-full bg-mb-dark border ${formErrors.userName ? 'border-red-500' : 'border-mb-border'} rounded-lg p-3 text-mb-white focus:outline-none focus:border-mb-blue`}
                />
                {formErrors.userName && <p className="text-red-400 text-xs mt-1">{formErrors.userName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-mb-textMuted mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="alex@company.com"
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                  className={`w-full bg-mb-dark border ${formErrors.userEmail ? 'border-red-500' : 'border-mb-border'} rounded-lg p-3 text-mb-white focus:outline-none focus:border-mb-blue`}
                />
                {formErrors.userEmail && <p className="text-red-400 text-xs mt-1">{formErrors.userEmail}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-mb-textMuted mb-1">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.userPhone}
                  onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                  className={`w-full bg-mb-dark border ${formErrors.userPhone ? 'border-red-500' : 'border-mb-border'} rounded-lg p-3 text-mb-white focus:outline-none focus:border-mb-blue`}
                />
                {formErrors.userPhone && <p className="text-red-400 text-xs mt-1">{formErrors.userPhone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-mb-textMuted mb-1">Company Name *</label>
                <input
                  type="text"
                  placeholder="e.g. MB Global Partner"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className={`w-full bg-mb-dark border ${formErrors.companyName ? 'border-red-500' : 'border-mb-border'} rounded-lg p-3 text-mb-white focus:outline-none focus:border-mb-blue`}
                />
                {formErrors.companyName && <p className="text-red-400 text-xs mt-1">{formErrors.companyName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-mb-textMuted mb-1">Additional Notes / Agenda</label>
              <textarea
                rows={3}
                placeholder="What would you like to discuss or accomplish during this session?"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-mb-dark border border-mb-border rounded-lg p-3 text-mb-white focus:outline-none focus:border-mb-blue resize-none"
              />
            </div>

            <div className="pt-4 border-t border-mb-border flex justify-end">
              <button
                type="submit"
                className="bg-mb-blue hover:bg-mb-accentHover text-white font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 transition"
              >
                Confirm Appointment <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 4: CONFIRMATION SCREEN */}
      {step === 'CONFIRMATION' && createdBooking && (
        <div className="bg-mb-surface p-8 rounded-xl border border-mb-border text-center">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
          <p className="text-mb-textMuted mb-6 max-w-md mx-auto">
            Your appointment has been successfully scheduled and added to Google Calendar. A calendar invite has been sent to <span className="text-mb-white font-semibold">{createdBooking.userEmail}</span>.
          </p>

          <div className="bg-mb-dark p-6 rounded-xl border border-mb-border max-w-lg mx-auto text-left space-y-3 mb-6">
            <div className="flex justify-between items-center border-b border-mb-border pb-3">
              <span className="text-xs text-mb-textMuted uppercase font-semibold">Booking Reference</span>
              <span className="font-mono font-bold text-mb-blue">{createdBooking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-mb-textMuted">Meeting Type:</span>
              <span className="text-sm font-semibold">{createdBooking.meetingTypeTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-mb-textMuted">Date & Time:</span>
              <span className="text-sm font-semibold">{createdBooking.date} @ {formatTimeSlot(createdBooking.time)} (Africa/Dar_es_Salaam)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-mb-textMuted">Attendee:</span>
              <span className="text-sm font-semibold">{createdBooking.userName} ({createdBooking.companyName})</span>
            </div>

            <div className="pt-3 border-t border-mb-border">
              <span className="block text-xs text-mb-textMuted uppercase font-semibold mb-1">Your Real Google Meet Video Link:</span>
              <div className="flex items-center gap-2 bg-mb-surface p-2.5 rounded-lg border border-mb-border">
                <Video className="w-4 h-4 text-mb-blue flex-shrink-0" />
                <a
                  href={createdBooking.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-mb-blue underline truncate flex-grow"
                >
                  {createdBooking.meetingLink}
                </a>
                <button
                  onClick={() => handleCopyLink(createdBooking.meetingLink)}
                  className="bg-mb-border hover:bg-mb-blue hover:text-white text-mb-textLight px-2.5 py-1 rounded text-xs transition flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> {copiedLink ? 'Copied!' : 'Copy'}
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
            className="bg-mb-blue hover:bg-mb-accentHover text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Book Another Session
          </button>
        </div>
      )}

      {/* MANAGE / RESCHEDULE / CANCEL STEP */}
      {step === 'MANAGE' && (
        <div className="bg-mb-surface p-6 rounded-xl border border-mb-border">
          <h3 className="text-xl font-bold mb-2">Reschedule or Cancel Booking</h3>
          <p className="text-sm text-mb-textMuted mb-6">Enter your Booking Reference ID (e.g. mb-bk-101) or Email address to look up your appointment.</p>

          <form onSubmit={handleLookupBooking} className="flex gap-2 mb-6">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-mb-textMuted absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Enter Booking ID or Email..."
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                className="w-full bg-mb-dark border border-mb-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-mb-white focus:outline-none focus:border-mb-blue"
              />
            </div>
            <button
              type="submit"
              className="bg-mb-blue hover:bg-mb-accentHover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Lookup
            </button>
          </form>

          {lookupError && (
            <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 rounded-lg text-sm mb-6">
              {lookupError}
            </div>
          )}

          {foundBooking && (
            <div className="bg-mb-dark p-6 rounded-xl border border-mb-border space-y-6">
              <div className="flex justify-between items-start border-b border-mb-border pb-4">
                <div>
                  <span className="text-xs text-mb-textMuted uppercase font-semibold">Reference #{foundBooking.id}</span>
                  <h4 className="text-lg font-bold text-mb-white">{foundBooking.meetingTypeTitle}</h4>
                  <p className="text-xs text-mb-textMuted">Booked for {foundBooking.userName} ({foundBooking.companyName})</p>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  foundBooking.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  foundBooking.status === 'Rescheduled' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {foundBooking.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-mb-textMuted uppercase">Current Date & Time</p>
                  <p className="font-medium text-mb-white">{foundBooking.date} @ {formatTimeSlot(foundBooking.time)} (Africa/Dar_es_Salaam)</p>
                </div>
                <div>
                  <p className="text-xs text-mb-textMuted uppercase">Google Meet Link</p>
                  <a href={foundBooking.meetingLink} target="_blank" rel="noreferrer" className="text-mb-blue underline text-xs">
                    {foundBooking.meetingLink}
                  </a>
                </div>
              </div>

              {foundBooking.status !== 'Cancelled' && (
                <div className="pt-4 border-t border-mb-border">
                  <h5 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-mb-blue" /> Reschedule Appointment
                  </h5>
                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs text-mb-textMuted mb-1">New Date</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="w-full bg-mb-surface border border-mb-border rounded-lg p-2.5 text-sm text-mb-white focus:outline-none focus:border-mb-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-mb-textMuted mb-1">New Time Slot</label>
                      <input
                        type="time"
                        value={rescheduleTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                        className="w-full bg-mb-surface border border-mb-border rounded-lg p-2.5 text-sm text-mb-white focus:outline-none focus:border-mb-blue"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={handleCancelBooking}
                      className="text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1 px-3 py-2 rounded border border-red-900/50 hover:bg-red-950/30 transition"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel Booking
                    </button>

                    <button
                      onClick={handleRescheduleSubmit}
                      className="bg-mb-blue hover:bg-mb-accentHover text-white px-4 py-2 rounded-lg text-xs font-medium transition"
                    >
                      Save New Schedule
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
