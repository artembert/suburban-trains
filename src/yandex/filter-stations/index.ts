import { promises } from "fs";
import * as GeoJSON from "geojson";

const SRC_FILE_PATH = `data/moscow-region-stations.json`;
const DIST_FILE_PATH = `data/moscow-region-railway-stations.geojson`;
const jsonIndentSize = 2;
const stationType = `train`;

export interface RawDetails {
  title: string;
  codes: Codes;
  stations: Station[];
}

export interface Codes {
  yandex_code: string;
  esr_code: string;
}

export interface Station {
  direction: string;
  codes?: Codes;
  station_type: string;
  title: string;
  longitude: number;
  transport_type: string;
  latitude: number;
  esr_code?: string;
  ya_code?: string;
}

(async () => {
  const stations: RawDetails[] = JSON.parse((await promises.readFile(SRC_FILE_PATH)).toString(`utf8`));
  const railwayStations: Station[] = stations
    .map(rawDetails => rawDetails.stations.filter(station => station.transport_type === stationType))
    .flat()
    .map(station => ({
      esr_code: station.codes.esr_code,
      ya_code: station.codes.yandex_code,
      transport_type: station.transport_type,
      direction: station.direction,
      latitude: station.latitude,
      longitude: station.longitude,
      station_type: station.station_type,
      title: station.title,
    }));
  const geoJson = GeoJSON.parse(railwayStations, { Point: ["latitude", "longitude"] });
  await promises.writeFile(DIST_FILE_PATH, JSON.stringify(geoJson, undefined, jsonIndentSize));
})();
