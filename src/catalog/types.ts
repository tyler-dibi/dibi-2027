import type { ComponentType } from "react";

export const CATEGORIES = [
  "Actions",
  "Inputs",
  "Selection",
  "Feedback & status",
  "Overlays",
  "Navigation",
  "Layout",
  "Data display",
  "Typography & content",
  "Utilities",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type CatalogEntry = {
  /** Component name, as imported. This is what the copy button copies. */
  name: string;
  /** Folder under carbon-react/lib/components/ */
  folder: string;
  /** Import from the folder's `__next__` entry point (Carbon's current implementation). */
  next?: boolean;
  /** Named exports (sub-components) from the folder, if any. */
  exports?: string[];
  category: Category;
  description: string;
  /** Set when Carbon has deprecated the component; explains what to use instead. */
  deprecated?: string;
  Preview: ComponentType;
};
