import { spawn } from "node:child_process";

const children = ["dev:api", "dev"].map((script) =>
  spawn("npm", ["run", script], { stdio: "inherit", shell: process.platform === "win32" }),
);

const shutdown = () => children.forEach((child) => child.kill("SIGTERM"));
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
children.forEach((child) => child.on("exit", (code) => {
  if (code && code !== 0) {
    shutdown();
    process.exitCode = code;
  }
}));
