#!/bin/sh
//bin/true; exec /home/rg/.deno/bin/deno run -A "$0" "$@"

import docopt from "https://deno.land/x/docopt@v1.0.1/dist/docopt.mjs";

import { linnaeusIndex } from "../src/commands/index.ts";
import { linnaeusExif } from "../src/commands/exif.ts";
import { DB_PATH, PHOTOS, VIDEOS } from "../src/constants.ts";

export const LINNAEUS_CLI = `
Usage:
  linnaeus index <fpath>
  linnaeus exif

Arguments:
  <fpath>
`;

const args = docopt(LINNAEUS_CLI);

const commands: Record<string, any> = {
  index: linnaeusIndex,
  exif: linnaeusExif,
};

const [command] = Deno.args;

if (commands.hasOwnProperty(command)) {
  await commands[command]({
    mediaPath: args["<fpath>"],
    dbPath: DB_PATH,
    extensions: {
      videos: VIDEOS,
      photos: PHOTOS,
    },
  });
} else {
  console.log(LINNAEUS_CLI);
  Deno.exit(1);
}
