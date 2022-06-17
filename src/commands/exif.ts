import { Db } from "../db.ts";
import { LinnaeusExifOpts } from '../types.ts'

export async function linnaeusExif(opts: LinnaeusExifOpts) {
  const db = new Db(opts.dbPath);
  await db.createTables();

  for await (const exifData of db.getExif()) {
    console.log(JSON.stringify(exifData));
  }
}
