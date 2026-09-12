import { SQUARE_BOOKING_URL } from './links'

/*
 * PAGE 4 — SQUARE BOOKING PORTAL: PIPELINE & EVENT RULES
 * =====================================================
 * The scheduling terminal embeds the verified, live Square checkout
 * destination (iframeUrl below) inside the dark luxury glassmorphic
 * window frame. All appointments are isolated on the spa's Square
 * location (0NB0EXKZ3FFNB) — the business organizer's personal phone
 * calendar stays completely clean and free of clutter.
 *
 * The moment a client logs their booking selection, Square executes
 * BOTH automated background hooks simultaneously:
 *
 *  1. BUSINESS NOTIFICATION
 *     trigger : BOOKING_CREATED
 *     action  : immediate dashboard + email data push to the owner's
 *               registered spa account email profile
 *     rule    : Square Appointments → Notification settings
 *               (owner email profile on the spa's Square account)
 *
 *  2. CLIENT CALENDAR SYNC
 *     trigger : BOOKING_CREATED
 *     action  : imprints a permanent, verified task calendar reminder
 *               directly into the customer's personal Google Calendar
 *               mobile app timeline
 *     rule    : Square confirmation email → "Add to calendar" — the
 *               verified event lands in the client's Google Calendar
 *               (e.g. "Wednesday 24th, 2:00 PM – Bare Esthetics,
 *               Forest Hills")
 */
export const BOOKING_PIPELINE = {
  iframeUrl: SQUARE_BOOKING_URL,
  workflows: {
    businessNotification: {
      trigger: 'BOOKING_CREATED',
      channel: 'owner-spa-email',
    },
    clientCalendarSync: {
      trigger: 'BOOKING_CREATED',
      channel: 'client-google-calendar',
    },
  },
}
