import { Exif } from "./types.ts";
import { deadline } from "https://deno.land/std@0.141.0/async/mod.ts";
import { MAX_EXIFTOOL_RUNTIME } from "./constants.ts";

/**
 * Call exiftool
 *
 * @export
 * @class ExifTool
 */
export class ExifTool {
  static async parse(fpath: string): Promise<Exif | undefined> {
    const proc = Deno.run({
      cmd: ["exiftool", fpath, "-json"],
      stdout: "piped",
      stderr: "piped",
    });

    try {
      const { code } = await deadline(proc.status(), MAX_EXIFTOOL_RUNTIME);

      const rawOutput = await proc.output();
      await proc.close();

      if (code === 0) {
        return JSON.parse(new TextDecoder().decode(rawOutput));
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      await proc.close();
      return;
    }
  }
}
