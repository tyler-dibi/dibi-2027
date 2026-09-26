export declare const PLAYGROUNDS_DIR: string;
export declare function slugify(title: string): string;
export declare function createPlayground(rawTitle: string): {
  slug: string;
  title: string;
  file: string;
};
