export type Extensions = {
  photos: Set<string>;
  videos: Set<string>;
};

export type Exif = Record<string, string | number>;
export type Media = {
  type: string;
  fpath: string;
  exif: Exif | undefined;
};

/**
 * Linnaeus index options
 *
 * @export
 * @interface LinnaeusOpts
 */
export interface LinnaeusIndexOpts {
  mediaPath: string;
  dbPath: string;
  extensions: {
    photos: Set<string>;
    videos: Set<string>;
  };
}

export interface LinnaeusExifOpts {
  mediaPath: string;
  dbPath: string;
  extensions: {
    photos: Set<string>;
    videos: Set<string>;
  };
}
