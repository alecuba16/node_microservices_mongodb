const mongoose = require("mongoose");
import { Connection } from "mongoose";
import { Iuser } from "../models/Iuser";
import { MONGO_PASSWORD, MONGO_DB, MONGO_HOST, MONGO_PORT, MONGO_USER } from "../config/mongo_db";
import { AuthRepository } from "./AuthRepository";

export class AuthMongoRepository implements AuthRepository {
  private _connection: Connection;
  connect(): Promise<AuthRepository | Error> {
    var self = this;
    return new Promise((resolve, reject) => {
      var serverUri: string = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;
      mongoose.connect(serverUri);
      self._connection = mongoose.connection;
      self._connection.on("error", (error: any) => {
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

  disconnect(): Promise<any> {
    return this._connection.close();
  }
  findOneByUsername(username: string): Promise<Iuser | Error> {
    return new Promise((resolve, reject) => {
      this._connection
        .collection("users")
        .findOne({ username: username })
        .then((result: Iuser) => {
          return resolve(result);
        })
        .catch((err) => {
          return reject(new Error(err));
        });
    });
  }
}
