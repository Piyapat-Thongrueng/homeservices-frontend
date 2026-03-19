/**
 * LocationSelectors Component
 *
 * A component for selecting location information (Province, District, Sub-district)
 * with cascading dropdowns that reset dependent fields when parent changes.
 *
 * Features:
 * - Cascading dropdowns (Province -> District -> Sub-district)
 * - Auto-reset of dependent fields
 * - Disabled state for dependent fields when parent not selected
 */

import { ChevronDown } from "lucide-react";
import {
  getProvinces,
  getDistrictsByProvince,
  getSubDistrictsByDistrict,
} from "@/utils/thailand-locations";
import { useRouter } from "next/router";

interface LocationSelectorsProps {
  /** Selected province */
  province: string;
  /** Selected district */
  district: string;
  /** Selected sub-district */
  subDistrict: string;
  /** Disable all selectors (used when user selects a saved address) */
  disabled?: boolean;
  /** Callback when province changes */
  onProvinceChange: (province: string) => void;
  /** Callback when district changes */
  onDistrictChange: (district: string) => void;
  /** Callback when sub-district changes */
  onSubDistrictChange: (subDistrict: string) => void;
}

const LocationSelectors: React.FC<LocationSelectorsProps> = ({
  province,
  district,
  subDistrict,
  disabled = false,
  onProvinceChange,
  onDistrictChange,
  onSubDistrictChange,
}) => {
  const { locale } = useRouter();
  const isEn = locale === "en";
  // Get available options based on current selections
  const provinces = getProvinces();
  const districts = province ? getDistrictsByProvince(province) : [];
  const subDistricts =
    province && district ? getSubDistrictsByDistrict(province, district) : [];

  /**
   * Handles province change and resets dependent fields
   */
  const handleProvinceChange = (newProvince: string) => {
    onProvinceChange(newProvince);
    // Reset district and sub-district when province changes
    onDistrictChange("");
    onSubDistrictChange("");
  };

  /**
   * Handles district change and resets sub-district
   */
  const handleDistrictChange = (newDistrict: string) => {
    onDistrictChange(newDistrict);
    // Reset sub-district when district changes
    onSubDistrictChange("");
  };

  return (
    <>
      {/* Province Field - Full Width */}
      <div>
        <label className="block headline-5 text-gray-800 font-medium mb-2">
          {isEn ? "Province" : "จังหวัด"}<span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <select
            value={province}
            onChange={(e) => handleProvinceChange(e.target.value)}
            disabled={disabled}
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg headline-5 text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <option value="" className="text-gray-400">
              {isEn ? "Select Province" : "เลือกจังหวัด"}
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

      {/* District and Sub-district Fields - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* District Field */}
        <div>
          <label className="block headline-5 text-gray-800 font-medium mb-2">
            {isEn ? "District" : "เขต / อำเภอ"}<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              value={district}
              onChange={(e) => handleDistrictChange(e.target.value)}
              disabled={disabled || !province}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg headline-5 text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              <option value="" className="text-gray-400">
                {isEn ? "Select District" : "เลือกเขต / อำเภอ"}
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

        {/* Sub-district Field */}
        <div>
          <label className="block headline-5 text-gray-800 font-medium mb-2">
            {isEn ? "Sub-district" : "แขวง / ตำบล"}<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              value={subDistrict}
              onChange={(e) => onSubDistrictChange(e.target.value)}
              disabled={disabled || !district}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg headline-5 text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              <option value="" className="text-gray-400">
                {isEn ? "Select Sub-district" : "เลือกแขวง / ตำบล"}
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
      </div>
    </>
  );
};

export default LocationSelectors;
