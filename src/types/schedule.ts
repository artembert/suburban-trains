export interface Schedule {
  cost: number;
  trainNumber: string;
  startTime: string;
  startStationId: number;
  startStationName: string;
  startStationLatinName: string;
  finishTime: string;
  finishStationId: number;
  finishStationName: string;
  finishStationLatinName: string;
  departureStationId: number;
  departureStationName: string;
  departureStationLatinName: string;
  departureStationHasWicket: boolean;
  arrivalStationId: number;
  arrivalStationName: string;
  arrivalStationLatinName: string;
  arrivalStationHasWicket: boolean;
  defaultDirection: boolean;
  departureTime: string;
  arrivalTime: string;
  scheduleId: number;
  motionMode: string;
  trainCategoryId: number;
  rzdTrainCategoryId: number;
}
