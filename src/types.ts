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

export interface LinnaeusOpts {
  mediaPath: string;
  dbPath: string;
  extensions: {
    photos: Set<string>;
    videos: Set<string>;
  };
}
