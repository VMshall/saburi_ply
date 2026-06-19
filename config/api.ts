/**
 * Form endpoints (§8). Everything now POSTs same-origin to the /api/forms/[endpoint] proxy
 * (app/api/forms/[endpoint]/route.ts), which forwards to the external apiv2 backend server-side
 * — so the apiv2 origin never reaches the browser and there is no CORS to manage. Payloads and
 * the upstream status/body are passed through verbatim, so existing client success/error
 * handling is unchanged.
 */
export const API_CONFIG = {
  BASE: "/api/forms",
  ENDPOINTS: {
    CONTACT: "/contact-us",
    QUOTE: "/quote",
    ENQUIRY: "/enquiry",
    PARTNER: "/become-partner",
    SAVE_DATA: "/save-data",
    SUBSCRIBER: "/subscribers",
  },
} as const;

/** Convenience: full same-origin path for an endpoint, e.g. apiUrl("/contact-us"). */
export const apiUrl = (endpoint: string) => `${API_CONFIG.BASE}${endpoint}`;
