"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMongoRepository = void 0;
const mongoose = require("mongoose");
const mongo_db_1 = require("../config/mongo_db");
class AuthMongoRepository {
    connect() {
        var self = this;
        return new Promise((resolve, reject) => {
            var serverUri = `mongodb://${mongo_db_1.MONGO_USER}:${mongo_db_1.MONGO_PASSWORD}@${mongo_db_1.MONGO_HOST}:${mongo_db_1.MONGO_PORT}/${mongo_db_1.MONGO_DB}`;
            mongoose.connect(serverUri);
            self._connection = mongoose.connection;
            self._connection.on("error", (error) => {
                console.log(`Error connecting to database.`);
                reject(new Error(error));
            });
            self._connection.once("open", () => {
                console.log(`Connexion to dabatase successfull.`);
                self._connection.useDb("aplanet");
                resolve(self);
            });
        });
    }
    disconnect() {
        return this._connection.close();
    }
    findOneByUsername(username) {
        return new Promise((resolve, reject) => {
            this._connection
                .collection("users")
                .findOne({ username: username })
                .then((result) => {
                return resolve(result);
            })
                .catch((err) => {
                return reject(new Error(err));
            });
        });
    }
}
exports.AuthMongoRepository = AuthMongoRepository;
//# sourceMappingURL=AuthMongoRepository.js.map