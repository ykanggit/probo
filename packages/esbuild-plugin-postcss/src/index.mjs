import postcss from "postcss";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import process from "node:process";

export default (options = { plugins: [] }) => ({
  name: "postcss",
  setup: async function (build) {
    const { rootDir = options.rootDir || process.cwd() } = options;

    const tmpDirPath = await fs.mkdtemp(
      path.join(os.tmpdir(), "esbuild-plugin-postcss-"),
    );

    build.onResolve(
      { filter: /.\.(css)$/, namespace: "file" },
      async (args) => {
        const resolution = await build.resolve(args.path, {
          resolveDir: args.resolveDir,
          kind: args.kind,
        });
        if (resolution.errors.length > 0) {
          return { errors: resolution.errors };
        }

        const sourceFullPath = resolution.path;
        const sourceExt = path.extname(sourceFullPath);
        const sourceBaseName = path.basename(sourceFullPath, sourceExt);
        const sourceDir = path.dirname(sourceFullPath);
        const sourceRelDir = path.relative(path.dirname(rootDir), sourceDir);

        const tmpDir = path.resolve(tmpDirPath, sourceRelDir);
        const tmpFilePath = path.resolve(tmpDir, `${sourceBaseName}.css`);
        await fs.mkdir(tmpDir, { recursive: true });

        const css = await fs.readFile(sourceFullPath);
        const result = await postcss(options.plugins).process(css, {
          from: sourceFullPath,
          to: tmpFilePath,
        });

        await fs.writeFile(tmpFilePath, result.css);

        return {
          path: tmpFilePath,
          watchFiles: [sourceFullPath],
        };
      },
    );
  },
});
