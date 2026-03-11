// Thailand provinces, districts, sub-districts, and postal codes

// Helper functions now backed by thai-address-database (flattened DB)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rawDb = require("thai-address-database/database/db.json") as any;

type ThaiAddressEntry = {
  district: string; // ตำบล / แขวง
  amphoe: string; // อำเภอ / เขต
  province: string; // จังหวัด
  zipcode: string;
};

// Decompact the database (adapted from thai-address-database/lib/index.js)
function preprocessThaiAddressDatabase(data: any): ThaiAddressEntry[] {
  let lookup: string[] = [];
  let words: string[] = [];
  const expanded: ThaiAddressEntry[] = [];
  let useLookup = false;

  if (data.lookup && data.words) {
    useLookup = true;
    lookup = String(data.lookup).split("|");
    words = String(data.words).split("|");
    data = data.data;
  }

  const t = (text: any): string => {
    function repl(m: string) {
      const ch = m.charCodeAt(0);
      return words[ch < 97 ? ch - 65 : 26 + ch - 97];
    }
    if (!useLookup) return String(text);
    if (typeof text === "number") {
      text = lookup[text];
    }
    return String(text).replace(/[A-Z]/gi, repl);
  };

  if (!Array.isArray(data) || !data[0]?.length) {
    return data as ThaiAddressEntry[];
  }

  data.forEach((provinces: any[]) => {
    let i = 1;
    if (provinces.length === 3) {
      // geographic database
      i = 2;
    }
    provinces[i].forEach((amphoes: any[]) => {
      amphoes[i].forEach((districts: any[]) => {
        districts[i] = Array.isArray(districts[i])
          ? districts[i]
          : [districts[i]];
        districts[i].forEach((zipcode: string) => {
          const entry: ThaiAddressEntry = {
            district: t(districts[0]),
            amphoe: t(amphoes[0]),
            province: t(provinces[0]),
            zipcode,
          };
          expanded.push(entry);
        });
      });
    });
  });

  return expanded;
}

const thaiDb: ThaiAddressEntry[] = preprocessThaiAddressDatabase(rawDb);

const thaiSort = (a: string, b: string) => a.localeCompare(b, "th");

export const getProvinces = () => {
  return Array.from(new Set(thaiDb.map((e) => e.province))).sort(thaiSort);
};

export const getDistrictsByProvince = (provinceName: string) => {
  if (!provinceName) return [];
  const amphoes = thaiDb
    .filter((e) => e.province === provinceName)
    .map((e) => e.amphoe);
  return Array.from(new Set(amphoes)).sort(thaiSort);
};

export const getSubDistrictsByDistrict = (
  provinceName: string,
  districtName: string,
) => {
  if (!provinceName || !districtName) return [];
  const districts = thaiDb
    .filter((e) => e.province === provinceName && e.amphoe === districtName)
    .map((e) => e.district);
  return Array.from(new Set(districts)).sort(thaiSort);
};

export const getPostalCodeForLocation = (
  provinceName: string,
  districtName: string,
  subDistrictName: string,
): string | null => {
  if (!provinceName || !districtName) return null;
  const entry = thaiDb.find(
    (e) =>
      e.province === provinceName &&
      e.amphoe === districtName &&
      (!subDistrictName || e.district === subDistrictName),
  );
  return entry?.zipcode ?? null;
};
