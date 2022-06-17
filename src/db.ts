import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Media } from "./types.ts";

const db = new DB("test.db");
db.query(`
  CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  )
`);

export class Db {
  fpath: string;
  db: DB;

  constructor(fpath: string) {
    this.db = new DB(fpath);
    this.fpath = fpath;
  }

  async createTables() {
    const tables = [
      `create table if not exists media (
        fpath    text primary key,
        exif     text not null
      );
      `,
      `create table if not exists tags (
        fpath   text not null,
        tag     text not null,

        primary key(fpath, tag)
      );
      `,
    ];

    return Promise.all(tables.map((table) => this.db.execute(table)));
  }
  async writeMedia(media: Media) {
    await this.db.query(
      `insert or replace into media (fpath, exif) values (:fpath, :exif)`,
      {
        fpath: media.fpath,
        exif: media.exif === undefined ? "" : JSON.stringify(media.exif),
      },
    );
  }
}
