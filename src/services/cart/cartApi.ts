const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface CartItemDetail {
  id: number;
  serviceItemId: number;
  name: string;
  unit: string;
  quantity: number;
  pricePerUnit: number;
}

export interface CartItem {
  id: number;
  serviceId: number;
  serviceName: string;
  serviceImage: string | null;
  addressId: number | null;
  addressLine: string | null;
  district: string | null;
  subdistrict: string | null;
  province: string | null;
  postalCode: string | null;
  appointmentDate: string | null;
  appointmentTime: string | null;
  remark: string | null;
  details: CartItemDetail[];
  total: number;
}

export interface GetCartResponse {
  cartItems: CartItem[];
}

export async function getCart(authUserId: string): Promise<GetCartResponse> {
  const params = new URLSearchParams({ authUserId });
  const res = await fetch(`${API_URL}/api/cart?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to get cart");
  }
  return data;
}

export interface AddToCartItem {
  serviceItemId: number;
  quantity: number;
  pricePerUnit: number;
}

export interface AddToCartParams {
  authUserId: string;
  serviceId: number;
  addressId?: number;
  address?: {
    address_line: string;
    district?: string;
    subdistrict?: string;
    province?: string;
    postal_code?: string;
    latitude?: number;
    longitude?: number;
  };
  appointmentDate: string;
  appointmentTime: string;
  remark?: string;
  items: AddToCartItem[];
}

export interface AddToCartResponse {
  cartItemId: number;
  addressId: number;
}

export async function addToCart(
  params: AddToCartParams,
): Promise<AddToCartResponse> {
  const res = await fetch(`${API_URL}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to add to cart");
  }
  return data;
}

export interface UpdateCartParams {
  authUserId: string;
  addressId?: number;
  address?: {
    address_line: string;
    district?: string;
    subdistrict?: string;
    province?: string;
    postal_code?: string;
    latitude?: number;
    longitude?: number;
  };
  appointmentDate: string;
  appointmentTime: string;
  remark?: string;
  items: AddToCartItem[];
}

export async function updateCart(
  cartItemId: number,
  params: UpdateCartParams,
): Promise<{ ok: boolean; cartItemId: number }> {
  const res = await fetch(`${API_URL}/api/cart/${cartItemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to update cart");
  }
  return data;
}

export async function deleteCartItem(
  cartItemId: number,
  authUserId: string,
): Promise<void> {
  const params = new URLSearchParams({ authUserId });
  const res = await fetch(
    `${API_URL}/api/cart/${cartItemId}?${params.toString()}`,
    {
      method: "DELETE",
    },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to delete cart item");
  }
}

