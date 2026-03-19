const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface CreateCheckoutSessionItem {
  serviceId: number;
  serviceItemId?: number;
  name: string;
  quantity: number;
  price: number;
}

export interface CreateCheckoutSessionAddress {
  address_line: string;
  district?: string;
  subdistrict?: string;
  province?: string;
  postal_code?: string;
  /** Optional: from Leaflet pin – used when set (skips server geocoding). */
  latitude?: number;
  longitude?: number;
}

export interface CreateCheckoutSessionParams {
  authUserId: string;
  addressId?: number;
  address?: CreateCheckoutSessionAddress;
  promotionId?: number;
  items: CreateCheckoutSessionItem[];
  discountAmount: number;
  successUrl: string;
  cancelUrl: string;
  paymentType: "CR" | "QR";
}

export interface CreateCheckoutSessionResponse {
  url: string;
  sessionId: string;
  orderId: number;
}

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams,
): Promise<CreateCheckoutSessionResponse> {
  const res = await fetch(`${API_URL}/api/payment/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to create checkout session");
  }
  return data;
}

// ---- Stripe Elements (PaymentIntent) flow ----

export interface CreatePaymentIntentParams {
  authUserId: string;
  addressId?: number;
  address?: CreateCheckoutSessionAddress;
  promotionId?: number;
  items: CreateCheckoutSessionItem[];
  discountAmount: number;
  /** Optional appointment date (YYYY-MM-DD) */
  appointmentDate?: string;
  /** Optional appointment time (HH:mm) */
  appointmentTime?: string;
  /** Optional remark / additional info */
  remark?: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  orderId: number;
}

export async function createPaymentIntent(
  params: CreatePaymentIntentParams,
): Promise<CreatePaymentIntentResponse> {
  const res = await fetch(`${API_URL}/api/payment/create-payment-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to create payment intent");
  }
  return data;
}

/** Same as createPaymentIntent but for PromptPay (QR). Returns { clientSecret, orderId }. */
export async function createPromptPayIntent(
  params: CreatePaymentIntentParams,
): Promise<CreatePaymentIntentResponse> {
  const res = await fetch(`${API_URL}/api/payment/create-promptpay-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to create PromptPay intent");
  }
  return data;
}

export async function markPaymentIntentPaid(params: {
  authUserId: string;
  orderId: number;
  /** When paying from cart, pass cart item id so backend deletes it after payment */
  cartItemId?: number;
}): Promise<void> {
  const res = await fetch(`${API_URL}/api/payment/intent/mark-paid`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to mark order as paid");
  }
}

export interface SessionOrderItem {
  serviceId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface SessionOrderResponse {
  sessionId: string;
  paymentStatus: string;
  order: {
    id: number;
    status: string;
    netPrice: number;
    totalPrice: number;
    discountAmount: number;
    createdAt: string;
    items: SessionOrderItem[];
  };
}

export async function getCheckoutSession(
  sessionId: string,
): Promise<SessionOrderResponse> {
  const res = await fetch(
    `${API_URL}/api/payment/session/${encodeURIComponent(sessionId)}`,
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to get session");
  }
  return data;
}

export async function getStripeConfig(): Promise<{ publishableKey: string }> {
  const res = await fetch(`${API_URL}/api/payment/config`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to get Stripe config");
  }
  return data;
}

export interface PromotionValidationResponse {
  valid: boolean;
  /** 'percentage' = discount_value is %; 'fixed' = discount_value is THB amount */
  discountType?: "percentage" | "fixed";
  /** For percentage: e.g. 10 = 10%. For fixed: e.g. 1000 = 1000 THB off */
  discountValue?: number;
  promotionId?: number;
  message?: string;
}

/** Saved address row from GET /api/payment/addresses */
export interface SavedAddress {
  id: number;
  address_line: string;
  district: string | null;
  subdistrict: string | null;
  province: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at?: string;
}

export async function getSavedAddresses(
  authUserId: string,
): Promise<SavedAddress[]> {
  const params = new URLSearchParams({ authUserId });
  const res = await fetch(
    `${API_URL}/api/payment/addresses?${params.toString()}`,
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to load saved addresses");
  }
  return Array.isArray(data.addresses) ? data.addresses : [];
}

/** POST /api/payment/addresses/coords — UPDATE only, no new row */
export async function updateAddressCoords(params: {
  authUserId: string;
  /** When set, update by id only */
  addressId?: number;
  /** When addressId omitted, match row by these fields */
  address_line?: string;
  district?: string;
  subdistrict?: string;
  province?: string;
  postal_code?: string;
  latitude: number;
  longitude: number;
}): Promise<{ ok: boolean; addressId: number }> {
  const res = await fetch(`${API_URL}/api/payment/addresses/coords`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to update coordinates");
  }
  return data;
}

export async function validatePromotionCode(
  code: string,
): Promise<PromotionValidationResponse> {
  const params = new URLSearchParams({ code });
  const res = await fetch(
    `${API_URL}/api/payment/promotion/validate?${params.toString()}`,
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to validate promotion code");
  }
  return data;
}
