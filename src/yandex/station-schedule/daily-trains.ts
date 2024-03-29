import { promises } from "fs";
import * as path from "path";
import { filesPaths } from "../../shared/files-paths";
import { toCsvAsync } from "../../shared/to-csv";
import { Direction, Schedule, Station, toJson } from "./download-schedule";

const clockwiseDirections = new Map([
  [["на Воскресенск", "на Яганово"], "на Яганово"],
  [["на Александров", "на Дмитров"], "на Дмитров"],
  [["на Кубинку", "на Икшу"], "на Икшу"],
  [["на Бекасово", "на Кубинку"], "на Кубинку"],
  [["на Яганово", "на Детково"], "на Детково"],
  [["на Яганово", "на Кубинку"], "на Кубинку"],
]);

export async function dailyTrains(): Promise<void> {
  console.log(`START dailyTrains()`);
  const stationsList: Station[] = JSON.parse(
    (await promises.readFile(path.join(__dirname, filesPaths.stationsList))).toString(`utf8`),
  ) as Station[];

  const dailyTrainsByStationsList: TrainsPerDayByStation[] = stationsList.map(station => {
    if (station === undefined) {
      return undefined;
    }
    return {
      code: station.station.code,
      title: station.station.title,
      trainsPerDay: getDailyTrains(station.schedule, station.directions),
      totalTrainsCount: station.schedule.length,
    };
  });

  await promises.writeFile(path.join(__dirname, filesPaths.dailyTrainsByStations), toJson(dailyTrainsByStationsList));
  await promises.writeFile(
    path.join(__dirname, filesPaths.dailyTrainsByStationsCsv),
    await toCsvAsync(dailyTrainsByStationsList),
  );
  console.log(`Trains per day by stations list saved to
    - ${filesPaths.dailyTrainsByStations}
    - ${filesPaths.dailyTrainsByStationsCsv}`);
}

export async function activeStations(): Promise<void> {
  console.log(`START activeStations()`);
  const stationsList: TrainsPerDayByStation[] = JSON.parse(
    (await promises.readFile(path.join(__dirname, filesPaths.dailyTrainsByStations))).toString(`utf8`),
  ) as TrainsPerDayByStation[];

  const activeStationList: string[] = stationsList
    .filter(station => station.totalTrainsCount >= 100)
    .map(station => station.code);
  await promises.writeFile(path.join(__dirname, filesPaths.activeStations), toJson(activeStationList));
  console.log(`Active stations list saved to ${filesPaths.activeStations}`);
}

export async function getDirections(): Promise<void> {
  console.log(`START getDirections()`);
  const stationsList: Station[] = JSON.parse(
    (await promises.readFile(path.join(__dirname, filesPaths.stationsList))).toString(`utf8`),
  ) as Station[];
  const directionsList: [string, string][] = stationsList
    .map(station =>
      station.directions
        .map(direction => direction.title)
        .filter(direction => direction !== "прибытие" && direction !== "все направления")
        .sort(),
    )
    .filter(station => !station.includes("на Москву")) as [string, string][];
  const directionsMap = Array.from(new Map(directionsList));
  await promises.writeFile(path.join(__dirname, filesPaths.directionsList), toJson(directionsMap));
  console.log(`Directions list saved to ${filesPaths.directionsList}`);
}

function getDailyTrains(schedule: Schedule[], directionsList: Direction[]): number {
  if (directionsList.filter(direction => direction.code === "на Москву").length) {
    return schedule.filter(
      item => item.direction === "на Москву" && (item.days === "по будням" || item.days === "ежедневно"),
    ).length;
  } else {
    for (const [[direction1, direction2], value] of clockwiseDirections) {
      if (
        directionsList.filter(direction => direction.code === direction1).length &&
        directionsList.filter(direction => direction.code === direction2).length
      ) {
        return schedule.filter(
          item => item.direction === value && (item.days === "по будням" || item.days === "ежедневно"),
        ).length;
      }
    }
  }
}

interface TrainsPerDayByStation {
  code: string;
  title: string;
  trainsPerDay: number;
  totalTrainsCount: number;
}
