"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes/routes");
const AuthMongoRepository_1 = require("./repositories/AuthMongoRepository");
const app = (0, express_1.default)();
const port = 3000;
console.log("Launching ApiGateway microservice in " + (process.env.PROD ? "production" : "dev") + " mode");
var mongoosePromise = new AuthMongoRepository_1.AuthMongoRepository();
mongoosePromise
    .connect()
    .then((dbCon) => {
    (0, routes_1.setupRoutes)(app, routes_1.routes, dbCon);
    app.listen(port, () => {
        console.log(`Connected successfully on port ${port}`);
    });
})
    .catch((error) => {
    console.error(`Error occured: ${error.message}`);
});
//# sourceMappingURL=server.js.map