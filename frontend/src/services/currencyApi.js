const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";
async function fetchFromApi(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  const responseData = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      responseData.message ||
        "The request could not be completed. Please try again.",
    );
  return responseData;
}
export function fetchSupportedCurrencies() {
  return fetchFromApi("/currencies");
}
export function requestCurrencyConversion({ amount, from, to, date }) {
  const queryParameters = new URLSearchParams({ amount, from, to });
  if (date) queryParameters.set("date", date);
  return fetchFromApi(`/currencies/convert?${queryParameters}`);
}
