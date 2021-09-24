import { ObjectId } from "mongodb";
import { Docfile } from "../models/Docfile";

export interface DocumentRepository {
  connect(): Promise<DocumentRepository | Error>;
  disconnect(): Promise<any>;
  findById(documentId: string): Promise<Docfile | Error>;
  findOneByUserId(userId: number): Promise<Docfile | Error>;
  findByUserId(userId: number): Promise<Docfile[] | Error>;
  insert(userId: number, document: Docfile): Promise<string | Error>;
  deleteByUserId(userId: number): Promise<number | Error>;
  deleteByUserIdAndDocumentId(userId: number, documentId: string): Promise<boolean | Error>;
}
