import { promises } from "fs";
import * as path from "path";
import { busesFilesPaths } from "../../shared/files-paths";
import { toCsvAsync } from "../../shared/to-csv";
import { Schedule, Station, toJson } from "./download-schedule";

export async function dailyBuses(): Promise<void> {
  console.log(`START dailyBuses()`);
  const stopsList: Station[] = JSON.parse(
    `[${(await promises.readFile(path.join(__dirname, busesFilesPaths.busStopsList))).toString(`utf8`)}]`.replace(
      /}{/g,
      `},{`,
    ),
  ) as Station[];

  const busesPerDayByStations: BusesPerDayByStation[] = stopsList.map(station => {
    if (station === undefined) {
      return undefined;
    }
    return {
      code: station.station.code,
      title: station.station.title,
      busesPerDay: getDailyBuses(station.schedule),
      totalBusesCount: station.schedule.length,
    };
  });

  await promises.writeFile(path.join(__dirname, busesFilesPaths.dailyBusesByStops), toJson(busesPerDayByStations));
  await promises.writeFile(
    path.join(__dirname, busesFilesPaths.dailyBusesByStopsCsv),
    await toCsvAsync(busesPerDayByStations),
  );
  console.log(`Buses per day by stops saved to
    - ${busesFilesPaths.dailyBusesByStops}
    - ${busesFilesPaths.dailyBusesByStopsCsv}`);
}

function getDailyBuses(schedule: Schedule[]): number {
  return schedule.filter(item => item.days === "по будням" || item.days === "ежедневно").length;
}

interface BusesPerDayByStation {
  code: string;
  title: string;
  busesPerDay: number;
  totalBusesCount: number;
}
