import * as walk from "https://deno.land/std@0.139.0/fs/walk.ts";
import { extname } from "https://deno.land/std@0.144.0/path/mod.ts";
import { ExifTool } from "./exiftool.ts";
import { PROC_COUNT } from "./constants.ts";
import { Extensions } from "./types.ts";

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

export async function* getMedia(opts: {
  fpath: string;
  extensions: { photos: Set<string>; videos: Set<string> };
}) {
  let buffer = [];
  const { fpath, extensions } = opts;

  for await (const entry of walk.walk(fpath)) {
    if (getType(extensions, entry.name) === "unknown") {
      continue;
    }

    buffer.push(entry);
    if (buffer.length >= PROC_COUNT) {
      const things = buffer.map(async (entry) => {
        return {
          type: getType(extensions, entry.name),
          fpath: entry.path,
          exif: await ExifTool.parse(entry.path),
        };
      });

      for (const mediaInfo of await Promise.allSettled(things)) {
        if (mediaInfo.status === "fulfilled") {
          yield mediaInfo.value;
        }
      }

      buffer = [];
    }

    // done
    const things = buffer.map(async (entry) => {
      return {
        type: getType(extensions, entry.name),
        fpath: entry.path,
        exif: await ExifTool.parse(entry.path),
      };
    });

    for (const mediaInfo of await Promise.allSettled(things)) {
      if (mediaInfo.status === "fulfilled") {
        yield mediaInfo.value;
      }
    }
  }
}
