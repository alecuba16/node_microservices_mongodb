"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDbConnection = void 0;
const mongoose = require("mongoose");
const mongo_db_1 = require("../config/mongo_db");
const mongoDbConnection = () => new Promise((resolve, reject) => {
    var serverUri = `mongodb://${mongo_db_1.MONGO_USER}:${mongo_db_1.MONGO_PASSWORD}@${mongo_db_1.MONGO_HOST}:${mongo_db_1.MONGO_PORT}/${mongo_db_1.MONGO_DB}`;
    mongoose.connect(serverUri);
    var db = mongoose.connection;
    db.on("error", (error) => {
        console.log(`Error connecting to database.`);
        reject(error);
    });
    db.once("open", () => {
        console.log(`Connexion to dabatase successfull.`);
        db.useDb("aplanet");
        resolve(db);
    });
});
exports.mongoDbConnection = mongoDbConnection;
//# sourceMappingURL=mongodb.js.map