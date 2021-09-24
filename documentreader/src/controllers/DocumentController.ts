import { Application, Request, Response } from "express";
import { DocfileTxt } from "../models/Docfiletxt";
import { Docfile } from "../models/Docfile";
const accessToken = require("./../config/access_token");
const { decodeSession } = require("./../middleware/jwt");
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";
import { Docfilepdf } from "../models/Docfilepdf";
import { DocumentRepository } from "../repositories/DocumentRepository";
const { requestHeader } = require("./../middleware/authMiddleware");

export const setupDocumentRoutes = (app: Application, dbCon: DocumentRepository) => {
  app.delete("/document", (req: Request, res: Response) => {
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

  app.get("/document", (req: Request, res: Response) => {
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

  app.post("/document", (req: Request, res: Response) => {
    var jwtheader: string = requestHeader.toLowerCase();
    if (!req.headers || !(jwtheader in req.headers)) res.status(403).json({ success: false, error: "Missing jwt header" });
    if (!("fileType" in req.body) || !("fileName" in req.body)) return res.status(400).json({ success: false, error: "Missing fileType:txt  / fileType:pdf header" });

    const myuuid = uuidv4();
    const decodedSession = decodeSession(accessToken.accessTokenSecret, req.headers[jwtheader]);
    const userId: number = decodedSession.session.id;
    var document: Docfile;
    const fileType: string = req.body["fileType"].toString();
    const fileName: string = req.body["fileName"].toString();
    const req2: any = req;

    if (fileType == "txt") {
      document = new DocfileTxt(myuuid, fileName, userId);
      document.contentFromText(req2.files.file.data).then((ok) => {
        if (!ok) return res.status(403).json({ success: false, error: `Problem converting the file to text` });
        dbCon
          .insert(userId, document)
          .then((documentId: string) => {
            return res.status(200).json({ success: true, documentId: documentId });
          })
          .catch((err: Error) => {
            return res.status(500).json({ success: true, error: err });
          });
      });
    } else if (fileType == "pdf") {
      document = new Docfilepdf(myuuid, fileName, userId);
      document.contentFromText(req2.files.file.data).then((ok) => {
        if (!ok) return res.status(403).json({ success: false, error: `Problem converting the file to text` });
        dbCon
          .insert(userId, document)
          .then((documentId: string) => {
            return res.status(200).json({ success: true, documentId: documentId });
          })
          .catch((err: Error) => {
            return res.status(500).json({ success: true, error: err });
          });
      });
    } else {
      return res.status(403).json({ success: false, error: `fileType ${fileType} not implemented` });
    }
  });
};
