import fs from "fs";

export async function readFileContent(
  filePath: string
): Promise<{ content: Uint8Array }> {
  const exists = fs.promises.access(filePath, fs.constants.F_OK);
  if (!exists) {
    throw new Error("File does not exist.");
  }

  const fileBuffer = await fs.promises.readFile(filePath);
  const fileContent = new Uint8Array(fileBuffer);

  return {
    content: fileContent,
  };
}
