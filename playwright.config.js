import { defineConfig } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const clientRoot = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(clientRoot, "..");
const workspacePackagePath = resolve(workspaceRoot, "package.json");
const isMonorepoWorkspace = existsSync(workspacePackagePath)
  && JSON.parse(readFileSync(workspacePackagePath, "utf8")).workspaces?.includes("client");

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://127.0.0.1:5173", trace: "retain-on-failure" },
  webServer: {
    command: isMonorepoWorkspace ? "npm run dev -w client" : "npm run dev",
    cwd: isMonorepoWorkspace ? workspaceRoot : clientRoot,
    url: "http://127.0.0.1:5173",
    reuseExistingServer: true,
  },
});
