import * as chalk from "chalk";
import * as express from "express";
import { PORT } from "./base-config";
import { getRouter } from "./routes/get";

const app = express();
app.use(`/get`, getRouter);

app.listen(PORT, () => console.log(chalk.green(`Server listen on port ${PORT}`)));
