import { useEffect, useMemo, useState } from "react";
import { useCurrencies } from "../hooks/useCurrencies";
import { requestCurrencyConversion } from "../services/currencyApi";
import "./pages.css";

const TODAY = new Date().toISOString().slice(0, 10);

function formatCurrencyAmount(value) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(
    value,
  );
}

function ConverterPage({ onConversionComplete }) {
  const {
    currencies,
    isLoading,
    errorMessage: currencyError,
  } = useCurrencies();
  const [conversionForm, setConversionForm] = useState({
    amount: "1",
    from: "USD",
    to: "",
    date: "",
  });

  useEffect(() => {
    if (currencies.length === 0) return;
    const availableCodes = new Set(currencies.map((currency) => currency.code));

    setConversionForm((currentForm) => {
      const resolvedFrom = availableCodes.has(currentForm.from)
        ? currentForm.from
        : currencies[0].code;
      const resolvedTo =
        availableCodes.has(currentForm.to) && currentForm.to !== resolvedFrom
          ? currentForm.to
          : currencies.find((currency) => currency.code !== resolvedFrom)
              ?.code || currencies[0].code;

      return { ...currentForm, from: resolvedFrom, to: resolvedTo };
    });
  }, [currencies]);
  const [conversionResult, setConversionResult] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedCurrencyName = useMemo(() => {
    return (
      currencies.find((currency) => currency.code === conversionForm.from)
        ?.name || conversionForm.from
    );
  }, [currencies, conversionForm.from]);

  function handleFieldChange(event) {
    setConversionForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  }

  function handleCurrencySwap() {
    setConversionForm((currentForm) => ({
      ...currentForm,
      from: currentForm.to,
      to: currentForm.from,
    }));
  }

  async function handleConversionSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setConversionResult(null);

    if (Number(conversionForm.amount) <= 0) {
      setErrorMessage("Enter an amount greater than zero.");
      return;
    }

    setIsConverting(true);
    try {
      const conversionData = await requestCurrencyConversion(conversionForm);
      const completedConversion = {
        id: crypto.randomUUID(),
        ...conversionForm,
        ...conversionData,
        createdAt: new Date().toISOString(),
      };
      setConversionResult(completedConversion);
      onConversionComplete(completedConversion);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <div className="converter-layout">
      <section className="intro">
        <span className="eyebrow">CURRENCY CONVERTER</span>
        <h1>Clear rates for everyday money decisions.</h1>
        <p>
          Compare currencies, use a past date when needed, and keep a private
          history on this device.
        </p>
      </section>

      <section className="converter-card">
        <div className="card-heading">
          <div>
            <h2>Convert currency</h2>
            <p>
              {conversionForm.date
                ? `Rate for ${conversionForm.date}`
                : "Latest available exchange rate"}
            </p>
          </div>
          <span className="live-dot">
            {conversionForm.date ? "Historical" : "Live"}
          </span>
        </div>

        {isLoading && (
          <div className="loading-block">
            <span className="spinner-border spinner-border-sm" /> Loading
            currencies...
          </div>
        )}
        {currencyError && <p className="error-message">{currencyError}</p>}

        {!isLoading && !currencyError && (
          <form onSubmit={handleConversionSubmit}>
            <label className="field-label" htmlFor="amount">
              Amount
            </label>
            <div className="amount-input">
              <input
                id="amount"
                name="amount"
                value={conversionForm.amount}
                onChange={handleFieldChange}
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
              />
              <span>{conversionForm.from}</span>
            </div>
            <div className="currency-fields">
              <label>
                <span className="field-label">From</span>
                <select
                  name="from"
                  value={conversionForm.from}
                  onChange={handleFieldChange}
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="swap-button"
                type="button"
                onClick={handleCurrencySwap}
              >
                Swap
              </button>
              <label>
                <span className="field-label">To</span>
                <select
                  name="to"
                  value={conversionForm.to}
                  onChange={handleFieldChange}
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="date-field">
              <span>
                <span className="field-label">Exchange rate date</span>
                <small>Leave blank for the latest rate</small>
              </span>
              <input
                type="date"
                name="date"
                max={TODAY}
                value={conversionForm.date}
                onChange={handleFieldChange}
              />
            </label>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="convert-button" disabled={isConverting}>
              {isConverting ? "Getting rate..." : "Convert currency"}
            </button>
          </form>
        )}

        {conversionResult && (
          <div className="result-card">
            <span>
              {formatCurrencyAmount(conversionResult.amount)}{" "}
              {conversionResult.from} equals
            </span>
            <strong>
              {formatCurrencyAmount(conversionResult.convertedAmount)}{" "}
              <small>{conversionResult.to}</small>
            </strong>
            <p>
              1 {conversionResult.from} ={" "}
              {formatCurrencyAmount(conversionResult.rate)}{" "}
              {conversionResult.to} on {conversionResult.rateDate}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default ConverterPage;
