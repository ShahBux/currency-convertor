require("reflect-metadata");
require("dotenv").config();
const { NestFactory } = require("@nestjs/core");
const { Module } = require("@nestjs/common");
const { CurrencyController } = require("./currency.controller");
const { CurrencyService } = require("./currency.service");

class AppModule {}
Module({ controllers: [CurrencyController], providers: [CurrencyService] })(
  AppModule,
);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      "https://currency-convertor-nine-ivory.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  });
  app.setGlobalPrefix("api");
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
