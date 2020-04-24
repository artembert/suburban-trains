import axios from "axios";

export interface TickerRequest {
  date: string;
  fromStationId: number;
  toStationId: number;
}

const defaultQueryParams: TickerRequest = {
  date: `2020-01-17`,
  fromStationId: 2000002,
  toStationId: 2000175,
};

class ScheduleService {
  public static endPoint: string = `https://api.mobile-kassa.ru/v1.7/train-schedule/date-travel`;

  public async getSchedule(params?: TickerRequest): Promise<any> {
    console.log(ScheduleService.endPoint);
    return axios(ScheduleService.endPoint, {
      method: "GET",
      params: params ?? defaultQueryParams,
    });
  }
}

export const scheduleService = new ScheduleService();
