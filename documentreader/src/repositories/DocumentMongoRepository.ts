const mongoose = require("mongoose");
import { Connection, model, Model } from "mongoose";
import { MONGO_PASSWORD, MONGO_DB, MONGO_HOST, MONGO_PORT, MONGO_USER } from "../config/mongo_db";
import { DocumentRepository } from "./DocumentRepository";
import { Docfile, DocfileSchema } from "../models/Docfile";
import { IDocfileSchema } from "../models/IdocfileSchema";
import { DeleteResult } from "mongodb";

export class DocumentMongoRepository implements DocumentRepository {
  private _connection: Connection;
  connect(): Promise<DocumentRepository | Error> {
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

  findById(documentId: string): Promise<Docfile | Error> {
    var self = this;
    return new Promise((resolve, reject) => {
      self._connection
        .collection("documents")
        .findOne({ "document.id": documentId })
        .then((result: Docfile) => {
          return resolve(result);
        })
        .catch((err) => {
          return reject(new Error(err));
        });
    });
  }
  findOneByUserId(userId: number): Promise<Docfile | Error> {
    var self = this;
    return new Promise((resolve, reject) => {
      self._connection
        .collection("documents")
        .findOne({ userId: userId })
        .then((result: Docfile) => {
          return resolve(result);
        })
        .catch((err) => {
          return reject(new Error(err));
        });
    });
  }

  findByUserId(userId: number): Promise<Docfile[] | Error> {
    var self = this;
    return new Promise((resolve, reject) => {
      self._connection
        .collection("documents")
        .find({ userId: userId })
        .toArray()
        .then((result: Docfile[]) => {
          return resolve(result);
        })
        .catch((err) => {
          return reject(new Error(err));
        });
    });
  }
  insert(userId: number, document: Docfile): Promise<string | Error> {
    var self = this;
    const Docfile: Model<Docfile> = model("Docfile", DocfileSchema);
    return new Promise((resolve, reject) => {
      return Docfile.create({
        id: document.id,
        docname: document.docname,
        type: document.type,
        userId: document.userId,
        processed: document.processed,
        analyzed: document.analyzed,
        content: document.content,
      }).then((doc) => {
        var documentToInsert: IDocfileSchema = {
          userId: userId,
          document: doc,
        };

        self._connection
          .collection("documents")
          .insertOne(documentToInsert)
          .then(() => resolve(documentToInsert.document.id))
          .catch((err) => {
            return reject(new Error(err));
          });
      });
    });
  }

  deleteByUserId(userId: number): Promise<number | Error> {
    var self = this;
    return new Promise((resolve, reject) => {
      self._connection
        .collection("documents")
        .deleteMany({ userId: userId })
        .then((res: DeleteResult) => {
          return resolve(res.deletedCount);
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  deleteByUserIdAndDocumentId(userId: number, documentId: string): Promise<boolean | Error> {
    var self = this;
    return new Promise((resolve, reject) => {
      self._connection
        .collection("documents")
        .deleteOne({ userId: userId, document: { id: documentId } })
        .then((res: DeleteResult) => {
          return resolve(res.acknowledged);
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }
}
