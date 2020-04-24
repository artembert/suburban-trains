import * as chalk from "chalk";
import { scheduleService } from "../services/schedule.service";
import { ExitCode, USER_ARGV_INDEX } from "./config";

const cli = {
  requestSchedule: scheduleService.getSchedule,
};
const input = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = input;

(async () => {
  if (input.length === 0) {
    console.log(await cli.requestSchedule());
  } else if (!cli[userCommand]) {
    console.error(chalk.red(`Unknown command: ${userCommand}`));
    process.exit(ExitCode.ERROR);
  }
})();
