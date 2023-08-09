// preinstall.ts
import { spawnSync } from 'child_process';
const download = require('download-git-repo');

const goCodePath = './lib/generate-car/';

// Download the Go code from GitHub
download('github:tech-greedy/generate-car', goCodePath, (err: Error | null) => {
  if (err) {
    console.error('Error downloading from github:', err);
    process.exit(1);
  }

  // Compile the Go code into a binary
  const goBuild = spawnSync('make', ['build'], { cwd: goCodePath });

  if (goBuild.error) {
    console.error('Failed to compile Go code:', goBuild.error.message);
    process.exit(1);
  }

  if (goBuild.status !== 0) {
    console.error('Failed to compile Go code. Exit code:', goBuild.status);
    process.exit(1);
  }

  console.log('Go code downloaded and compiled successfully!');
});
