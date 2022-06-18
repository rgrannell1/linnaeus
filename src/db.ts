import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Media } from "./types.ts";

/**
 * Sqlite database for storing media details
 *
 * @export
 * @class Db
 */
export class Db {
  fpath: string;
  db: DB;

  constructor(fpath: string) {
    this.db = new DB(fpath);
    this.fpath = fpath;
  }

  /**
   * Create Sqlite tables
   *
   * @return {*}
   * @memberof Db
   */
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

  hasEntry(fpath: string) {
    for (
      const _ of this.db.query("select fpath from media where fpath = :fpath", {
        fpath,
      })
    ) {
      return true;
    }

    return false;
  }

  /**
   * Write media to the database
   *
   * @param {Media} media
   * @memberof Db
   */
  writeMedia(media: Media) {
    this.db.query(
      `insert or replace into media (fpath, exif) values (:fpath, :exif)`,
      {
        fpath: media.fpath,
        exif: media.exif === undefined ? "" : JSON.stringify(media.exif),
      },
    );
  }

  *getExif() {
    for (
      const [fpath, exif] of this.db.query("select fpath, exif from media")
    ) {
      if ((exif as string).startsWith("[")) {
        yield {
          fpath,
          exif: JSON.parse(exif as string)[0],
        };
      }
    }
  }
}
