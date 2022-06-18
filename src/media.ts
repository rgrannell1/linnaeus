import * as walk from "https://deno.land/std@0.139.0/fs/walk.ts";
import { extname } from "https://deno.land/std@0.144.0/path/mod.ts";
import { ExifTool } from "./exiftool.ts";
import { PROC_COUNT } from "./constants.ts";
import { Extensions } from "./types.ts";
import { Db } from "./db.ts";

/**
 * Get the type of the media based on the extension
 *
 * @param {Extensions} extensions
 * @param {string} name
 * @return {*}  {string}
 */
function getType(extensions: Extensions, name: string): string {
  let type = "unknown";
  const ext = extname(name).toLowerCase();

  if (extensions.photos.has(ext)) {
    type = "photo";
  }

  if (extensions.videos.has(ext)) {
    type = "videos";
  }

  return type;
}

/**
 * Get media and associated JSON from a photo directory
 *
 * @export
 * @param {{
 *   fpath: string;
 *   extensions: { photos: Set<string>; videos: Set<string> };
 * }} opts
 */
export async function* getMedia(opts: {
  db: Db;
  fpath: string;
  extensions: { photos: Set<string>; videos: Set<string> };
}) {
  async function* flush(buffer: any[]) {
    const things = buffer.map(async (entry) => {
      return {
        type: getType(extensions, entry.name),
        fpath: entry.path,
        exif: await ExifTool.parse(entry.path),
      };
    });

    for (const mediaInfo of await Promise.allSettled(things)) {
      if (mediaInfo.status === "fulfilled") {
        yield { media: mediaInfo.value, idx };
      }
    }
  }

  let idx = 0;
  let buffer = [];
  const { fpath, extensions, db } = opts;

  for await (const entry of walk.walk(fpath)) {
    idx++;

    if (db.hasEntry(fpath) || getType(extensions, entry.name) === "unknown") {
      continue;
    }

    buffer.push(entry);

    if (buffer.length >= PROC_COUNT) {
      yield* flush(buffer);
      buffer = [];
    }
  }

  yield* flush(buffer);
  buffer = [];
}
