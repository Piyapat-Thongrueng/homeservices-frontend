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

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Navbar from "@/components/common/Navbar";
import ServiceHero from "@/features/servicedetail/components/ServiceHero";
import ServiceSummaryCard from "@/features/servicedetail/components/ServiceSummaryCard";
import ServiceFooterNav from "@/features/servicedetail/components/ServiceFooterNav";
import DateInput from "@/features/servicedetail/components/DateInput";
import TimePicker from "@/features/servicedetail/components/TimePicker";
const AddressMapPicker = dynamic(
  () => import("@/features/servicedetail/components/AddressMapPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-70 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
        กำลังโหลดแผนที่...
      </div>
    ),
  },
);
import type { ServiceItem } from "@/features/servicedetail/types";
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
import { ChevronDown, ShoppingCart } from "lucide-react";
import {
  getCart,
  addToCart,
  updateCart,
} from "@/services/cartApi";
import { getSavedAddresses, type SavedAddress } from "@/services/paymentApi";
import {
  getDistrictsByProvince,
  getPostalCodeForLocation,
  getProvinces,
  getSubDistrictsByDistrict,
} from "@/utils/thailand-locations";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
import { fetchServices } from "@/services/serviceListsApi/serviceApi";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  normalizeReverseAddressResult,
  reverseGeocodeWithFallback,
} from "@/utils/reverseGeocode";

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
const parseFiniteCoordinate = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

const formatSavedAddressOption = (item: SavedAddress): string => {
  const rawLine = String(item.address_line ?? "").trim();
  const areaParts = [item.district, item.province]
    .filter(Boolean)
    .map((v) => String(v).trim())
    .filter(Boolean);
  const areaText = areaParts.join("/");

  if (rawLine && areaText) {
    return `${rawLine} - ${areaText}`;
  }
  if (rawLine) return rawLine;
  if (areaText) return areaText;
  return `ที่อยู่ #${item.id}`;
};

const formatSavedAddressSummary = (item: SavedAddress): string => {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[\s,./-]+/g, "")
      .replace(/^(ตำบล|แขวง|อำเภอ|เขต|จังหวัด)/, "");
  const pushUnique = (target: string[], raw?: string | null) => {
    const text = String(raw ?? "").trim();
    if (!text) return;
    const normalized = normalize(text);
    if (!normalized) return;
    const hasDuplicate = target.some((existing) => {
      const current = normalize(existing);
      return current.includes(normalized) || normalized.includes(current);
    });
    if (!hasDuplicate) target.push(text);
  };

  const parts: string[] = [];
  pushUnique(parts, item.address_line);
  pushUnique(parts, item.subdistrict);
  pushUnique(parts, item.district);
  pushUnique(parts, item.province);
  pushUnique(parts, item.postal_code);
  return parts.join(", ");
};

const buildSavedSummaryFromFields = (fields: {
  address?: string;
  subDistrict?: string;
  district?: string;
  province?: string;
  postalCode?: string;
}): string => {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[\s,./-]+/g, "")
      .replace(/^(ตำบล|แขวง|อำเภอ|เขต|จังหวัด)/, "");
  const pushUnique = (target: string[], raw?: string) => {
    const text = String(raw ?? "").trim();
    if (!text) return;
    const normalized = normalize(text);
    if (!normalized) return;
    const hasDuplicate = target.some((existing) => {
      const current = normalize(existing);
      return current.includes(normalized) || normalized.includes(current);
    });
    if (!hasDuplicate) target.push(text);
  };
  const parts: string[] = [];
  pushUnique(parts, fields.address);
  pushUnique(parts, fields.subDistrict);
  pushUnique(parts, fields.district);
  pushUnique(parts, fields.province);
  pushUnique(parts, fields.postalCode);
  return parts.join(", ");
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
  const isUsingSavedAddress = false;
  const [cartItemIdForService, setCartItemIdForService] = useState<number | null>(null);
  const [cartActionLoading, setCartActionLoading] = useState(false);
  const [cartActionError, setCartActionError] = useState<string | null>(null);
  const [cartActionSuccess, setCartActionSuccess] =
    useState<string | null>(null);
  const [reverseGeocodeLoading, setReverseGeocodeLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<
    { place_id: string; display_name: string; lat: string; lon: string; address?: Record<string, unknown> }[]
  >([]);
  const reverseGeocodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const locationSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  /**
   * When true, text-based geocode preview must not overwrite lat/lng (avoids pin
   * "jumping" 2–3s after map click when reverse geocode fills address fields).
   */
  const pinFromMapLockRef = useRef(false);

  /** Address line persisted to DB: only the "ที่อยู่" input. */
  const addressLine = (f: ServiceInfo) => buildAddressLine(f);

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
      setFormData({
        ...saved,
        addressId: undefined,
        saveAddress: false,
        savedAddressLine: undefined,
      });
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

  useEffect(() => {
    if (!state.user?.auth_user_id) {
      setSavedAddresses([]);
      setSelectedSavedAddressId("");
      return;
    }
    let cancelled = false;
    getSavedAddresses(state.user.auth_user_id)
      .then((rows) => {
        if (cancelled) return;
        setSavedAddresses(rows);
      })
      .catch(() => {
        if (!cancelled) setSavedAddresses([]);
      });
    return () => {
      cancelled = true;
    };
  }, [state.user?.auth_user_id]);

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
  }, [router.query.serviceId]); // eslint-disable-line react-hooks/exhaustive-deps -- only serviceId triggers reload

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
  const isFormValid = !!(
    formData.date &&
    formData.time &&
    (formData.address &&
      formData.subDistrict &&
      formData.district &&
      formData.province &&
      formData.postalCode)
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

    try {
      if (cartItemIdForService != null) {
        await updateCart(cartItemIdForService, {
          ...basePayload,
          ...addressPayload,
        });
        setCartActionSuccess(t("booking_info.msg_cart_updated"));
      } else {
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
    const isAddressField =
      field === "address" ||
      field === "subDistrict" ||
      field === "district" ||
      field === "province" ||
      field === "postalCode";
    if (isAddressField) {
      pinFromMapLockRef.current = false;
    }
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
        next.savedAddressLine = undefined;
      }
      return next;
    });
    if (isAddressField) {
      setSelectedSavedAddressId("");
    }
  };

  const applyReverseGeocodeToForm = async (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    try {
      setReverseGeocodeLoading(true);
      const data = await reverseGeocodeWithFallback(API_URL, lat, lng);
      if (!data) return;
      setFormData((prev) => ({
        ...prev,
        address: data.display_name || data.address_line || prev.address,
        subDistrict: data.subdistrict || prev.subDistrict,
        district: data.district || prev.district,
        province: data.province || prev.province,
        postalCode: data.postal_code || prev.postalCode,
        addressId: undefined,
        savedAddressLine: undefined,
      }));
      setSelectedSavedAddressId("");
    } catch {
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
    } finally {
      setReverseGeocodeLoading(false);
    }
  };

  const scheduleReverseGeocodeToForm = (lat: number, lng: number) => {
    if (reverseGeocodeTimerRef.current) {
      clearTimeout(reverseGeocodeTimerRef.current);
    }
    reverseGeocodeTimerRef.current = setTimeout(() => {
      reverseGeocodeTimerRef.current = null;
      void applyReverseGeocodeToForm(lat, lng);
    }, 450);
  };

  const fetchLocationSuggestions = async (q: string) => {
    const query = q.trim();
    if (!query) {
      setLocationSuggestions([]);
      return;
    }
    try {
      const params = new URLSearchParams({
        q: query,
        format: "jsonv2",
        addressdetails: "1",
        limit: "5",
        "accept-language": "th,en",
      });
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        { headers: { Accept: "application/json" } },
      );
      if (!res.ok) {
        setLocationSuggestions([]);
        return;
      }
      const data = (await res.json()) as {
        place_id: string;
        display_name: string;
        lat: string;
        lon: string;
        address?: Record<string, unknown>;
      }[];
      setLocationSuggestions(data);
    } catch {
      setLocationSuggestions([]);
    }
  };

  const scheduleLocationSearch = (value: string) => {
    setSearchQuery(value);
    if (locationSearchTimerRef.current) {
      clearTimeout(locationSearchTimerRef.current);
    }
    locationSearchTimerRef.current = setTimeout(() => {
      locationSearchTimerRef.current = null;
      void fetchLocationSuggestions(value);
    }, 500);
  };

  const selectLocationSuggestion = (item: {
    display_name: string;
    lat: string;
    lon: string;
    address?: Record<string, unknown>;
  }) => {
    const lat = Number(item.lat);
    const lng = Number(item.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const normalized = normalizeReverseAddressResult({
      display_name: item.display_name,
      address: item.address ?? {},
    });
    pinFromMapLockRef.current = true;
    setSearchQuery("");
    setLocationSuggestions([]);
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: normalized.display_name || normalized.address_line || prev.address,
      subDistrict: normalized.subdistrict || prev.subDistrict,
      district: normalized.district || prev.district,
      province: normalized.province || prev.province,
      postalCode: normalized.postal_code || prev.postalCode,
      addressId: undefined,
      savedAddressLine: undefined,
    }));
    setSelectedSavedAddressId("");
  };

  const selectSavedAddress = (rawId: string) => {
    setSelectedSavedAddressId(rawId);
    if (!rawId) {
      setFormData((prev) => ({
        ...prev,
        addressId: undefined,
        savedAddressLine: undefined,
      }));
      return;
    }
    const selected = savedAddresses.find((a) => a.id === Number(rawId));
    if (!selected) return;
    const selectedLat = parseFiniteCoordinate(selected.latitude);
    const selectedLng = parseFiniteCoordinate(selected.longitude);
    pinFromMapLockRef.current = true;
    setFormData((prev) => ({
      ...prev,
      address: String(selected.address_line ?? "").trim(),
      subDistrict: String(selected.subdistrict ?? "").trim(),
      district: String(selected.district ?? "").trim(),
      province: String(selected.province ?? "").trim(),
      postalCode: String(selected.postal_code ?? "").trim(),
      latitude: selectedLat ?? prev.latitude,
      longitude: selectedLng ?? prev.longitude,
      addressId: selected.id,
      savedAddressLine: formatSavedAddressSummary(selected) || undefined,
    }));

    const needsAdminParts =
      !String(selected.subdistrict ?? "").trim() ||
      !String(selected.district ?? "").trim() ||
      !String(selected.province ?? "").trim() ||
      !String(selected.postal_code ?? "").trim();
    if (!needsAdminParts) return;
    if (selectedLat == null || selectedLng == null) return;

    void (async () => {
      try {
        const data = await reverseGeocodeWithFallback(API_URL, selectedLat, selectedLng);
        if (!data) return;
        setFormData((prev) => {
          if (prev.addressId !== selected.id) return prev;
          const merged = {
            address: prev.address || data.display_name || data.address_line || "",
            subDistrict: prev.subDistrict || data.subdistrict || "",
            district: prev.district || data.district || "",
            province: prev.province || data.province || "",
            postalCode: prev.postalCode || data.postal_code || "",
          };
          return {
            ...prev,
            ...merged,
            savedAddressLine: buildSavedSummaryFromFields(merged) || prev.savedAddressLine,
          };
        });
      } catch {
        // Keep saved address values as-is when reverse lookup fails.
      }
    })();
  };

  const handleProvinceChange = (province: string) => {
    updateFormField("province", province);
    updateFormField("district", "");
    updateFormField("subDistrict", "");
    updateFormField("postalCode", "");
  };

  const handleDistrictChange = (district: string) => {
    updateFormField("district", district);
    updateFormField("subDistrict", "");
    updateFormField("postalCode", "");
  };

  const handleSubDistrictChange = (subDistrict: string) => {
    updateFormField("subDistrict", subDistrict);
    const postalCode = getPostalCodeForLocation(
      formData.province,
      formData.district,
      subDistrict,
    );
    updateFormField("postalCode", postalCode ?? "");
  };

  const provinces = getProvinces();
  const districts = formData.province
    ? getDistrictsByProvince(formData.province)
    : [];
  const subDistricts =
    formData.province && formData.district
      ? getSubDistrictsByDistrict(formData.province, formData.district)
      : [];

  /**
   * Geocode map center from typed address and/or location selectors.
   */
  useEffect(() => {
    if (!formData.address && !formData.province) {
      return;
    }

    const t = setTimeout(async () => {
      try {
        if (pinFromMapLockRef.current) {
          return;
        }
        const params = new URLSearchParams({
          address_line: formData.address || "",
          subdistrict: formData.subDistrict,
          district: formData.district,
          province: formData.province,
          postal_code: formData.postalCode || "",
        });
        const res = await fetch(`${API_URL}/api/geocode/preview?${params}`);
        const data = await res.json();
        if (pinFromMapLockRef.current) {
          return;
        }
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
    formData.address,
    formData.province,
    formData.district,
    formData.subDistrict,
    formData.postalCode,
  ]);

  useEffect(() => {
    return () => {
      if (reverseGeocodeTimerRef.current) {
        clearTimeout(reverseGeocodeTimerRef.current);
      }
      if (locationSearchTimerRef.current) {
        clearTimeout(locationSearchTimerRef.current);
      }
    };
  }, []);

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

              {/* Address fields */}
              {!isUsingSavedAddress && (
                <>
                  <div className="relative">
                    <label className="block headline-5 text-gray-800 font-medium mb-2">
                      ค้นหาที่อยู่หรือปักหมุดบนแผนที่
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => scheduleLocationSearch(e.target.value)}
                      placeholder="พิมพ์ชื่อสถานที่หรือที่อยู่..."
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg headline-5 text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors"
                    />
                    {locationSuggestions.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-md max-h-64 overflow-auto">
                        {locationSuggestions.map((item) => (
                          <button
                            key={String(item.place_id)}
                            type="button"
                            onClick={() => selectLocationSuggestion(item)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {item.display_name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {savedAddresses.length > 0 && (
                    <div>
                      <label className="block headline-5 text-gray-800 font-medium mb-2">
                        เลือกที่อยู่ที่เคยบันทึกไว้
                      </label>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenDropdown((prev) => !prev)}
                          aria-expanded={openDropdown}
                          className="flex w-full items-start justify-between gap-3 rounded-lg border border-gray-300 bg-white px-3 py-3 text-left text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 md:px-4 md:text-base"
                        >
                          <span className="min-w-0 flex-1 whitespace-normal break-words leading-6">
                            {selectedSavedAddressId
                              ? formatSavedAddressOption(
                                  savedAddresses.find(
                                    (i) => String(i.id) === selectedSavedAddressId,
                                  )!,
                                )
                              : "-- เลือกที่อยู่ที่บันทึกไว้ --"}
                          </span>
                          <ChevronDown
                            className={`mt-1 h-5 w-5 shrink-0 text-gray-400 transition-transform ${
                              openDropdown ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {openDropdown && (
                          <div className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-md">
                            {savedAddresses.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  selectSavedAddress(String(item.id));
                                  setOpenDropdown(false);
                                }}
                                className="w-full px-4 py-3 text-left text-sm leading-6 text-gray-700 transition-colors hover:bg-gray-100"
                              >
                                <span className="block whitespace-normal break-words">
                                  {formatSavedAddressOption(item)}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  <div>
                    <label className="block headline-5 text-gray-800 font-medium mb-2">
                      รายละเอียดที่อยู่<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        updateFormField("address", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg headline-5 text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors"
                      placeholder="กรุณากรอกที่อยู่"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block headline-5 text-gray-800 font-medium mb-2">
                        แขวง / ตำบล<span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.subDistrict}
                          onChange={(e) => handleSubDistrictChange(e.target.value)}
                          disabled={!formData.district}
                          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg headline-5 text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          <option value="" className="text-gray-400">
                            เลือกแขวง / ตำบล
                          </option>
                          {subDistricts.map((subDist) => (
                            <option key={subDist} value={subDist} className="text-gray-900">
                              {subDist}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block headline-5 text-gray-800 font-medium mb-2">
                        เขต / อำเภอ<span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.district}
                          onChange={(e) => handleDistrictChange(e.target.value)}
                          disabled={!formData.province}
                          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg headline-5 text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          <option value="" className="text-gray-400">
                            เลือกเขต / อำเภอ
                          </option>
                          {districts.map((dist) => (
                            <option key={dist} value={dist} className="text-gray-900">
                              {dist}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block headline-5 text-gray-800 font-medium mb-2">
                        จังหวัด<span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.province}
                          onChange={(e) => handleProvinceChange(e.target.value)}
                          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg headline-5 text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors cursor-pointer"
                        >
                          <option value="" className="text-gray-400">
                            เลือกจังหวัด
                          </option>
                          {provinces.map((prov) => (
                            <option key={prov} value={prov} className="text-gray-900">
                              {prov}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block headline-5 text-gray-800 font-medium mb-2">
                        รหัสไปรษณีย์<span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formData.postalCode}
                        onChange={(e) =>
                          updateFormField(
                            "postalCode",
                            e.target.value.replace(/\D/g, "").slice(0, 5),
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg headline-5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* 3) Map after location — keep showing when saveAddress is checked */}
                  <label className="block headline-5 text-gray-800 font-medium mb-2">
                    ตำแหน่งบนแผนที่ (คลิกแผนที่หรือลากหมุดให้ตรงจุด)
                  </label>
                  <div>
                    <AddressMapPicker
                      key="service-info-manual-address-map"
                      latitude={formData.latitude}
                      longitude={formData.longitude}
                      onPositionChange={(lat, lng) => {
                        pinFromMapLockRef.current = true;
                        scheduleReverseGeocodeToForm(lat, lng);
                      }}
                    />
                    {reverseGeocodeLoading && (
                      <p className="mt-2 text-sm text-gray-600">
                        กำลังอัปเดตที่อยู่จากตำแหน่งแผนที่...
                      </p>
                    )}
                  </div>
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
            />
            {user?.auth_user_id && (
              <div>
                <button
                  type="button"
                  disabled={!isFormValid || cartActionLoading}
                  onClick={handleCartAction}
                  className="btn-primary w-full inline-flex items-center justify-center gap-2 cursor-pointer"
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

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
