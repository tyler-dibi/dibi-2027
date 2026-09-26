import type { Plugin } from "vite";
import { createPlayground } from "./playgrounds.mjs";

/** Dev-only endpoint so the "New playground" button can create files from the browser. */
export function playgroundApi(): Plugin {
  return {
    name: "carbon-playground-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__api/playgrounds", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            const { title } = JSON.parse(body || "{}") as { title?: string };
            const result = createPlayground(title ?? "");
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
          } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(error) }));
          }
        });
      });
    },
  };
}
