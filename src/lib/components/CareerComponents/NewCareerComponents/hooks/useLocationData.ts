import { useState, useEffect } from "react";
import philippineCitiesAndProvinces from "../../../../../../public/philippines-locations.json";

/**
 * Hook to manage location data (provinces and cities)
 */
export function useLocationData(initialProvince?: string) {
  const [provinceList, setProvinceList] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);

  // Initialize province list
  useEffect(() => {
    setProvinceList(philippineCitiesAndProvinces.provinces);
    
    // Set initial cities if province is provided
    if (initialProvince) {
      const provinceObj = philippineCitiesAndProvinces.provinces.find(
        (p: any) => p.name === initialProvince
      );
      if (provinceObj) {
        const cities = philippineCitiesAndProvinces.cities.filter(
          (city: any) => city.province === provinceObj.key
        );
        setCityList(cities);
      }
    }
  }, [initialProvince]);

  /**
   * Update city list when province changes
   */
  const updateCityList = (province: string) => {
    const provinceObj = philippineCitiesAndProvinces.provinces.find((p: any) => p.name === province);
    if (provinceObj) {
      const cities = philippineCitiesAndProvinces.cities.filter((c: any) => c.province === provinceObj.key);
      setCityList(cities);
    } else {
      setCityList([]);
    }
  };

  return {
    provinceList,
    cityList,
    setCityList,
    updateCityList,
  };
}
