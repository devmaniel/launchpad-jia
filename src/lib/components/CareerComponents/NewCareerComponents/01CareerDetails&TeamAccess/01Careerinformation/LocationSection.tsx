"use client";

import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import philippineCitiesAndProvinces from "../../../../../../../public/philippines-locations.json";
import { LocationProps } from "./types";

export default function LocationSection({
  country,
  setCountry,
  province,
  setProvince,
  city,
  setCity,
  provinceList,
  cityList,
  setCityList,
  onProvinceBlur,
  onCityBlur,
  errors,
}: LocationProps) {
  const handleProvinceChange = (selectedProvince: string) => {
    setProvince(selectedProvince);
    const provinceObj = provinceList.find((p) => p.name === selectedProvince);
    if (provinceObj) {
      const cities = philippineCitiesAndProvinces.cities.filter(
        (city) => city.province === provinceObj.key
      );
      setCityList(cities);
      if (cities.length > 0) {
        setCity(cities[0].name);
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span
        style={{
          fontWeight: 600,
          fontSize: 16,
          color: "#181D27",
          display: "block",
        }}
      >
        Location
      </span>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
        }}
      >
        <div>
          <span style={{ display: "block" }}>Country</span>
          <CustomDropdown
            onSelectSetting={(setting) => {
              setCountry(setting);
            }}
            screeningSetting={country}
            settingList={[{ name: "Philippines" }]}
            placeholder="Philippines"
            containerStyle={{ marginTop: 6 }}
          />
        </div>

        <div>
          <span style={{ display: "block" }}>State / Province</span>
          <CustomDropdown
            onSelectSetting={handleProvinceChange}
            screeningSetting={province}
            settingList={provinceList}
            placeholder="Choose state / province"
            containerStyle={{ marginTop: 6 }}
            hasError={errors?.province}
            onBlur={onProvinceBlur}
          />
          {errors?.province && (
            <span style={{ color: "#F04438", fontSize: "14px", marginTop: "6px", display: "block" }}>
              This is a required field.
            </span>
          )}
        </div>

        <div>
          <span style={{ display: "block" }}>City</span>
          <CustomDropdown
            onSelectSetting={(city) => {
              setCity(city);
            }}
            screeningSetting={city}
            settingList={cityList}
            placeholder="Choose city"
            containerStyle={{ marginTop: 6 }}
            hasError={errors?.city}
            onBlur={onCityBlur}
          />
          {errors?.city && (
            <span style={{ color: "#F04438", fontSize: "14px", marginTop: "6px", display: "block" }}>
              This is a required field.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
