import type { ComponentType } from "react";

type PlaygroundModule = {
  default: ComponentType;
  meta?: { title?: string };
};

export type Playground = {
  slug: string;
  title: string;
  file: string;
  Component: ComponentType;
};

// Files starting with "_" are shared helpers for playgrounds, not playgrounds themselves.
const modules = import.meta.glob<PlaygroundModule>(["../playgrounds/*.tsx", "!../playgrounds/_*.tsx"], {
  eager: true,
});

export const playgrounds: Playground[] = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = path.split("/").pop()!.replace(/\.tsx$/, "");
    return {
      slug,
      title: mod.meta?.title ?? slug,
      file: `src/playgrounds/${slug}.tsx`,
      Component: mod.default,
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

export const findPlayground = (slug: string | undefined) =>
  playgrounds.find((p) => p.slug === slug);
