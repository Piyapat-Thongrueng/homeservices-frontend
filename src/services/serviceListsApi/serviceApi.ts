import axios from "axios";
import {
  Category,
  Service,
  ServiceFilterParams,
} from "../../types/serviceListTypes/type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ดึง categories ทั้งหมด
export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get<Category[]>(`${API_URL}/api/categories`);
  return data;
};

// ดึง services พร้อม filter/sort params
export const fetchServices = async (
  params: ServiceFilterParams,
): Promise<Service[]> => {
  // ลบ key ที่เป็น undefined / null ออกก่อนส่ง
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  );

  const { data } = await axios.get<Service[]>(`${API_URL}/api/services`, {
    params: cleanParams,
  });

  return data;
};
