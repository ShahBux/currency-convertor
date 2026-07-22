import { useEffect, useState } from "react";
import { fetchSupportedCurrencies } from "../services/currencyApi";

const CURRENCY_CACHE_KEY = "flowconvert-currencies";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

function createCurrencyOptions(currencyData) {
  return Object.entries(currencyData)
    .map(([code, currency]) => ({
      code,
      name:
        typeof currency === "string"
          ? currency
          : typeof currency.name === "string"
            ? currency.name
            : code,
    }))
    .sort((firstCurrency, secondCurrency) =>
      firstCurrency.code.localeCompare(secondCurrency.code),
    );
}

function getCachedCurrencies() {
  try {
    const cache = JSON.parse(sessionStorage.getItem(CURRENCY_CACHE_KEY));

    if (cache && Date.now() - cache.savedAt < CACHE_DURATION) {
      return createCurrencyOptions(
        Object.fromEntries(
          cache.items.map((currency) => [currency.code, currency]),
        ),
      );
    }
  } catch {
    sessionStorage.removeItem(CURRENCY_CACHE_KEY);
  }

  return null;
}

export function useCurrencies() {
  const [currencies, setCurrencies] = useState(getCachedCurrencies);
  const [isLoading, setIsLoading] = useState(!currencies);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (currencies) return undefined;

    let isMounted = true;

    async function loadCurrencies() {
      try {
        const currencyData = await fetchSupportedCurrencies();
        const currencyOptions = createCurrencyOptions(currencyData);

        sessionStorage.setItem(
          CURRENCY_CACHE_KEY,
          JSON.stringify({ items: currencyOptions, savedAt: Date.now() }),
        );

        if (isMounted) setCurrencies(currencyOptions);
      } catch (error) {
        if (isMounted) setErrorMessage(error.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCurrencies();

    return () => {
      isMounted = false;
    };
  }, [currencies]);

  return { currencies: currencies || [], isLoading, errorMessage };
}
