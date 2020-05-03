import { promises } from "fs";
import * as path from "path";
import { Schedule, Station, toJson } from "./download-schedule";

const commonDestStationsListFilePath = `../../../data/stations/dist/common-stations-list.json`;
const dailyTrainsByStationsListFilePath = `../../../data/stations/dist/daily-trains-stations-list.json`;

export async function dailyTrains(): Promise<void> {
  console.log(`START dailyTrains()`);
  const stationsList: Station[] = JSON.parse(
    (await promises.readFile(path.join(__dirname, commonDestStationsListFilePath))).toString(`utf8`),
  ) as Station[];

  const dailyTrainsByStationsList: StrainsPerDayByStation[] = stationsList.map(station => {
    if (station === undefined) {
      return undefined;
    }
    return {
      code: station.station.code,
      title: station.station.title,
      trainsPerDay: getDailyTrains(station.schedule),
      anotherTrains: station.schedule.length,
    };
  });

  await promises.writeFile(path.join(__dirname, dailyTrainsByStationsListFilePath), toJson(dailyTrainsByStationsList));
  console.log(`Trains per day by stations list saved to ${dailyTrainsByStationsListFilePath}`);
}

function getDailyTrains(schedule: Schedule[]): number {
  return schedule.filter(item => item.days === "по будням" || item.days === "ежедневно").length;
}

interface StrainsPerDayByStation {
  code: string;
  title: string;
  trainsPerDay: number;
  anotherTrains: number;
}
