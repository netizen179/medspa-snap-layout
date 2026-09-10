/*
 * PAGE 3 — CLIENT INTAKE → TALLY.SO WEBHOOK LAYER
 * ================================================
 * The intake form routes its data dynamically, client-side (no backend
 * needed): submissions POST as JSON to the Tally.so webhook endpoint.
 *
 * Point TALLY_WEBHOOK_URL at the live endpoint from the Tally form:
 *   Tally dashboard → your form → Integrations → Webhooks
 * The JSON payload mirrors the Tally field keys (name / email /
 * phone / skin concern). Until the live URL is set, submissions
 * confirm locally without any network call.
 */
export const TALLY_WEBHOOK_URL = ''
