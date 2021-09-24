import { Docfile } from "./Docfile";
export class DocfileTxt extends Docfile {
  constructor(id: string, docname: string, userId: number) {
    super(id, docname, "txt", userId);
  }

  contentFromText(text: any): Promise<any> {
    var self = this;
    const promise: Promise<boolean> = new Promise((resolve, reject) => {
      self.content = text;
      self.processed = true;
      resolve(true);
    });
    return promise;
  }
}
