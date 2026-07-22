const test = require("node:test");
const assert = require("node:assert/strict");
const {
  isValidCurrencyCode,
  validateConversionInput,
} = require("../src/currency-validation");

test("accepts valid ISO currency codes", () => {
  assert.equal(isValidCurrencyCode("USD"), true);
  assert.equal(isValidCurrencyCode("GBP"), true);
});

test("rejects invalid currency codes", () => {
  assert.equal(isValidCurrencyCode("usd"), false);
  assert.equal(isValidCurrencyCode("US"), false);
});

test("accepts a valid conversion request", () => {
  const errorMessage = validateConversionInput({
    amount: "1",
    from: "USD",
    to: "GBP",
    date: "2026-07-01",
  });
  assert.equal(errorMessage, null);
});

test("rejects a conversion request with an invalid amount", () => {
  const errorMessage = validateConversionInput({
    amount: "0",
    from: "USD",
    to: "GBP",
  });
  assert.equal(errorMessage, "Provide an amount greater than zero.");
});
