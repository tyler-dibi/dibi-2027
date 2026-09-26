#!/usr/bin/env node
// Usage: npm run new-playground -- "Invoice approval flow"
import { createPlayground } from "./playgrounds.mjs";

const title = process.argv.slice(2).join(" ");
const { file, slug } = createPlayground(title);

console.log(`Created ${file}`);
console.log(`Open http://localhost:5173/playground/${slug}`);
