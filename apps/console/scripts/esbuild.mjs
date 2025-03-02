import babel from "@babel/core";
import postCssPlugin from "@deanc/esbuild-plugin-postcss";
import autoprefixer from "autoprefixer";
import { execSync, spawn } from "child_process";
import * as esbuild from "esbuild";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import process from "node:process";
import tailwindcssPlugin from "@tailwindcss/postcss";


async function copyRecursive(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const files = await fs.readdir(src);

  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    const fileInfo = await fs.lstat(srcPath);

    if (fileInfo.isDirectory()) {
      await copyRecursive(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

function runRelayCompilerInWatchMode() {
  const relayProcess = spawn("npm", ["run", "relay:watch"]);

  relayProcess.stdout.on("data", (data) => {
    console.log(`[relay] ${data}`);
  });

  relayProcess.stderr.on("data", (data) => {
    console.error(`[relay] ${data}`);
  });

  relayProcess.on("error", (error) => {
    console.error("Failed to start Relay compiler:", error);
  });

  console.log("Relay compiler started in watch mode.");
}

const envVars = Object.fromEntries(
  Object.entries(process.env).map(([key, value]) => [
    `process.env.${key}`,
    JSON.stringify(value),
  ]),
);

const hotReloading = {
  name: "hot-reloading",
  async setup(build) {
    if (!process.env.LIVE_RELOAD) {
      return;
    }

    build.initialOptions.banner = build.initialOptions.banner || {};
    build.initialOptions.banner.js = `
      ${build.initialOptions.banner.js || ""};

      if (!window.__esbuild_event_source__) {
        window.__esbuild_event_source__ = true;
        new EventSource('/esbuild').addEventListener('change', (e) => {
          const { added, removed, updated } = JSON.parse(e.data);

          if (!added.length && !removed.length && updated.length === 1) {
            for (const link of document.getElementsByTagName("link")) {
              const url = new URL(link.href);

              if (url.host === location.host && url.pathname === updated[0]) {
                const next = link.cloneNode();
                next.href = updated[0] + '?' + Math.random().toString(36).slice(2);
                next.onload = () => link.remove();
                link.parentNode.insertBefore(next, link.nextSibling);
                return;
              }
            }
          }

          location.reload();
        });
      }
    `;
    return;
  },
};

const relayPlugin = {
  name: "relay-compiler",
  setup(build) {
    build.initialOptions.loader = {
      ...build.initialOptions.loader,
      ".graphql": "text",
    };

    build.onLoad({ filter: /\.(ts|tsx)$/ }, async (args) => {
      const source = await fs.readFile(args.path, "utf8");

      const result = await babel.transformAsync(source, {
        filename: args.path,
        presets: [
          [
            "@babel/preset-env",
            {
              modules: false,
            },
          ],
          "@babel/preset-typescript",
        ],
        plugins: ["relay"],
        sourceMaps: true,
      });

      return {
        contents: result.code,
        loader: "default",
      };
    });
  },
};

const defaultOptions = {
  logLevel: "info",
  entryPoints: ["src/App.tsx"],
  bundle: true,
  minify: true,
  publicPath: "/",
  outdir: "dist",
  assetNames: "assets/[name]-[hash]",
  chunkNames: "chunks/[name]-[hash]",
  entryNames: "[dir]/[name]",
  splitting: true,
  format: "esm",
  sourcemap: "external",
  loader: {
    ".png": "file",
    ".jpg": "file",
    ".jpeg": "file",
    ".svg": "file",
    ".gif": "file",
  },
  plugins: [
    relayPlugin,
    hotReloading,
    postCssPlugin({
      plugins: [tailwindcssPlugin(), autoprefixer()],
    }),
  ],
  define: {
    ...envVars,
  },
};

await copyRecursive("public", "dist");

const [, , command] = process.argv;

if (command === "watch") {
  runRelayCompilerInWatchMode();

  const ctx = await esbuild.context({ ...defaultOptions, minify: false });
  await ctx.watch();
  let { host, port } = await ctx.serve({ servedir: "dist" });
  http
    .createServer((req, res) => {
      const options = {
        hostname: host,
        port: port,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };

      const extensionPattern = /\.[^/]+$/;

      const proxyReq = http.request(options, (proxyRes) => {
        if (proxyRes.statusCode === 404 && extensionPattern.test(req.url)) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 - Not Found");
          return;
        }

        if (proxyRes.statusCode === 404) {
          const indexPath = path.join(
            import.meta.dirname,
            "../dist",
            "index.html",
          );

          fs.readFile(indexPath, "utf8")
            .then((data) => {
              res.writeHead(200, { "Content-Type": "text/html" });
              res.end(data);
            })
            .catch((err) => {
              console.error("Error reading index.html:", err);
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end("500 - Internal Server Error");
            });

          proxyRes.resume();
          return;
        }

        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      });

      req.pipe(proxyReq, { end: true });
    })
    .listen(3000, () => {
      console.log(`listening on http://localhost:3000`);
    });
} else {
  execSync("npm run relay", { stdio: "inherit" });
  await esbuild.build(defaultOptions);
}
