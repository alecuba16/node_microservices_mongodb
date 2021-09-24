import { Model, Schema, model } from "mongoose";

export const DocfileSchema: Schema = new Schema({
  id: { type: String, required: true },
  docname: { type: String, required: true },
  type: { type: String, required: true },
  userId: { type: Number, required: true },
  processed: { type: Boolean, required: true },
  analyzed: { type: Boolean, required: true },
  content: { type: String, required: true },
});

export const DocfileDBModel: Model<Docfile> = model("Docfile", DocfileSchema);

export abstract class Docfile {
  private _id: string;
  private _docname: string;
  private _type: string;
  private _userId: number;
  private _processed: boolean;
  private _analyzed: boolean;
  private _content: string;

  /**
   * Creates an instance of Document.
   * @param Docfile object (e.g. dto) to initialize the model, including:
   */
  constructor(id: string, docname: string, type: string, userId: number) {
    this._id = id;
    this._docname = docname;
    this._userId = userId;
    this._type = type;
    this._processed = false;
    this._analyzed = false;
    this._content = "";
  }

  abstract contentFromText(text: string): Promise<any>;

  /**
   * Getter id
   * @return {number}
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Setter id
   * @param {number} value
   */
  public set id(value: string) {
    this._id = value;
  }

  /**
   * Getter docname
   * @return {string}
   */
  public get docname(): string {
    return this._docname;
  }

  /**
   * Setter docname
   * @param {string} value
   */
  public set docname(value: string) {
    this._docname = value;
  }

  /**
   * Getter type
   * @return {string}
   */
  public get type(): string {
    return this._type;
  }

  /**
   * Setter type
   * @param {string} value
   */
  public set type(value: string) {
    this._type = value;
  }

  /**
   * Getter userId
   * @return {number}
   */
  public get userId(): number {
    return this._userId;
  }

  /**
   * Setter userId
   * @param {number} value
   */
  public set userId(value: number) {
    this._userId = value;
  }

  /**
   * Getter processed
   * @return {boolean}
   */
  public get processed(): boolean {
    return this._processed;
  }

  /**
   * Setter processed
   * @param {boolean} value
   */
  public set processed(value: boolean) {
    this._processed = value;
  }

  /**
   * Getter analyzed
   * @return {boolean}
   */
  public get analyzed(): boolean {
    return this._analyzed;
  }

  /**
   * Setter analyzed
   * @param {boolean} value
   */
  public set analyzed(value: boolean) {
    this._analyzed = value;
  }

  /**
   * Getter content
   * @return {string}
   */
  public get content(): string {
    return this._content;
  }

  /**
   * Setter content
   * @param {string} value
   */
  public set content(value: string) {
    this._content = value;
  }
}
