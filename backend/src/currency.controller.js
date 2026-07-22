const {
  BadRequestException,
  Controller,
  Get,
  Query,
} = require("@nestjs/common");
const { CurrencyService } = require("./currency.service");
const { validateConversionInput } = require("./currency-validation");
class CurrencyController {
  constructor(currencyService) {
    this.currencyService = currencyService;
  }
  currencies() {
    return this.currencyService.getCurrencies();
  }
  convert(query) {
    const { amount, from, to, date } = query;
    const validationMessage = validateConversionInput({
      amount,
      from,
      to,
      date,
    });
    if (validationMessage) throw new BadRequestException(validationMessage);
    return this.currencyService.convert({ amount, from, to, date });
  }
}
Controller("currencies")(CurrencyController);
Reflect.defineMetadata(
  "design:paramtypes",
  [CurrencyService],
  CurrencyController,
);
Get()(
  CurrencyController.prototype,
  "currencies",
  Object.getOwnPropertyDescriptor(CurrencyController.prototype, "currencies"),
);
Get("convert")(
  CurrencyController.prototype,
  "convert",
  Object.getOwnPropertyDescriptor(CurrencyController.prototype, "convert"),
);
Query()(CurrencyController.prototype, "convert", 0);
module.exports = { CurrencyController };
