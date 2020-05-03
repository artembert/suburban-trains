import axios from "axios";
import { promises } from "fs";
import * as path from "path";
import { ENV } from "../../env";

const stationCodesFilePath = `../../../data/buffered-stations.json`;
const apiToken = ENV.YANDEX_API_TOKEN;
const requestEndPoint = `https://api.rasp.yandex.net/v3.0/schedule/`;
const destStationsListFilePath = `../../../data/stations/dist/stations-list.json`;
const commonDestStationsListFilePath = `../../../data/stations/dist/common-stations-list.json`;

init().then(() => console.log(`Done`));

async function init(): Promise<void> {
  if (apiToken === undefined) {
    console.error(`Api token required but is not defined!`);
    return;
  }
  const stationIdsList: string[] = JSON.parse(
    (await promises.readFile(path.join(__dirname, stationCodesFilePath))).toString(`utf8`),
  ) as string[];
  console.log(`IDs count: ${stationIdsList.length}`);
  const stationsList = [];

  for (const stationId of stationIdsList) {
    console.log(`Start processing ID ${stationId}`);
    try {
      const station = (
        await axios.get<Station>(requestEndPoint, {
          method: "get",
          params: {
            apikey: apiToken,
            station: stationId,
            transport_types: `suburban`,
            direction: `на Москву`,
          },
        })
      ).data;
      console.log(`End  processing ID ${stationId}: ${station.station.title}\n`);
      stationsList.push(station);
      await promises.appendFile(path.join(__dirname, destStationsListFilePath), toJson(station));
    } catch (e) {
      console.error(e);
    }
  }
  await promises.writeFile(path.join(__dirname, commonDestStationsListFilePath), toJson(stationsList));
  console.log(`Stations saved to ${commonDestStationsListFilePath}`);
}

export function toJson(object: any): string {
  return JSON.stringify(object, undefined, 2);
}

export interface Station {
  pagination: Pagination;
  schedule: Schedule[];
  schedule_direction: Direction;
  date: null;
  station: StationClass;
  directions: Direction[];
  interval_schedule: any[];
}

export interface Direction {
  code: string;
  title: string;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
}

export interface Schedule {
  except_days: null | string;
  arrival: string;
  direction: string;
  thread: Thread;
  is_fuzzy: boolean;
  days: string;
  stops: string;
  departure: string;
  terminal: null;
  platform: string;
}

export interface Thread {
  uid: string;
  title: string;
  number: string;
  short_title: string;
  carrier: Carrier;
  transport_type: string;
  vehicle: null;
  transport_subtype: TransportSubtype;
  express_type: null;
}

export interface Carrier {
  code: number;
  codes: Codes;
  title: string;
}

export interface Codes {
  icao: null;
  sirena: null;
  iata: null;
}

export interface TransportSubtype {
  color: string;
  code: string;
  title: string;
}

export interface StationClass {
  code: string;
  title: string;
  station_type: string;
  popular_title: string;
  short_title: null;
  transport_type: string;
  station_type_name: string;
  type: string;
}
