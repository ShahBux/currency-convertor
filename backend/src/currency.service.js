const {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} = require("@nestjs/common");
const BASE_URL =
  process.env.CURRENCY_API_BASE_URL || "https://api.freecurrencyapi.com/v1";

class CurrencyService {
  async apiRequest(endpoint, parameters = {}) {
    if (!process.env.FREECURRENCY_API_KEY)
      throw new InternalServerErrorException(
        "The currency API key is not configured on the server.",
      );
    const url = new URL(`${BASE_URL}${endpoint}`);
    Object.entries(parameters).forEach(
      ([key, value]) => value && url.searchParams.set(key, value),
    );
    try {
      const response = await fetch(url, {
        headers: { apikey: process.env.FREECURRENCY_API_KEY },
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.message || "Currency provider rejected the request.",
        );
      return data.data;
    } catch (error) {
      throw new BadGatewayException(
        error.message || "Could not reach the currency provider.",
      );
    }
  }
  getCurrencies() {
    return this.apiRequest("/currencies");
  }
  async convert({ amount, from, to, date }) {
    const rates = await this.apiRequest(
      date ? `/historical?date=${date}` : "/latest",
      { base_currency: from, currencies: to },
    );
    const rateDate = date || Object.keys(rates)[0];
    const rate = Number(date ? rates[rateDate]?.[to] : rates[to]);
    if (!rate)
      throw new BadGatewayException(
        "A rate for this currency pair was not returned.",
      );
    return {
      amount: Number(amount),
      from,
      to,
      rate,
      convertedAmount: Number((Number(amount) * rate).toFixed(4)),
      rateDate,
    };
  }
}
Injectable()(CurrencyService);
module.exports = { CurrencyService };
