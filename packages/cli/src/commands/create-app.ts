import child_process from "child_process";
import path from "path";

export async function createApp(templateUrl: string, folderName: string) {
  try {
    const { exitCode } = await executeCloneOfRepo(templateUrl, folderName);
    if (exitCode == 0) {
      console.log("Dapp created successfully");
    } else {
      throw new Error("There was an issue creating dapp.");
    }
  } catch (error) {
    console.log("Error: ", error.message);
  } finally {
    process.exit(0);
  }
}

function executeCloneOfRepo(
  sourceUrl: string,
  folderName: string
): Promise<{ exitCode: number }> {
  return new Promise((resolve) => {
    const child = child_process.spawn(
      "sh",
      [path.join(__dirname, "../scripts/clone.sh")],
      {
        shell: true,
        env: {
          SOURCE_URL: sourceUrl,
          FOLDER_NAME: folderName,
        },
      }
    );
    let exitCode = 0;
    child.stdout.setEncoding("utf8");
    child.on("error", () => {
      exitCode = 1;
    });
    child.on("close", () => {
      resolve({ exitCode });
    });
  });
}

export function getTemplateUrlMapping(alias: string): string {
  if (alias === "Portfolio") {
    return "https://github.com/spheronFdn/portfolio-template";
  } else if (alias === "NFT Drop") {
    return "https://github.com/spheronFdn/react-boilerplate";
  } else if (alias === "React") {
    return "https://github.com/spheronFdn/react-boilerplate";
  } else if (alias === "Next.js") {
    return "https://github.com/spheronFdn/react-boilerplate";
  }
  throw new Error("Mapping for template not found");
}
