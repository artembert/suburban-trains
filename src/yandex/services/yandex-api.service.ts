import axios, { AxiosResponse } from "axios";
import { ENV } from "../../env";
import { TickerRequest } from "../../service/services/schedule.service";
import { Schedule } from "../../types/schedule";

export class YandexApiService {
  private apiToken: string;

  constructor() {
    this.apiToken = process.env[ENV.YANDEX_API_TOKEN];
  }

  public async getSchedule(params: TickerRequest): Promise<AxiosResponse<Schedule[]>> {
    return axios.get<Schedule[]>(this.endPoint, {
      method: "GET",
      params: params,
    });
  }

  private generateParsms(params: TickerRequest): YaRequestParams {}
}
