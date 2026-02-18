import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    basicSsl(),
    {
      name: "bandcamp-proxy",
      configureServer(server) {
        server.middlewares.use("/api/bandcamp", async (req, res) => {
          const url = new URL(req.url, "http://localhost");
          const bandcampURL = url.searchParams.get("url");
          if (!bandcampURL) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Missing url param" }));
            return;
          }
          try {
            const response = await fetch(bandcampURL);
            const html = await response.text();
            const idMatch = html.match(/((?:album|track)=[0-9]*)/);
            const thumbMatch = html.match(/https:\/\/f4\.bcbits\.com\/img\/a[0-9]*_16\.jpg/);
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                id: idMatch ? idMatch[0] : null,
                thumbnail: thumbMatch ? thumbMatch[0] : null,
              }),
            );
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });

        // Instagram blocks all server-side access to media data (oEmbed, embed page).
        // Thumbnails require the poster attribute with a manually-provided URL.
      },
    },
  ],
  server: {
    host: true,
    https: true,
    proxy: {
      "/api/mixcloud": {
        target: "https://www.mixcloud.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mixcloud/, "/oembed"),
      },
      "/api/soundcloud": {
        target: "https://soundcloud.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/soundcloud/, "/oembed"),
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/embetter-media.js"),
      name: "EmbetterMedia",
      formats: ["es", "umd"],
      fileName: (format) => `embetter-media.${format === "es" ? "js" : "umd.js"}`,
    },
  },
});
