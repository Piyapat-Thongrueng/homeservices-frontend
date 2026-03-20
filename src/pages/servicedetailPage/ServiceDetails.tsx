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
import ServiceHero from "@/features/servicedetail/components/ServiceHero";
import ServiceItemsSection from "@/features/servicedetail/components/ServiceItemsSection";
import ServiceSummaryCard from "@/features/servicedetail/components/ServiceSummaryCard";
import ServiceFooterNav from "@/features/servicedetail/components/ServiceFooterNav";
import type { ServiceItem } from "@/features/servicedetail/types";
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
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ServiceDetails() {
  const router = useRouter();
  const { locale } = router;
  const { state } = useAuth();
  const user = state.user;

  const [selectedService, setSelectedService] = useState<ServiceDetailResponseApi | null>(null);
  
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (router.isReady) setIsMounted(true);
  }, [router.isReady]);

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
      const description = (locale === "en" ? apiItem.name_en : apiItem.name_th) || apiItem.name;
      const unit = (locale === "en" ? apiItem.unit_en : apiItem.unit_th) || apiItem.unit;
      return {
        id: apiItem.id,
        description,
        unit,
        price: apiItem.price_per_unit,
        quantity: saved?.quantity ?? 0,
      };
    });

    setServiceItems(mappedItems);
  }, [selectedService?.id, router.query.serviceId, user?.auth_user_id, locale]);

  const displayItems: ServiceItem[] =
    selectedService?.items?.map((apiItem) => {
      const withQty = serviceItems.find((s) => s.id === apiItem.id);
      const description = (locale === "en" ? apiItem.name_en : apiItem.name_th) || apiItem.name;
      const unit = (locale === "en" ? apiItem.unit_en : apiItem.unit_th) || apiItem.unit;
      return {
        id: apiItem.id,
        description,
        unit,
        price: apiItem.price_per_unit,
        quantity: withQty?.quantity ?? 0,
      };
    }) ?? serviceItems;

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

  const updateQuantity = (id: number, change: number) => {
    setServiceItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
    );
  };

  const total = displayItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const hasItems = total > 0;

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

  const handleBack = () => {
    router.back();
  };

  const serviceName = (locale === "en" ? selectedService?.name_en : selectedService?.name_th) || selectedService?.name || "";

  return (
    <div className="min-h-screen bg-utility-bg font-prompt pb-32">
      <Navbar />
      <ServiceHero
        serviceName={serviceName}
        currentStep={1}
        imageUrl={selectedService?.image}
      />

      <main className="max-w-6xl mx-auto px-4 md:px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-6 lg:gap-8">
          <ServiceItemsSection
            items={displayItems}
            onChangeQuantity={updateQuantity}
            serviceName={serviceName}
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

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
