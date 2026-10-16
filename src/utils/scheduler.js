import { format, parse, addMinutes, isBefore, isSameDay, getDay } from 'date-fns';

const DAY_MAP = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/**
 * Returns available time slots for a given date, meeting duration, working hours, blocked dates, and existing bookings.
 */
export function getAvailableSlots({ dateStr, durationMinutes, workingHours, blockedDates, bookings }) {
  if (!dateStr) return [];

  // Check if date is blocked
  const isBlocked = blockedDates.some(
    (bd) => bd.date === dateStr
  );
  if (isBlocked) return [];

  const dateObj = new Date(dateStr + 'T00:00:00');
  const dayName = DAY_MAP[getDay(dateObj)];
  const daySchedule = workingHours.days[dayName];

  if (!daySchedule || !daySchedule.enabled) return [];

  const [startHour, startMin] = daySchedule.start.split(':').map(Number);
  const [endHour, endMin] = daySchedule.end.split(':').map(Number);

  const dayStartTime = new Date(dateObj);
  dayStartTime.setHours(startHour, startMin, 0, 0);

  const dayEndTime = new Date(dateObj);
  dayEndTime.setHours(endHour, endMin, 0, 0);

  const slotInterval = workingHours.slotInterval || 30;
  const slots = [];

  let currentSlot = dayStartTime;

  // Active existing bookings on this date
  const dayBookings = bookings.filter(
    (b) => b.date === dateStr && b.status !== 'Cancelled'
  );

  while (isBefore(addMinutes(currentSlot, durationMinutes), dayEndTime) ||
         addMinutes(currentSlot, durationMinutes).getTime() === dayEndTime.getTime()) {

    const slotFormattedTime = format(currentSlot, 'HH:mm');
    const slotEndFormattedTime = format(addMinutes(currentSlot, durationMinutes), 'HH:mm');

    // Check overlap with existing bookings
    const isOverlapping = dayBookings.some((booking) => {
      const bStartMinutes = timeToMinutes(booking.time);
      const bEndMinutes = bStartMinutes + (booking.duration || durationMinutes);

      const currentStartMinutes = timeToMinutes(slotFormattedTime);
      const currentEndMinutes = currentStartMinutes + durationMinutes;

      return (
        (currentStartMinutes >= bStartMinutes && currentStartMinutes < bEndMinutes) ||
        (currentEndMinutes > bStartMinutes && currentEndMinutes <= bEndMinutes) ||
        (currentStartMinutes <= bStartMinutes && currentEndMinutes >= bEndMinutes)
      );
    });

    if (!isOverlapping) {
      slots.push(slotFormattedTime);
    }

    currentSlot = addMinutes(currentSlot, slotInterval);
  }

  return slots;
}

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function formatTimeSlot(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const minStr = m < 10 ? `0${m}` : `${m}`;
  return `${hour12}:${minStr} ${period}`;
}
