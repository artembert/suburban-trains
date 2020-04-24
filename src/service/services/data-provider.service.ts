import * as chalk from "chalk";
import { promises } from "fs";
import * as path from "path";
import { Schedule } from "../../types/schedule";
import { EXPORT_DATA_FOLDER_PATH, JSON_INDENT } from "../base-config";

class DataProviderService {
  public async saveSchedule(station: string, schedule: Schedule[]): Promise<void> {
    const dest = path.join(EXPORT_DATA_FOLDER_PATH, `${station}.json`);
    await promises.writeFile(dest, JSON.stringify(schedule, undefined, JSON_INDENT));
    console.info(chalk.green(`Schedule for station '${station}' saved to ${dest}`));
  }
}

export const dataProviderService = new DataProviderService();
