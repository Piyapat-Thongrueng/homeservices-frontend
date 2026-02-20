import Navbar from "@/components/common/Navbar";
import ServiceListFooterContent from "@/components/common/ServiceListFooterContent";
import Banner from "@/components/serviceListPage/Banner";
import SearchAndFilterBar from "@/components/serviceListPage/SearchAndFilterBar";
import HomeServices from "@/components/serviceCard/HomeServices";
import { useState, useEffect } from "react";
import axsios from "axios";

interface serviceListProps {
  id: number;
  name: string;
  description: string;
  price: number;
  category_name: string;
  image: string;
}

const ServiceListPage = () => {
  const [serviceLists, setServiceLists] = useState<serviceListProps[]>([]);

  // Fetch service lists from the API
  const fetchServiceLists = async () => {
    try {
      const response = await axsios.get("http://localhost:4000/api/services");
      console.log("Fetched service lists:", response.data);
      setServiceLists(response.data);
    } catch (error) {
      console.error("Error fetching service lists:", error);
    }
  };

  useEffect(() => {
    fetchServiceLists();
  }, []);

  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <Banner />
      <SearchAndFilterBar/>
      <HomeServices serviceLists={serviceLists} />
      <ServiceListFooterContent />
    </div>
  );
};

export default ServiceListPage;
