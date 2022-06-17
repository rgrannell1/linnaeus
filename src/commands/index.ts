import { Db } from "../db.ts";
import * as Media from "../media.ts";
import { LinnaeusIndexOpts } from "../types.ts";

/**
 * Index a media directory and extract exif information
 *
 * @export
 * @param {LinnaeusIndexOpts} opts
 */
export async function linnaeusIndex(opts: LinnaeusIndexOpts) {
  let media_idx = 0;

  const db = new Db(opts.dbPath);
  await db.createTables();

  for await (
    const media of Media.getMedia({
      fpath: opts.mediaPath,
      extensions: opts.extensions,
    })
  ) {
    console.clear();
    const emoji = media.type === "photo" ? "📷" : "📹";

    const message = `${emoji} Stored media-item #${media_idx++}`.padEnd(40);
    console.log(`Linnaeus\n`);
    console.log(`${message}${media.fpath}`);
    await db.writeMedia(media);
  }
}
