import { CAL_COM_EVENT_URL } from './links'

/*
 * PAGE 4 — CAL.COM INLINE MODULE: PIPELINE & EVENT RULES
 * ======================================================
 * The scheduling terminal embeds the customer-facing Cal.com booking
 * event (iframeUrl below). The workflow settings in the Cal.com
 * dashboard isolate every booking on a dedicated workflow calendar —
 * the business organizer's personal phone calendar stays completely
 * clean and free of clutter.
 *
 * The moment a client logs their booking selection, the scheduling
 * system executes BOTH automated background hooks simultaneously:
 *
 *  1. BUSINESS NOTIFICATION
 *     trigger : BOOKING_CREATED
 *     action  : immediate dashboard + email data push to the owner's
 *               registered spa account email profile
 *     rule    : Cal.com Workflow → "Send email to host" (owner profile
 *               registered on the spa's Cal.com account)
 *
 *  2. CLIENT CALENDAR SYNC
 *     trigger : BOOKING_CREATED
 *     action  : imprints a permanent, verified task calendar reminder
 *               directly into the customer's personal Google Calendar
 *               mobile app timeline
 *     rule    : Cal.com Workflow → "Add event to calendar / send invite
 *               to attendee" (e.g. "Wednesday 24th, 2:00 PM – Facial
 *               Botox at Bare Esthetics, Forest Hills")
 */
export const CAL_BOOKING_PIPELINE = {
  iframeUrl: CAL_COM_EVENT_URL,
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
