import { Docfile } from "./Docfile";
const pdf = require("pdf-parse");
export class Docfilepdf extends Docfile {
  async process(): Promise<Docfilepdf> {
    throw new Error("Method not implemented.");
  }
  constructor(id: string, docname: string, userId: number) {
    super(id, docname, "txt", userId);
  }

  contentFromText(text: any): Promise<any> {
    var buf: Buffer = text;
    var self = this;
    const promise: Promise<boolean> = new Promise((resolve, reject) => {
      pdf(buf)
        .then(function (data: any) {
          // console.log(data.numpages);
          // console.log(data.numrender);
          // console.log(data.info);
          // console.log(data.metadata);
          // console.log(data.version);
          self.content = data.text;
          self.processed = true;
          resolve(true);
        })
        .catch((err: any) => reject(err));
    });
    return promise;
  }
}
