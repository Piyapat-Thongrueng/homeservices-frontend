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
import Navbar from "@/components/common/Navbar";
import ServiceHero from "@/components/servicedetail/ServiceHero";
import ServiceItemsSection from "@/components/servicedetail/ServiceItemsSection";
import ServiceSummaryCard from "@/components/servicedetail/ServiceSummaryCard";
import ServiceFooterNav from "@/components/servicedetail/ServiceFooterNav";
import type { ServiceItem } from "@/components/servicedetail/types";
import {
  DEFAULT_SERVICE_ITEMS,
  ALL_ITEMS_STORAGE_KEY,
} from "@/constants/service-constants";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage-helpers";

export default function ServiceDetails() {
  const router = useRouter();
  
  /**
   * Initialize service items with defaults to prevent hydration mismatch
   * Will be updated from localStorage on client side after mount
   */
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>(DEFAULT_SERVICE_ITEMS);
  const [isMounted, setIsMounted] = useState(false);

  /**
   * Load service items from localStorage on client side only (after mount)
   * This prevents hydration mismatch between server and client
   */
  useEffect(() => {
    setIsMounted(true);
    const savedItems = getFromLocalStorage<ServiceItem[]>(ALL_ITEMS_STORAGE_KEY);
    if (savedItems) {
      // Merge with default items to ensure all items are present
      const mergedItems = DEFAULT_SERVICE_ITEMS.map((defaultItem) => {
        const savedItem = savedItems.find((item) => item.id === defaultItem.id);
        return savedItem
          ? { ...defaultItem, quantity: savedItem.quantity }
          : defaultItem;
      });
      setServiceItems(mergedItems);
    }
  }, []);

  /**
   * Save all items to localStorage whenever serviceItems change (only after mount)
   */
  useEffect(() => {
    if (isMounted) {
      saveToLocalStorage(ALL_ITEMS_STORAGE_KEY, serviceItems);
    }
  }, [serviceItems, isMounted]);

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
   * Calculate total price from all selected items
   */
  const total = serviceItems.reduce(
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
      // Filter to only selected items (quantity > 0)
      const selectedItems = serviceItems.filter((item) => item.quantity > 0);
      router.push({
        pathname: "/servicedetailPage/service-information",
        query: { items: JSON.stringify(selectedItems) },
      });
    }
  };

  return (
    <div className="min-h-screen bg-utility-bg font-prompt pb-32">
      <Navbar />
      <ServiceHero serviceName="ล้างแอร์" currentStep={1} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-6 lg:gap-8">
          <ServiceItemsSection
            items={serviceItems}
            onChangeQuantity={updateQuantity}
          />

          <div className="lg:sticky lg:top-24 lg:self-start">
            <ServiceSummaryCard items={serviceItems} total={total} />
          </div>
        </div>
      </main>

      <ServiceFooterNav 
        canProceed={hasItems} 
        onNext={handleNext}
      />
    </div>
  );
}
