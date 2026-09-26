import inventoryJson from "../../docs/carbon-components.json";

import { actions } from "./previews/actions";
import { data } from "./previews/data";
import { deprecated } from "./previews/deprecated";
import { feedback } from "./previews/feedback";
import { inputs } from "./previews/inputs";
import { layout } from "./previews/layout";
import { navigation } from "./previews/navigation";
import { overlays } from "./previews/overlays";
import { selection } from "./previews/selection";
import { utilities } from "./previews/utilities";
import type { CatalogEntry } from "./types";

type Inventory = {
  version: string;
  inventory: { importPath: string; exports: { name: string; isDefault: boolean; deprecated?: string }[] }[];
};
const inventory = inventoryJson as Inventory;

export const carbonVersion = inventory.version;

export const importPath = (entry: Pick<CatalogEntry, "folder" | "next">) =>
  `carbon-react/lib/components/${entry.folder}${entry.next ? "/__next__" : ""}`;

// Deprecation status is read from carbon-react's own type definitions (see scripts/carbon-inventory.mjs).
const deprecationFor = (entry: CatalogEntry) => {
  const path = importPath(entry);
  return inventory.inventory
    .find((e) => e.importPath === path)
    ?.exports.find((x) => x.name === entry.name && x.deprecated)?.deprecated;
};

export const catalog: CatalogEntry[] = [
  ...actions,
  ...inputs,
  ...selection,
  ...feedback,
  ...overlays,
  ...navigation,
  ...layout,
  ...data,
  ...utilities,
  ...deprecated,
]
  .map((entry) => ({ ...entry, deprecated: entry.deprecated ?? deprecationFor(entry) }))
  .sort((a, b) => a.name.localeCompare(b.name) || Number(!!a.deprecated) - Number(!!b.deprecated));

export const catalogKey = (entry: CatalogEntry) => `${importPath(entry)}#${entry.name}`;
