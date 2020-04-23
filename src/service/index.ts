import * as chalk from "chalk";
import * as express from "express";
import { PORT } from "./base-config";

const app = express();

app.listen(PORT, () => console.log(chalk.green(`Server listen on port ${PORT}`)));
