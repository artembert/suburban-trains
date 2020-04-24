import * as chalk from "chalk";
import { dataProviderService } from "../services/data-provider.service";
import { scheduleService } from "../services/schedule.service";
import { ExitCode, USER_ARGV_INDEX } from "./config";

const input = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = input;

(async () => {
  if (input.length === 0) {
    const station = `2000002`;
    try {
      const { data: schedule } = await scheduleService.getSchedule();
      try {
        await dataProviderService.saveSchedule(station, schedule);
      } catch (e) {
        console.error(chalk.red(`Failed to save schedule.\n`, e));
      }
    } catch (e) {
      console.error(chalk.red(`Failed to load schedule.\n`, e));
    }
    process.exit(ExitCode.SUCCESS);
  } else {
    console.error(chalk.red(`Unknown command: ${userCommand}`));
    process.exit(ExitCode.ERROR);
  }
})();
