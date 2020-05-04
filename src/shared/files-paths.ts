import { appStartDate } from "./format-date";

export const filesPaths = {
  stationCodes: `../../../data/buffered-stations.json`,
  partialStationsList: `../../../data/stations/dist/stations-list-${appStartDate}.json`,
  stationsList: `../../../data/stations/dist/common-stations-list-${appStartDate}.json`,
  directionsList: `../../../data/stations/dist/directions-list-${appStartDate}.json`,
  activeStations: `../../../data/stations/dist/active-stations-list-${appStartDate}.json`,
  dailyTrainsByStations: `../../../data/stations/dist/daily-trains-stations-list-${appStartDate}.json`,
  dailyTrainsByStationsCsv: `../../../data/stations/dist/daily-trains-stations-list-${appStartDate}.csv`,
};
