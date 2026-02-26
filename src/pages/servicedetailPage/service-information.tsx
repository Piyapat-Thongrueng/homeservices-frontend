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
import { useRouter } from "next/router";
import Navbar from "@/components/common/Navbar";
import ServiceHero from "@/components/servicedetail/ServiceHero";
import ServiceSummaryCard from "@/components/servicedetail/ServiceSummaryCard";
import ServiceFooterNav from "@/components/servicedetail/ServiceFooterNav";
import DateInput from "@/components/servicedetail/DateInput";
import TimePicker from "@/components/servicedetail/TimePicker";
import LocationSelectors from "@/components/servicedetail/LocationSelectors";
import type { ServiceItem } from "@/components/servicedetail/types";
import type { Service } from "@/types/serviceListTypes/type";
import {
  SERVICE_INFO_STORAGE_KEY,
  SERVICE_ITEMS_STORAGE_KEY,
} from "@/constants/service-constants";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/utils/localStorage-helpers";
import { parseServiceItemsFromQuery } from "@/utils/router-helpers";
import { fetchServices } from "@/services/serviceListsApi/serviceApi";
import { useAuth } from "@/contexts/AuthContext";

const getServiceScopedKey = (
  baseKey: string,
  serviceIdParam?: string | string[],
  userId?: string,
) => {
  let key = baseKey;

  if (userId) {
    key = `${key}_${userId}`;
  }

  if (serviceIdParam) {
    const id = Array.isArray(serviceIdParam) ? serviceIdParam[0] : serviceIdParam;
    key = `${key}_${id}`;
  }

  return key;
};

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
  additionalInfo: string;
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
  additionalInfo: "",
};

export default function ServiceInformation() {
  const router = useRouter();
  const { user } = useAuth();
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  /**
   * Initialize form data with defaults to prevent hydration mismatch
   * Will be updated from localStorage on client side after mount
   */
  const [formData, setFormData] = useState<ServiceInfo>(defaultServiceInfo);

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
      user?.id,
    );

    const saved = getFromLocalStorage<ServiceInfo>(infoKey);
    if (saved) {
      setFormData(saved);
    }
  }, [router.isReady, router.query.serviceId, user?.id]);

  /**
   * Load service items from router query or localStorage (scoped by serviceId)
   */
  useEffect(() => {
    if (!router.isReady) return;

    const itemsKey = getServiceScopedKey(
      SERVICE_ITEMS_STORAGE_KEY,
      router.query.serviceId,
      user?.id,
    );

    // Try to get items from query parameter first
    const queryItems = parseServiceItemsFromQuery(router.query.items);
    if (queryItems.length > 0) {
      setServiceItems(queryItems);
      // Save to localStorage for summary display
      saveToLocalStorage(itemsKey, queryItems);
    } else {
      // Fallback to localStorage if no query param
      const savedItems =
        getFromLocalStorage<ServiceItem[]>(itemsKey);
      if (savedItems) {
        setServiceItems(savedItems);
      }
    }
  }, [router.isReady, router.query, user?.id]);

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
      user?.id,
    );

    saveToLocalStorage(infoKey, formData);
  }, [formData, isMounted, router.isReady, router.query.serviceId, user?.id]);

  /**
   * Calculate total price from selected service items
   */
  const total = serviceItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /**
   * Validate that all required fields are filled
   */
  const isFormValid = !!(
    formData.date &&
    formData.time &&
    formData.address &&
    formData.subDistrict &&
    formData.district &&
    formData.province
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
    router.back();
  };

  /**
   * Update a specific field in form data
   */
  const updateFormField = <K extends keyof ServiceInfo>(
    field: K,
    value: ServiceInfo[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-utility-bg font-prompt pb-32">
      <Navbar />
      <ServiceHero
        serviceName={selectedService?.name ?? ""}
        currentStep={2}
        imageUrl={selectedService?.image}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-6 lg:gap-8">
          {/* Left Panel - Service Information Form */}
          <section className="card-box bg-utility-white p-5 md:p-8">
            <h2 className="headline-3 text-gray-700 mb-6">กรอกข้อมูลบริการ</h2>

            <div className="space-y-6">
              {/* Date and Time Fields - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Input Component */}
                <DateInput
                  value={formData.date}
                  onChange={(date) => updateFormField("date", date)}
                  label="วันที่สะดวกใช้บริการ"
                  required
                />

                {/* Time Picker Component */}
                <TimePicker
                  value={formData.time}
                  onChange={(time) => updateFormField("time", time)}
                  label="เวลาที่สะดวกใช้บริการ"
                  required
                />
              </div>

              {/* Address Field - Full Width */}
              <div>
                <label className="block headline-5 text-gray-800 font-medium mb-2">
                  ที่อยู่<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateFormField("address", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg headline-5 text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors"
                  placeholder="กรุณากรอกที่อยู่"
                />
              </div>

              {/* Location Selectors Component */}
              <LocationSelectors
                province={formData.province}
                district={formData.district}
                subDistrict={formData.subDistrict}
                onProvinceChange={(province) => updateFormField("province", province)}
                onDistrictChange={(district) => updateFormField("district", district)}
                onSubDistrictChange={(subDistrict) =>
                  updateFormField("subDistrict", subDistrict)
                }
              />

              {/* Additional Information - Full Width */}
              <div>
                <label className="block headline-5 text-gray-800 font-medium mb-2">
                  ระบุข้อมูลเพิ่มเติม
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => updateFormField("additionalInfo", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg headline-5 text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 resize-none transition-colors"
                  placeholder="กรุณาระบุข้อมูลเพิ่มเติม"
                />
              </div>
            </div>
          </section>

          {/* Right Panel - Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ServiceSummaryCard
              items={serviceItems}
              total={total}
              serviceInfo={formData}
            />
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
