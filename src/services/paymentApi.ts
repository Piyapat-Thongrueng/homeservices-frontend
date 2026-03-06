const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface CreateCheckoutSessionItem {
  serviceId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface CreateCheckoutSessionAddress {
  address_line: string;
  city?: string;
  province?: string;
  postal_code?: string;
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
  params: CreateCheckoutSessionParams
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
  sessionId: string
): Promise<SessionOrderResponse> {
  const res = await fetch(
    `${API_URL}/api/payment/session/${encodeURIComponent(sessionId)}`
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
  discountPercent?: number;
  promotionId?: number;
  message?: string;
}

export async function validatePromotionCode(
  code: string
): Promise<PromotionValidationResponse> {
  const params = new URLSearchParams({ code });
  const res = await fetch(
    `${API_URL}/api/payment/promotion/validate?${params.toString()}`
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to validate promotion code");
  }
  return data;
}
