import { activeStations, dailyTrains } from "./daily-trains";
import { downloadSchedule } from "./download-schedule";

const cli = {
  "--download-schedule": downloadSchedule,
  "--daily-trains": dailyTrains,
  "--active-stations": activeStations,
};

init();

function helpMessage(): void {
  console.log(`Available commands:
    ${Object.keys(cli).join(`\n`)}
  `);
}

function init(): void {
  const [userCommand] = process.argv.slice(2);
  if (userCommand === undefined) {
    helpMessage();
    process.exit(0);
  } else if (cli[userCommand] === undefined) {
    console.log(`Invalid command "${userCommand}"`);
    helpMessage();
    process.exit(0);
  }
  (async () => {
    console.log(`Command ${userCommand}\n`);
    await cli[userCommand].call();
    console.log(`\nDone\n`);
    process.exit(0);
  })();
}
