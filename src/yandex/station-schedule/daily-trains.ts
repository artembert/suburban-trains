import { promises } from "fs";
import * as path from "path";
import { appStartDate } from "../../shared/format-date";
import { Schedule, Station, toJson } from "./download-schedule";

const commonDestStationsListFilePath = `../../../data/stations/dist/common-stations-list-${appStartDate}.json`;
const dailyTrainsByStationsListFilePath = `../../../data/stations/dist/daily-trains-stations-list-${appStartDate}.json`;
const activeStationsListFilePath = `../../../data/stations/dist/active-stations-list-${appStartDate}.json`;

export async function dailyTrains(): Promise<void> {
  console.log(`START dailyTrains()`);
  const stationsList: Station[] = JSON.parse(
    (await promises.readFile(path.join(__dirname, commonDestStationsListFilePath))).toString(`utf8`),
  ) as Station[];

  const dailyTrainsByStationsList: TrainsPerDayByStation[] = stationsList.map(station => {
    if (station === undefined) {
      return undefined;
    }
    return {
      code: station.station.code,
      title: station.station.title,
      trainsPerDay: getDailyTrains(station.schedule),
      totalTrainsCount: station.schedule.length,
    };
  });

  await promises.writeFile(path.join(__dirname, dailyTrainsByStationsListFilePath), toJson(dailyTrainsByStationsList));
  console.log(`Trains per day by stations list saved to ${dailyTrainsByStationsListFilePath}`);
}

export async function activeStations(): Promise<void> {
  console.log(`START activeStations()`);
  const stationsList: TrainsPerDayByStation[] = JSON.parse(
    (await promises.readFile(path.join(__dirname, dailyTrainsByStationsListFilePath))).toString(`utf8`),
  ) as TrainsPerDayByStation[];

  const activeStationList: string[] = stationsList
    .filter(station => station.totalTrainsCount >= 100)
    .map(station => station.code);
  await promises.writeFile(path.join(__dirname, activeStationsListFilePath), toJson(activeStationList));
  console.log(`Active stations list saved to ${activeStationsListFilePath}`);
}

function getDailyTrains(schedule: Schedule[]): number {
  return schedule.filter(item => item.days === "по будням" || item.days === "ежедневно").length;
}

interface TrainsPerDayByStation {
  code: string;
  title: string;
  trainsPerDay: number;
  totalTrainsCount: number;
}
