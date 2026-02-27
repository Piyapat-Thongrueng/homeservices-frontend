import { useState, useEffect } from "react";
import Navbar from "@/components/common/Navbar";
import ServiceListFooterContent from "@/components/common/ServiceListFooterContent";
import Banner from "@/components/serviceListPage/Banner";
import SearchAndFilterBar from "@/components/serviceListPage/SearchAndFilterBar";
import HomeServices from "@/components/serviceCard/HomeServices";
import Footer from "@/components/common/Footer";
import { Service } from "@/types/serviceListTypes/type";
import { fetchServices } from "@/services/serviceListsApi/serviceApi";

const ServiceListPage = () => {
  const [serviceLists, setServiceLists] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  // โหลดข้อมูลทั้งหมดตอนเปิดหน้าครั้งแรก
  useEffect(() => {
    const loadInitialServices = async () => {
      setLoading(true);
      try {
        const data = await fetchServices({});
        setServiceLists(data);
      } catch (error) {
        console.error("Error loading initial services:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialServices();
  }, []);

  // เมื่อกด  category badge บนการ์ด → filter ตาม category_id
  const handleCategoryClick = async (
    categoryId: number,
    categoryNameTh: string,
  ) => {
    setLoading(true);
    try {
      const data = await fetchServices({ category_id: categoryId });
      setServiceLists(data);
    } catch (error) {
      console.error("Error filtering by category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <Banner />
      <SearchAndFilterBar onResults={setServiceLists} onLoading={setLoading} />
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500">กำลังค้นหาบริการ...</p>
        </div>
      ) : (
        <HomeServices
          serviceLists={serviceLists}
          mode="full"
          onCategoryClick={handleCategoryClick}
        />
      )}
      <ServiceListFooterContent />
      <Footer />
    </div>
  );
};

export default ServiceListPage;
