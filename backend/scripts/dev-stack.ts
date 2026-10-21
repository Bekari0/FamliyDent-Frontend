import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";
import { isApiReady, waitForApi } from "./dev-health.js";
import { config, backendRoot } from "../src/config/env.js";

const children = new Set<ChildProcess>();
const controller = new AbortController();
let stopping = false;

function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  controller.abort();
  for (const child of children) {
    try {
      if (process.platform !== "win32" && child.pid)
        process.kill(-child.pid, "SIGTERM");
      else child.kill("SIGTERM");
    } catch (error) {
      if (
        !(
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code === "ESRCH"
        )
      )
        throw error;
    }
  }
}

function run(script: string) {
  const child = spawn("npm", ["run", script], {
    cwd: path.resolve(backendRoot, ".."),
    stdio: "inherit",
    shell: process.platform === "win32",
    detached: process.platform !== "win32",
  });
  children.add(child);
  child.once("error", (error) => {
    console.error(`Could not start ${script}: ${error.message}`);
    shutdown(1);
  });
  child.once("exit", (code) => {
    if (!stopping) {
      console.error(`${script} stopped; stopping development servers.`);
      shutdown(code || 1);
    }
    children.delete(child);
  });
}

process.once("SIGINT", () => shutdown());
process.once("SIGTERM", () => shutdown());

async function start() {
  const healthUrl = `http://127.0.0.1:${config.port}/api/health`;
  if (await isApiReady(healthUrl, config.databaseName))
    console.log(`Using the running Family Dent API on port ${config.port}`);
  else run("dev:api");
  await waitForApi(healthUrl, config.databaseName, {
    signal: controller.signal,
  });
  if (!stopping) run("dev:web");
}

start().catch((error) => {
  if (!stopping) {
    console.error(
      error instanceof Error ? error.message : "Development startup failed",
    );
    shutdown(1);
  }
});
