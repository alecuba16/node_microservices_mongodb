import { Application, Request, Response } from "express";
import { Docfile, DocfileDBModel } from "../models/Docfile";
const accessToken = require("./../config/access_token");
const { decodeSession } = require("./../middleware/jwt");
const { requestHeader } = require("./../middleware/authMiddleware");
import { v4 as uuidv4 } from "uuid";
import { DocumentRepository } from "../repositories/DocumentRepository";
import async from "async";
import { Schema } from "mongoose";
// import { stem } from "stemr";
// import sw from "stopword";
import Sentiment from "sentiment";

export const setupDocumentRoutes = (app: Application, dbCon: DocumentRepository) => {
  app.delete("/analyzeSentiment", (req: Request, res: Response) => {
    var jwtheader: string = requestHeader.toLowerCase();
    if (req.headers && jwtheader in req.headers) {
      const decodedSession = decodeSession(accessToken.accessTokenSecret, req.headers[jwtheader]);
      const userId: number = decodedSession.session.id;
      if (req.query == null || req.query == undefined || Object.keys(req.query).length === 0) {
        dbCon
          .deleteByUserId(userId)
          .then((numberOfDeleted: number) => {
            res.status(200).json({ success: true, msg: `Removed ${numberOfDeleted} documents` });
          })
          .catch((err: Error) => {
            res.status(500).json({ success: false, error: err });
          });
      } else {
        var documentId: string = req.query.id.toString();
        dbCon
          .deleteByUserIdAndDocumentId(userId, documentId)
          .then((deleted: boolean) => {
            if (deleted) {
              res.status(200).json({ success: true, msg: `Removed document Id ${documentId}` });
            } else {
              res.status(403).json({ success: true, msg: `Unable to delete document Id ${documentId} , problem with the permissions?` });
            }
          })
          .catch((err: Error) => {
            res.status(500).json({ success: false, error: err });
          });
      }
    }
  });

  app.get("/analyzeSentiment", (req: Request, res: Response) => {
    var jwtheader: string = requestHeader.toLowerCase();
    if (req.headers && jwtheader in req.headers) {
      const decodedSession = decodeSession(accessToken.accessTokenSecret, req.headers[jwtheader]);
      const userId: number = decodedSession.session.id;
      dbCon
        .findByUserId(userId)
        .then((documents: Docfile[]) => {
          if (documents.length > 0) {
            res.status(200).json({ success: true, documents: [documents] });
          } else {
            res.status(200).json({ success: true, documents: [] });
          }
        })
        .catch((error) => {
          res.status(500).json({ success: false, error: error });
        });
    } else {
      res.status(404).json({ success: false, error: new Error("Missing jwt token header") });
    }
  });
  function processDocument(documentId: string, callback: any) {
    dbCon
      .findById(documentId)
      .then((file: Docfile) => {
        return callback(null, file);
      })
      .catch((error) => {
        callback(error);
      });
  }

  app.post("/analyzeSentiment", (req: Request, res: Response) => {
    var jwtheader: string = requestHeader.toLowerCase();
    if (!req.headers || !(jwtheader in req.headers)) res.status(403).json({ success: false, error: "Missing jwt header" });
    const myuuid = uuidv4();
    const decodedSession = decodeSession(accessToken.accessTokenSecret, req.headers[jwtheader]);
    const userId: number = decodedSession.session.id;

    if (!("documents" in req.body) && req.body.documents != null && req.body.documents.length > 0)
      res.status(203).json({ success: false, error: "Missing the documents ids to be analyzed documents:[documentId1,documentId2..]" });
    const documentIds: string[] = req.body.documents;

    async
      .map(documentIds, processDocument)
      .then((docResults: Schema[]) => {
        if (docResults == null || docResults.length == 0) {
          return res.status(403).json({ success: true, error: "Asked for a documentId that doesn't exists" });
        }
        var results: any = [];
        docResults.forEach((docResult: any) => {
          const content: string = docResult.document.content;
          // var words: string[] = content.split(" ");
          // words = sw.removeStopwords(words);
          // words = words.map((word: string) => stem(word));

          var sentiment = new Sentiment();
          results.push({ documentId: docResult.document.id, sentiment: sentiment.analyze(content) });
        });
        return res.status(200).json({ success: true, results: results });
      })
      .catch((err) => {
        return res.status(500).json({ success: false, error: err });
      });
  });
};
