import { spawnSync } from "child_process";
import * as fs from "fs";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const download = require("download-git-repo");

const goCodePath = "./lib/generate-car/";

function checkDirectoryExists(directoryPath: string): boolean {
  try {
    fs.accessSync(directoryPath, fs.constants.R_OK);
    return true;
  } catch (error) {
    return false;
  }
}

if (checkDirectoryExists(goCodePath)) {
  fs.rmSync(goCodePath, { recursive: true, force: true });
}

// Download the Go code from GitHub
download(
  "github:tech-greedy/generate-car#v4.0.1",
  goCodePath,
  (err: Error | null) => {
    if (err) {
      console.error("Error downloading from github:", err);
      process.exit(1);
    }

    // Compile the Go code into a binary
    const goBuild = spawnSync("make", ["build"], { cwd: goCodePath });

    if (goBuild.error) {
      console.error("Failed to compile Go code:", goBuild.error.message);
      process.exit(1);
    }

    if (goBuild.status !== 0) {
      console.error("Failed to compile Go code. Exit code:", goBuild.status);
      process.exit(1);
    }

    console.log("Go code downloaded and compiled successfully!");
  }
);
