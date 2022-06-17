export const PHOTOS = new Set<string>([
  ".jpg",
  ".jpeg",
  ".gif",
  ".png",
]);
export const VIDEOS = new Set<string>([
  ".mp4",
  ".mov",
  ".avi",
]);

// How many exiftool calls should be run in parallel?
export const PROC_COUNT = 20;

// How patient are we with exiftool?
export const MAX_EXIFTOOL_RUNTIME = 5_000;

export const DB_PATH = "./linnaeus.sqlite";
