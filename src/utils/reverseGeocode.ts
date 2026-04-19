/**
 * Reverse geocode: prefer backend (rate-limited, same User-Agent policy),
 * fallback to Nominatim when the server route is missing (e.g. old deploy) or fails.
 */

export interface ReverseGeocodeFields {
  address_line: string | null;
  subdistrict: string | null;
  district: string | null;
  province: string | null;
  postal_code: string | null;
  display_name: string | null;
}

let backendReverseUnavailable = false;

function stripThaiAdminPrefix(value: string, pattern: RegExp): string {
  return String(value ?? "").trim().replace(pattern, "").trim();
}

/** Same normalization as homeservices-server/utils/geocode.mjs */
export function normalizeReverseAddressResult(data: unknown): ReverseGeocodeFields {
  const d = data as {
    display_name?: string;
    address?: Record<string, unknown>;
  };
  const displayName =
    typeof d?.display_name === "string" ? d.display_name.trim() : "";
  const a =
    d?.address && typeof d.address === "object" ? d.address : ({} as Record<string, unknown>);
  const countryCode = String(a.country_code ?? "").toLowerCase();

  const streetAddress = [a.house_number, a.road, a.neighbourhood]
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean)
    .join(" ")
    .trim();
  const addressLine = streetAddress || displayName || null;

  if (countryCode === "th") {
    const city = String(a.city ?? "");
    const state = String(a.state ?? "");
    const bangkokRe = /กรุงเทพ|bangkok/i;
    const isBangkok =
      bangkokRe.test(city) ||
      bangkokRe.test(state) ||
      displayName.includes("กรุงเทพมหานคร");

    if (isBangkok) {
      let province = "";
      if (bangkokRe.test(city)) province = city.trim();
      else if (bangkokRe.test(state)) province = state.trim();
      else province = "กรุงเทพมหานคร";

      let district = stripThaiAdminPrefix(String(a.city_district ?? ""), /^เขต\s*/);
      if (!district) {
        const suburbForKhet = String(a.suburb ?? "").trim();
        if (/^เขต/.test(suburbForKhet)) {
          district = stripThaiAdminPrefix(suburbForKhet, /^เขต\s*/);
        }
      }
      if (!district) {
        const m = displayName.match(/เขต([^,，]+)/);
        if (m) district = m[1].trim();
      }

      const suburbRaw = String(a.suburb ?? "").trim();
      const suburbIsKhet = /^เขต/.test(suburbRaw);
      let subdistrict = "";
      if (suburbRaw && !suburbIsKhet) {
        subdistrict = stripThaiAdminPrefix(suburbRaw, /^แขวง\s*/);
      }
      if (!subdistrict) {
        const fallbackSub = String(a.quarter ?? a.neighbourhood ?? "").trim();
        subdistrict = stripThaiAdminPrefix(fallbackSub, /^แขวง\s*/);
      }
      if (!subdistrict) {
        const m = displayName.match(/แขวง([^,，]+)/);
        if (m) subdistrict = m[1].trim();
      }

      return {
        address_line: addressLine,
        subdistrict: subdistrict || null,
        district: district || null,
        province: province || null,
        postal_code: String(a.postcode ?? "").trim() || null,
        display_name: displayName || null,
      };
    }

    const provinceRaw = String(a.province ?? a.state ?? "").trim();
    const districtRaw = String(
      a.county ?? a.city_district ?? a.district ?? a.city ?? a.town ?? "",
    ).trim();
    const subRaw = String(
      a.municipality ??
        a.suburb ??
        a.city_district ??
        a.neighbourhood ??
        a.quarter ??
        a.village ??
        a.hamlet ??
        "",
    ).trim();
    let subdistrict =
      stripThaiAdminPrefix(subRaw, /^แขวง\s*|^ตำบล\s*/) || "";
    if (!subdistrict) {
      const m = displayName.match(/(?:ตำบล|แขวง)\s*([^,，]+)/);
      if (m) subdistrict = m[1].trim();
    }

    return {
      address_line: addressLine,
      subdistrict: subdistrict || null,
      district: stripThaiAdminPrefix(districtRaw, /^อำเภอ\s*|^เขต\s*/) || null,
      province: stripThaiAdminPrefix(provinceRaw, /^จังหวัด\s*/) || null,
      postal_code: String(a.postcode ?? "").trim() || null,
      display_name: displayName || null,
    };
  }

  return {
    address_line: addressLine,
    subdistrict: String(a.suburb ?? a.quarter ?? "").trim() || null,
    district: String(a.city ?? a.town ?? a.county ?? "").trim() || null,
    province: String(a.state ?? "").trim() || null,
    postal_code: String(a.postcode ?? "").trim() || null,
    display_name: displayName || null,
  };
}

async function fetchNominatimReverse(
  lat: number,
  lng: number,
): Promise<ReverseGeocodeFields | null> {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(lat),
    lon: String(lng),
    addressdetails: "1",
    zoom: "18",
    "accept-language": "th,en",
  });
  const url = `https://nominatim.openstreetmap.org/reverse?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Accept-Language": "th,en",
    },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as unknown;
  return normalizeReverseAddressResult(data);
}

/**
 * Try backend first; on 404/5xx or parse error, use Nominatim (browser).
 */
export async function reverseGeocodeWithFallback(
  apiBaseUrl: string,
  lat: number,
  lng: number,
): Promise<ReverseGeocodeFields | null> {
  const base = apiBaseUrl.replace(/\/$/, "");
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng) });
  if (!backendReverseUnavailable) {
    try {
      const res = await fetch(`${base}/api/geocode/reverse?${params.toString()}`);
      if (res.status === 404) {
        backendReverseUnavailable = true;
      } else if (res.ok) {
        const data = (await res.json()) as Partial<ReverseGeocodeFields>;
        if (
          data &&
          (data.address_line != null ||
            data.subdistrict != null ||
            data.district != null ||
            data.province != null ||
            data.postal_code != null ||
            data.display_name != null)
        ) {
          return {
            address_line: data.address_line ?? null,
            subdistrict: data.subdistrict ?? null,
            district: data.district ?? null,
            province: data.province ?? null,
            postal_code: data.postal_code ?? null,
            display_name: data.display_name ?? null,
          };
        }
      }
    } catch {
      // network / CORS — try fallback
    }
  }

  return fetchNominatimReverse(lat, lng);
}
