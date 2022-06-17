#!/bin/sh
//bin/true; exec /home/rg/.deno/bin/deno run -A "$0" "$@"

import docopt from "https://deno.land/x/docopt@v1.0.1/dist/docopt.mjs";

import { linnaeusIndex } from "../src/index.ts";
import { DB_PATH, PHOTOS, VIDEOS } from "../src/constants.ts";

export const LINNAEUS_CLI = `
Usage:
  linnaeus index <fpath>
  linnaeus exif <fpath>

Arguments:
  <fpath>
`;

const args = docopt(LINNAEUS_CLI);

await linnaeusIndex({
  mediaPath: args["<fpath>"],
  dbPath: DB_PATH,
  extensions: {
    videos: VIDEOS,
    photos: PHOTOS,
  },
});
