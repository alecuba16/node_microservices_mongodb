import { Application } from "express";
import express from "express";
import { setupDocumentRoutes } from "./controllers/DocumentController";
import { DocumentRepository } from "./repositories/DocumentRepository";
import { DocumentMongoRepository } from "./repositories/DocumentMongoRepository";
const bodyParser = require("body-parser");

const app: Application = express();
const port = 3002;

console.log("Launching in " + (process.env.PROD ? "production" : "dev") + " mode");

var mongoosePromise: DocumentRepository = new DocumentMongoRepository();
mongoosePromise
  .connect()
  .then((dbCon: DocumentRepository) => {
    // Body parsing Middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    setupDocumentRoutes(app, dbCon);

    app.listen(port, (): void => {
      console.log(`Connected successfully on port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error(`Error occured: ${error.message}`);
  });
