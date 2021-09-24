import { Application } from "express";
import express from "express";
import { routes, setupRoutes } from "./routes/routes";
import { AuthMongoRepository } from "./repositories/AuthMongoRepository";
import { AuthRepository } from "./repositories/AuthRepository";

const app: Application = express();
const port = 3000;

console.log("Launching ApiGateway microservice in " + (process.env.PROD ? "production" : "dev") + " mode");

var mongoosePromise: AuthRepository = new AuthMongoRepository();
mongoosePromise
  .connect()
  .then((dbCon: AuthRepository) => {
    setupRoutes(app, routes, dbCon);

    app.listen(port, (): void => {
      console.log(`Connected successfully on port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error(`Error occured: ${error.message}`);
  });
