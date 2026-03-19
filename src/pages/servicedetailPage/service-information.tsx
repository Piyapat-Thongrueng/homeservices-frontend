/**
 * ServiceInformation Page
 *
 * The second step in the service booking flow where users enter
 * service information including date, time, address, and location.
 *
 * Features:
 * - Date and time selection
 * - Address input
 * - Location selection (Province, District, Sub-district)
 * - Additional information textarea
 * - Form validation
 * - LocalStorage persistence
 */

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Navbar from "@/components/common/Navbar";
import ServiceHero from "@/components/servicedetail/ServiceHero";
import ServiceSummaryCard from "@/components/servicedetail/ServiceSummaryCard";
import ServiceFooterNav from "@/components/servicedetail/ServiceFooterNav";
import DateInput from "@/components/servicedetail/DateInput";
import TimePicker from "@/components/servicedetail/TimePicker";
import LocationSelectors from "@/components/servicedetail/LocationSelectors";

const AddressMapPicker = dynamic(
  () => import("@/components/servicedetail/AddressMapPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-70 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
        กำลังโหลดแผนที่...
      </div>
    ),
  },
);
import type { ServiceItem } from "@/components/servicedetail/types";
import type { Service } from "@/types/serviceListTypes/type";
import {
  SERVICE_INFO_STORAGE_KEY,
  SERVICE_ITEMS_STORAGE_KEY,
} from "@/constants/service-constants";
import {
  getFromLocalStorage,
  saveToLocalStorage,
  getServiceScopedKey,
} from "@/utils/localStorage-helpers";
import { parseServiceItemsFromQuery } from "@/utils/router-helpers";
import {
  getPostalCodeForLocation,
  getSubDistrictsByDistrict,
} from "@/utils/thailand-locations";
import { ChevronDown, ShoppingCart } from "lucide-react";
import {
  getCart,
  addToCart,
  updateCart,
} from "@/services/cartApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
import { fetchServices } from "@/services/serviceListsApi/serviceApi";
import { useAuth } from "@/contexts/AuthContext";
import {
  getSavedAddresses,
  updateAddressCoords,
  type SavedAddress,
} from "@/services/paymentApi";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

/**
 * Service information form data structure
 */
interface ServiceInfo {
  date: string;
  time: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  additionalInfo: string;
  /** Optional: set by draggable map pin (Leaflet) */
  latitude?: number;
  longitude?: number;
  /** When user picks a saved address – payment uses addressId only (no duplicate DB row). */
  addressId?: number;
  /** User opted to persist this address; backend findOrInsertAddress dedupes same fields. */
  saveAddress?: boolean;
  /** Full address line used for summary/confirmation when a saved address is selected. */
  savedAddressLine?: string;
}

/**
 * Default empty service info
 */
const defaultServiceInfo: ServiceInfo = {
  date: "",
  time: "",
  address: "",
  subDistrict: "",
  district: "",
  province: "",
  postalCode: "",
  additionalInfo: "",
  latitude: undefined,
  longitude: undefined,
  addressId: undefined,
  saveAddress: false,
  savedAddressLine: undefined,
};

/** Address line persisted to DB: only the street/input address field. */
const buildAddressLine = (f: ServiceInfo) => (f.address ?? "").trim();

/** Saved-address display format: address line + province (as before). */
const formatSavedAddressLine = (addr: SavedAddress) => {
  const addressParts = [
    addr.address_line ?? "",
    addr.subdistrict ?? "",
    addr.district ?? "",
    addr.postal_code ?? "",
  ];
  const addressLine = addressParts
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
  const province = addr.province ?? "";
  return [addressLine.trim(), province.trim()].filter(Boolean).join(" · ").trim();
};

/** Full saved-address line for summary/confirmation (same shape as manual new input). */
const formatSavedAddressFullLine = (addr: SavedAddress) => {
  const base = (addr.address_line ?? "").replace(/\s+/g, " ").trim();
  const extras = [
    addr.subdistrict ?? "",
    addr.district ?? "",
    addr.province ?? "",
    addr.postal_code ?? "",
  ]
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !base.includes(p));

  return [base, ...extras].filter(Boolean).join(" ").trim();
};

/** Strip given tokens from the end of the string (for normalizing saved address_line). */
const stripLocationFromAddressLine = (
  input: string,
  parts: (string | null | undefined)[],
) => {
  let out = (input ?? "").trim();
  const tokens = parts
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  for (const t of tokens) {
    if (!t) continue;
    const re = new RegExp(`\\s*${t.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}$`);
    out = out.replace(re, "").trim();
  }
  return out;
};

export default function ServiceInformation() {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation("common");
  const { state } = useAuth();
  const user = state.user;
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  /**
   * Initialize form data with defaults to prevent hydration mismatch
   * Will be updated from localStorage on client side after mount
   */
  const [formData, setFormData] = useState<ServiceInfo>(defaultServiceInfo);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const isUsingSavedAddress = formData.addressId != null;
  const [mapDragged, setMapDragged] = useState(false);
  const [coordsUpdating, setCoordsUpdating] = useState(false);
  const [coordsMessage, setCoordsMessage] = useState<string | null>(null);
  const [cartItemIdForService, setCartItemIdForService] = useState<number | null>(null);
  const [cartActionLoading, setCartActionLoading] = useState(false);
  const [cartActionError, setCartActionError] = useState<string | null>(null);
  const [cartActionSuccess, setCartActionSuccess] =
    useState<string | null>(null);
  const selectedSaved = isUsingSavedAddress
    ? savedAddresses.find((a) => a.id === formData.addressId)
    : undefined;

  /** Address line persisted to DB: only the "ที่อยู่" input. */
  const addressLine = (f: ServiceInfo) => buildAddressLine(f);

  /** Load saved addresses for dropdown when user is logged in */
  useEffect(() => {
    if (!state.user?.auth_user_id) {
      setSavedAddresses([]);
      return;
    }
    let cancelled = false;
    getSavedAddresses(state.user.auth_user_id)
      .then((list) => {
        if (!cancelled) setSavedAddresses(list);
      })
      .catch(() => {
        if (!cancelled) setSavedAddresses([]);
      });
    return () => {
      cancelled = true;
    };
  }, [state.user?.auth_user_id]);

  /**
   * Load form data from localStorage on client side only (after mount)
   * This prevents hydration mismatch between server and client
   * Scoped by serviceId so each service has its own form data
   */
  useEffect(() => {
    if (!router.isReady) return;

    setIsMounted(true);
    const infoKey = getServiceScopedKey(
      SERVICE_INFO_STORAGE_KEY,
      router.query.serviceId,
      user?.auth_user_id,
    );

    const saved = getFromLocalStorage<ServiceInfo>(infoKey);
    if (saved) {
      setFormData(saved);
    }
  }, [router.isReady, router.query.serviceId, user?.auth_user_id]);

  /**
   * Load service items from router query or localStorage (scoped by serviceId)
   */
  useEffect(() => {
    if (!router.isReady) return;

    const itemsKey = getServiceScopedKey(
      SERVICE_ITEMS_STORAGE_KEY,
      router.query.serviceId,
      user?.auth_user_id,
    );

    // Try to get items from query parameter first
    const queryItems = parseServiceItemsFromQuery(router.query.items);
    if (queryItems.length > 0) {
      setServiceItems(queryItems);
      // Save to localStorage for summary display
      saveToLocalStorage(itemsKey, queryItems);
    } else {
      // Fallback to localStorage if no query param
      const savedItems = getFromLocalStorage<ServiceItem[]>(itemsKey);
      if (savedItems) {
        setServiceItems(savedItems);
      }
    }
  }, [router.isReady, router.query, user?.auth_user_id]);

  /** When user is logged in and we have serviceId, check if this service is already in cart (for Update cart vs Add to cart) */
  useEffect(() => {
    if (!state.user?.auth_user_id || !router.query.serviceId) {
      setCartItemIdForService(null);
      return;
    }
    const sid = Array.isArray(router.query.serviceId)
      ? router.query.serviceId[0]
      : router.query.serviceId;
    const serviceIdNum = parseInt(sid, 10);
    if (Number.isNaN(serviceIdNum)) return;
    let cancelled = false;
    getCart(state.user.auth_user_id)
      .then((res) => {
        if (cancelled) return;
        const found = (res.cartItems ?? []).find((c) => c.serviceId === serviceIdNum);
        setCartItemIdForService(found ? found.id : null);
      })
      .catch(() => {
        if (!cancelled) setCartItemIdForService(null);
      });
    return () => {
      cancelled = true;
    };
  }, [state.user?.auth_user_id, router.query.serviceId]);

  /**
   * Load selected service data from API using serviceId in query
   */
  useEffect(() => {
    const { serviceId } = router.query;
    if (!serviceId) return;

    const idString = Array.isArray(serviceId) ? serviceId[0] : serviceId;
    const id = parseInt(idString, 10);
    if (Number.isNaN(id)) return;

    let isSubscribed = true;

    const loadService = async () => {
      try {
        const services = await fetchServices({});
        if (!isSubscribed) return;

        const service = services.find((item) => item.id === id) ?? null;
        setSelectedService(service);
      } catch (error) {
        console.error("Error loading service detail (step 2):", error);
      }
    };

    loadService();

    return () => {
      isSubscribed = false;
    };
  }, [router.query.serviceId]);

  /**
   * Save form data to localStorage whenever it changes (only after mount)
   * Scoped by serviceId so each service has its own form data
   */
  useEffect(() => {
    if (!isMounted || !router.isReady) return;

    const infoKey = getServiceScopedKey(
      SERVICE_INFO_STORAGE_KEY,
      router.query.serviceId,
      user?.auth_user_id,
    );

    saveToLocalStorage(infoKey, formData);
  }, [formData, isMounted, router.isReady, router.query.serviceId, user?.auth_user_id]);

  /**
   * Calculate total price from selected service items
   */
  const total = serviceItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  /**
   * Validate that all required fields are filled
   */
  /** With addressId, payment uses saved row only — date/time still required */
  const isFormValid = !!(
    formData.date &&
    formData.time &&
    (formData.addressId != null ||
      (formData.address &&
        formData.subDistrict &&
        formData.district &&
        formData.province))
  );

  /**
   * Navigate to payment page with form data
   */
  const handleNext = () => {
    if (isFormValid) {
      router.push({
        pathname: "/servicedetailPage/payment",
        query: {
          items: router.query.items,
          serviceInfo: JSON.stringify(formData),
          serviceId: router.query.serviceId,
        },
      });
    }
  };

  /**
   * Navigate back to previous page
   */
  const handleBack = () => {
    // If user came from cart flow, go back to item selection step instead of browser history
    if (router.query.fromCart) {
      const sid = Array.isArray(router.query.serviceId)
        ? router.query.serviceId[0]
        : router.query.serviceId;
      router.push({
        pathname: "/servicedetailPage/ServiceDetails",
        query: sid ? { serviceId: sid } : undefined,
      });
    } else {
      router.back();
    }
  };

  /**
   * Add to cart or Update cart (below summary card)
   */
  const handleCartAction = async () => {
    if (!state.user?.auth_user_id || !isFormValid) return;
    const sid = Array.isArray(router.query.serviceId)
      ? router.query.serviceId[0]
      : router.query.serviceId;
    const serviceIdNum = parseInt(sid ?? "", 10);
    if (Number.isNaN(serviceIdNum)) return;
    if (serviceItems.length === 0) return;

    setCartActionError(null);
    setCartActionSuccess(null);
    setCartActionLoading(true);

    const items = serviceItems
      .filter((i) => i.quantity > 0)
      .map((i) => ({
        serviceItemId: i.id,
        quantity: i.quantity,
        pricePerUnit: i.price,
      }));
    if (items.length === 0) {
      setCartActionError(t("booking_info.msg_select_one"));
      setCartActionLoading(false);
      return;
    }

    const basePayload = {
      authUserId: state.user.auth_user_id,
      appointmentDate: formData.date,
      appointmentTime: formData.time,
      remark: formData.additionalInfo || undefined,
      items,
    };

    try {
      if (cartItemIdForService != null) {
        const addressPayload =
          formData.addressId != null
            ? { addressId: formData.addressId }
            : {
                address: {
                  address_line: addressLine(formData),
                  district: formData.district,
                  subdistrict: formData.subDistrict,
                  province: formData.province,
                  postal_code: formData.postalCode,
                  latitude: formData.latitude,
                  longitude: formData.longitude,
                },
              };
        await updateCart(cartItemIdForService, {
          ...basePayload,
          ...addressPayload,
        });
        setCartActionSuccess(t("booking_info.msg_cart_updated"));
      } else {
        const addressPayload =
          formData.addressId != null
            ? { addressId: formData.addressId }
            : {
                address: {
                  address_line: addressLine(formData),
                  district: formData.district,
                  subdistrict: formData.subDistrict,
                  province: formData.province,
                  postal_code: formData.postalCode,
                  latitude: formData.latitude,
                  longitude: formData.longitude,
                },
              };
        const res = await addToCart({
          ...basePayload,
          serviceId: serviceIdNum,
          ...addressPayload,
        });
        setCartActionSuccess(t("booking_info.msg_cart_added"));
        setCartItemIdForService(res.cartItemId);
      }
    } catch (err) {
      setCartActionError(
        err instanceof Error ? err.message : t("booking_info.msg_error")
      );
    } finally {
      setCartActionLoading(false);
    }
  };

  /**
   * Update a specific field in form data
   */
  const updateFormField = <K extends keyof ServiceInfo>(
    field: K,
    value: ServiceInfo[K],
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      /** Editing address fields manually clears saved address so backend inserts/reuses by payload */
      if (
        prev.addressId != null &&
        (field === "address" ||
          field === "subDistrict" ||
          field === "district" ||
          field === "province" ||
          field === "postalCode")
      ) {
        next.addressId = undefined;
      }
      return next;
    });
  };

  /** Apply a saved address row to the form and set addressId for payment. */
  const applySavedAddress = (addr: SavedAddress) => {
    const province = addr.province ?? "";
    const district = addr.district ?? "";
    const postalCode = addr.postal_code ?? "";
    // 1) Strip postal, province, district from end of address_line so "ที่อยู่" is street-only.
    let addressOnly = stripLocationFromAddressLine(addr.address_line ?? "", [
      postalCode,
      province,
      district,
    ]);
    // 2) If there's a trailing sub-district (ตำบล) name, strip it and use for dropdown.
    let subDistrict = "";
    const possibleSubDistricts = getSubDistrictsByDistrict(province, district);
    for (const sub of possibleSubDistricts.sort(
      (a, b) => b.length - a.length,
    )) {
      const trimmed = addressOnly.trim();
      if (!sub) continue;
      if (trimmed === sub) {
        addressOnly = "";
        subDistrict = sub;
        break;
      }
      if (trimmed.endsWith(" " + sub)) {
        addressOnly = trimmed.slice(0, -(sub.length + 1)).trim();
        subDistrict = sub;
        break;
      }
    }

    setFormData((prev) => ({
      ...prev,
      addressId: addr.id,
      saveAddress: false,
      savedAddressLine: formatSavedAddressFullLine(addr),
      province,
      district,
      postalCode,
      subDistrict,
      address: addressOnly,
      latitude: addr.latitude != null ? Number(addr.latitude) : prev.latitude,
      longitude:
        addr.longitude != null ? Number(addr.longitude) : prev.longitude,
    }));
  };

  /**
   * Map uses only ตำบล + อำเภอ + จังหวัด + รหัส — NOT ที่อยู่ (ที่อยู่ is often inaccurate for geocode).
   * User drags the pin to the exact spot; ที่อยู่ is still saved for the order.
   */
  useEffect(() => {
    if (!formData.province || !formData.district || !formData.subDistrict) {
      return;
    }

    const t = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          subdistrict: formData.subDistrict,
          district: formData.district,
          province: formData.province,
          postal_code: formData.postalCode || "",
        });
        const res = await fetch(`${API_URL}/api/geocode/preview?${params}`);
        const data = await res.json();
        if (
          data &&
          typeof data.latitude === "number" &&
          typeof data.longitude === "number"
        ) {
          setFormData((prev) => ({
            ...prev,
            latitude: data.latitude,
            longitude: data.longitude,
          }));
        }
      } catch {
        // ignore – map keeps current center
      }
    }, 500);
    return () => clearTimeout(t);
  }, [
    formData.province,
    formData.district,
    formData.subDistrict,
    formData.postalCode,
  ]);

  return (
    <div className="min-h-screen bg-utility-bg font-prompt pb-32">
      <Navbar />
      <ServiceHero
        serviceName={(locale === "en" ? selectedService?.name_en : selectedService?.name_th) || selectedService?.name || ""}
        currentStep={2}
        imageUrl={selectedService?.image}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-6 lg:gap-8">
          {/* Left Panel - Service Information Form */}
          <section className="card-box bg-utility-white p-5 md:p-8">
            <h2 className="headline-3 text-gray-700 mb-6">{t("booking_info.heading")}</h2>

            <div className="space-y-6">
              {/* Date and Time Fields - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Input Component */}
                <DateInput
                  value={formData.date}
                  onChange={(date) => updateFormField("date", date)}
                  label={t("booking_info.date_label")}
                  required
                />

                {/* Time Picker Component */}
                <TimePicker
                  value={formData.time}
                  onChange={(time) => updateFormField("time", time)}
                  label={t("booking_info.time_label")}
                  required
                />
              </div>

              {/* Saved addresses dropdown — same user reuses row in DB when paying */}
              {user?.auth_user_id && savedAddresses.length > 0 && (
                <div>
                  <label className="block headline-5 text-gray-800 font-medium mb-2">
                    {t("booking_info.address_saved")}
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg headline-5 text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors"
                      value={formData.addressId ?? ""}
                      onChange={(e) => {
                        const id = e.target.value
                          ? parseInt(e.target.value, 10)
                          : NaN;
                        if (Number.isNaN(id)) {
                          // กรอกที่อยู่ใหม่ — เคลียร์ฟิลด์ที่อยู่ทั้งหมด
                          setFormData((prev) => ({
                            ...prev,
                            addressId: undefined,
                            savedAddressLine: undefined,
                            address: "",
                            province: "",
                            district: "",
                            subDistrict: "",
                            postalCode: "",
                            latitude: undefined,
                            longitude: undefined,
                            saveAddress: false,
                          }));
                          setMapDragged(false);
                          setCoordsMessage(null);
                          return;
                        }
                        const addr = savedAddresses.find((a) => a.id === id);
                        if (addr) applySavedAddress(addr);
                      }}
                    >
                      <option value="">{t("booking_info.address_new")}</option>
                      {savedAddresses.map((a) => (
                        <option key={a.id} value={a.id}>
                          {formatSavedAddressLine(a) || `ที่อยู่ #${a.id}`}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                   {formData.addressId != null && (
                    <p className="mt-2 text-sm text-gray-600">
                      {t("booking_info.address_note")}
                    </p>
                  )}
                </div>
              )}

              {/* Map for saved address — move pin to update lat/long on that saved row */}
              {isUsingSavedAddress && user?.auth_user_id && (
                 <div>
                  <label className="block headline-5 text-gray-800 font-medium mb-2">
                    {t("booking_info.map_label")}
                  </label>
                  <AddressMapPicker
                    key={`saved-${formData.addressId}-${selectedSaved?.latitude ?? "na"}-${
                      selectedSaved?.longitude ?? "na"
                    }`}
                    latitude={
                      formData.latitude ??
                      (selectedSaved?.latitude != null
                        ? Number(selectedSaved.latitude)
                        : undefined)
                    }
                    longitude={
                      formData.longitude ??
                      (selectedSaved?.longitude != null
                        ? Number(selectedSaved.longitude)
                        : undefined)
                    }
                    onPositionChange={async (lat, lng) => {
                      if (!user?.auth_user_id || !formData.addressId) return;
                      setFormData((prev) => ({
                        ...prev,
                        latitude: lat,
                        longitude: lng,
                      }));
                      setCoordsMessage(null);
                      setCoordsUpdating(true);
                      try {
                        const res = await updateAddressCoords({
                          authUserId: user.auth_user_id,
                          addressId: formData.addressId,
                          latitude: lat,
                           longitude: lng,
                        });
                        setCoordsMessage(t("booking_info.msg_coords_updated"));
                        if (res?.addressId) {
                          setFormData((prev) => ({
                            ...prev,
                            addressId: res.addressId,
                          }));
                        }
                        const list = await getSavedAddresses(user.auth_user_id);
                        setSavedAddresses(list);
                      } catch (err) {
                        setCoordsMessage(
                           err instanceof Error
                            ? err.message
                            : t("booking_info.msg_coords_error"),
                        );
                      } finally {
                        setCoordsUpdating(false);
                      }
                    }}
                  />
                  {coordsMessage && (
                    <p className="mt-2 text-sm text-gray-600">
                      {coordsMessage}
                    </p>
                  )}
                </div>
              )}

              {/* Address fields: hidden when a saved address is selected */}
              {!isUsingSavedAddress && (
                <>
                  {/* 1) ที่อยู่ (house/soi/street) */}
                   <div>
                    <label className="block headline-5 text-gray-800 font-medium mb-2">
                      {t("booking_info.address_label")}<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        updateFormField("address", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg headline-5 text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors"
                    />
                  </div>

                  {/* 2) จังหวัด → เขต → ตำบล */}
                  <LocationSelectors
                    province={formData.province}
                    district={formData.district}
                    subDistrict={formData.subDistrict}
                    onProvinceChange={(province) => {
                      updateFormField("province", province);
                      updateFormField("district", "");
                      updateFormField("subDistrict", "");
                      updateFormField("postalCode", "");
                      // Keep previous lat/lng (when coming from a saved address) so map starts from existing coords.
                    }}
                    onDistrictChange={(district) => {
                      updateFormField("district", district);
                      updateFormField("subDistrict", "");
                      updateFormField("postalCode", "");
                      // Keep previous lat/lng (when coming from a saved address) so map starts from existing coords.
                    }}
                    onSubDistrictChange={(subDistrict) => {
                      updateFormField("subDistrict", subDistrict);
                      const postal = getPostalCodeForLocation(
                        formData.province,
                        formData.district,
                        subDistrict,
                      );
                      if (postal) {
                        updateFormField("postalCode", postal);
                      }
                    }}
                  />

                  {/* 3) Map after location — keep showing when saveAddress is checked */}
                  <label className="block headline-5 text-gray-800 font-medium mb-2">
                    ตำแหน่งบนแผนที่ (ลากหมุดให้ตรงจุด)
                  </label>
                  {formData.province &&
                  formData.district &&
                  (formData.subDistrict ||
                    (formData.latitude != null &&
                      formData.longitude != null)) ? (
                    <div>
                      <AddressMapPicker
                        key={`${formData.province}-${formData.district}-${formData.subDistrict ?? "pin"}`}
                        latitude={formData.latitude}
                        longitude={formData.longitude}
                        onPositionChange={(lat, lng) => {
                          setMapDragged(true);
                          setFormData((prev) => ({
                            ...prev,
                            latitude: lat,
                            longitude: lng,
                          }));
                        }}
                      />
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
                      {t("booking_info.btn_select_location_first")}
                    </div>
                  )}
                </>
              )}

              {/* Additional Information - Full Width */}
              <div>
                <label className="block headline-5 text-gray-800 font-medium mb-2">
                  {t("booking_info.additional_info_label")}
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) =>
                    updateFormField("additionalInfo", e.target.value)
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg headline-5 text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 resize-none transition-colors"
                  placeholder={t("booking_info.additional_info_placeholder")}
                />
              </div>
            </div>
          </section>

          {/* Right Panel - Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
            <ServiceSummaryCard
              items={serviceItems}
              total={total}
              serviceInfo={formData}
              savedAddressLine={
                formData.addressId != null
                  ? (() => {
                      const selected = savedAddresses.find(
                        (a) => a.id === formData.addressId,
                      );
                      if (!selected) return undefined;
                      return formatSavedAddressFullLine(selected);
                    })()
                  : undefined
              }
            />
            {user?.auth_user_id && (
              <div>
                <button
                  type="button"
                  disabled={!isFormValid || cartActionLoading}
                  onClick={handleCartAction}
                  className="btn-primary w-full inline-flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartActionLoading
                    ? t("booking_info.msg_saving")
                    : cartItemIdForService != null
                      ? t("booking_info.btn_update_cart")
                      : t("booking_info.btn_add_cart")}
                </button>
                {cartActionSuccess && (
                  <p className="body-3 text-green-600 mt-2">{cartActionSuccess}</p>
                )}
                {cartActionError && (
                  <p className="body-3 text-red-600 mt-2">{cartActionError}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <ServiceFooterNav 
        canProceed={isFormValid} 
        onBack={handleBack}
        onNext={handleNext}
      />
    </div>
  );
}

export const getServerSideProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
