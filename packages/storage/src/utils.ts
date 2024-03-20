import fs from "fs";

export async function readFileContent(
  filePath: string
): Promise<{ content: Blob }> {
  const exists = fs.promises.access(filePath, fs.constants.F_OK);
  if (!exists) {
    throw new Error("File does not exist.");
  }

  const fileBuffer = await fs.promises.readFile(filePath);
  const blob = new Blob([fileBuffer]);

  return {
    content: blob,
  };
}
