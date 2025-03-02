import { strict as assert } from "node:assert";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import * as esbuild from "esbuild";
import postcssPlugin from "../src/index.mjs";
import postcss from "postcss";
import autoprefixer from "autoprefixer";

// Create a temporary directory for our test
const tmpDir = await fs.mkdtemp(
  path.join(os.tmpdir(), "esbuild-postcss-test-"),
);
const inputFile = path.join(tmpDir, "input.css");
const outputFile = path.join(tmpDir, "output.js");

// Create a simple CSS file for testing
const cssContent = `
.example {
  display: flex;
  user-select: none;
}
`;

// Write the test CSS file
await fs.writeFile(inputFile, cssContent);

// Test the plugin with autoprefixer
try {
  console.log("Testing PostCSS plugin with autoprefixer...");

  const result = await esbuild.build({
    entryPoints: [inputFile],
    bundle: true,
    outfile: outputFile,
    plugins: [
      postcssPlugin({
        plugins: [autoprefixer],
      }),
    ],
  });

  console.log("Build completed successfully");

  const outputContent = await fs.readFile(outputFile, "utf8");

  assert(
    outputContent.includes("-webkit-user-select"),
    "Expected -webkit-user-select to be added by autoprefixer",
  );
  assert(
    outputContent.includes("-moz-user-select"),
    "Expected -moz-user-select to be added by autoprefixer",
  );

  console.log("Test passed: Autoprefixer correctly processed CSS");
} catch (error) {
  console.error("Test failed:", error);
  process.exit(1);
} finally {
  try {
    await fs.rm(tmpDir, { recursive: true, force: true });
    console.log("Cleaned up temporary test files");
  } catch (cleanupError) {
    console.warn("Warning: Failed to clean up temporary files:", cleanupError);
  }
}
