function isValidCurrencyCode(currencyCode) {
  return /^[A-Z]{3}$/.test(currencyCode || "");
}

function validateConversionInput({ amount, from, to, date }) {
  if (!amount || Number(amount) <= 0) {
    return "Provide an amount greater than zero.";
  }

  if (!isValidCurrencyCode(from) || !isValidCurrencyCode(to)) {
    return "Provide valid three-letter currency codes.";
  }

  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return "Date must use YYYY-MM-DD format.";
  }

  return null;
}

module.exports = { isValidCurrencyCode, validateConversionInput };
