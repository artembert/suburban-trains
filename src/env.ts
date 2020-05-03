import * as dotenv from "dotenv";

dotenv.config();

export const ENV = {
  YANDEX_API_TOKEN: process.env.YANDEX_API_TOKEN,
  CUSTOM_DATE: process.env.CUSTOM_DATE,
};
