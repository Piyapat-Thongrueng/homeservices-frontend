/**
 * ServiceDetails Page
 * 
 * The first step in the service booking flow where users select
 * service items and quantities. Displays a list of available services
 * with quantity selectors and a summary card.
 * 
 * Features:
 * - Service item selection with quantity controls
 * - Real-time total calculation
 * - LocalStorage persistence
 * - Navigation to next step
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Navbar from "@/components/common/Navbar";
import ServiceHero from "@/components/servicedetail/ServiceHero";
import ServiceItemsSection from "@/components/servicedetail/ServiceItemsSection";
import ServiceSummaryCard from "@/components/servicedetail/ServiceSummaryCard";
import ServiceFooterNav from "@/components/servicedetail/ServiceFooterNav";
import type { ServiceItem } from "@/components/servicedetail/types";
import type {
  ServiceDetailResponseApi,
} from "@/types/serviceListTypes/type";
import {
  ALL_ITEMS_STORAGE_KEY,
} from "@/constants/service-constants";
import {
  getFromLocalStorage,
  saveToLocalStorage,
  getServiceScopedKey,
} from "@/utils/localStorage-helpers";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ServiceDetails() {
  const router = useRouter();
  const { state } = useAuth();
  const user = state.user;

  const [selectedService, setSelectedService] = useState<ServiceDetailResponseApi | null>(null);
  
  /**
   * Initialize service items as empty; will be populated from
   * user+service-scoped localStorage or API on client side after mount
   */
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  /**
   * Allow saving to localStorage only after router is ready (avoids overwriting before load).
   */
  useEffect(() => {
    if (router.isReady) setIsMounted(true);
  }, [router.isReady]);

  /**
   * Load service data from API using serviceId in query
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
        const response = await axios.get<ServiceDetailResponseApi>(
          `${API_URL}/api/services/${id}`,
        );
        const data = response.data;
        if (!isSubscribed) return;

        setSelectedService(data);
      } catch (error) {
        console.error("Error loading service detail:", error);
      }
    };

    loadService();

    return () => {
      isSubscribed = false;
    };
  }, [router.query.serviceId]);

  /**
   * When a service with items is loaded from the API, initialize service items
   * from API and merge saved quantities from localStorage (same key as above).
   */
  useEffect(() => {
    if (!selectedService) return;

    const detail = selectedService;
    if (!Array.isArray(detail.items) || detail.items.length === 0) return;

    const { serviceId } = router.query;
    const allItemsKey = getServiceScopedKey(
      ALL_ITEMS_STORAGE_KEY,
      serviceId,
      user?.auth_user_id,
    );
    const savedItems = getFromLocalStorage<ServiceItem[]>(allItemsKey);

    const mappedItems: ServiceItem[] = detail.items.map((apiItem) => {
      const saved = savedItems?.find((s) => s.id === apiItem.id);
      return {
        id: apiItem.id,
        description: `${apiItem.name}`,
        unit: apiItem.unit,
        price: apiItem.price_per_unit,
        quantity: saved?.quantity ?? 0,
      };
    });

    setServiceItems(mappedItems);
  }, [selectedService?.id, router.query.serviceId, user?.auth_user_id]);

  /**
   * Items to display: always derived from current API (selectedService.items)
   * with quantities from state. Keeps quantity logic while data comes from API.
   */
  const displayItems: ServiceItem[] =
    selectedService?.items?.map((apiItem) => {
      const withQty = serviceItems.find((s) => s.id === apiItem.id);
      return {
        id: apiItem.id,
        description: `${apiItem.name}`,
        unit: apiItem.unit,
        price: apiItem.price_per_unit,
        quantity: withQty?.quantity ?? 0,
      };
    }) ?? serviceItems;

  /**
   * Save all items to localStorage whenever serviceItems change (only after mount)
   * Scoped by serviceId so each service has its own "memory"
   */
  useEffect(() => {
    if (!isMounted || !router.isReady) return;

    const { serviceId } = router.query;
    const allItemsKey = getServiceScopedKey(
      ALL_ITEMS_STORAGE_KEY,
      serviceId,
      user?.auth_user_id,
    );

    saveToLocalStorage(allItemsKey, serviceItems);
  }, [serviceItems, isMounted, router.isReady, router.query.serviceId, user?.auth_user_id]);

  /**
   * Updates the quantity of a specific service item
   * @param id - Service item ID
   * @param change - Amount to change (positive or negative)
   */
  const updateQuantity = (id: number, change: number) => {
    setServiceItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
    );
  };

  /**
   * Calculate total price from all selected items (from display list)
   */
  const total = displayItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /**
   * Check if user has selected at least one item
   */
  const hasItems = total > 0;

  /**
   * Navigate to next step (service information page)
   * Only proceeds if at least one item is selected
   */
  const handleNext = () => {
    if (hasItems) {
      const selectedItems = displayItems.filter((item) => item.quantity > 0);
      router.push({
        pathname: "/servicedetailPage/service-information",
        query: {
          items: JSON.stringify(selectedItems),
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

  return (
    <div className="min-h-screen bg-utility-bg font-prompt pb-32">
      <Navbar />
      <ServiceHero
        serviceName={selectedService?.name ?? ""}
        currentStep={1}
        imageUrl={selectedService?.image}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-6 lg:gap-8">
          <ServiceItemsSection
            items={displayItems}
            onChangeQuantity={updateQuantity}
            serviceName={selectedService?.name}
          />
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ServiceSummaryCard items={displayItems} total={total} />
          </div>
        </div>
      </main>

      <ServiceFooterNav 
        canProceed={hasItems} 
        onBack={handleBack}
        onNext={handleNext}
      />
    </div>
  );
}
