import * as fs from "fs";
import Spinner from "../outputs/spinner";
import SpheronApiService from "../services/spheron-api";
import {
  createLog,
  generateFilePath,
  generateFilesString,
  generateTestCaseFileName,
  generateTestCasesFilesString,
} from "../utils";
import { fixBugForGPT } from "../prompts/prompts";

const REGEX =
  /@fname\s*\n{1,2}(.*?)\s*\n{1,2}@code-start\s*\n([\s\S]*?)@code-end/g;

export enum CommandEnum {
  UPDATE = "update",
  FINDBUGS = "findbugs",
  IMPROVE = "improve",
  TRANSPILE = "transpile",
  TEST = "ctc",
}

export enum FixBugEnum {
  YES = "Yes",
  NO = "No",
}

export interface IGPTResponse {
  response: string;
}

export interface IParsedResponse {
  filename: string;
  code: string;
}

export interface IFiles {
  filename: string;
  code: string;
}

export async function generateCode(prompt: string) {
  const spinner = new Spinner();
  const spinnerMessage = "Generating code...";
  const startTime = Date.now();

  try {
    const formattedPrompt = prompt[0].toUpperCase() + prompt.slice(1);
    const gptResponse: IGPTResponse = await SpheronApiService.generateCode(
      spinner,
      spinnerMessage,
      "Generate",
      formattedPrompt
    );

    if (!gptResponse?.response) {
      throw { message: "You need to login first using 'spheron login'." };
    }

    const matches = [...gptResponse.response.matchAll(REGEX)];
    const generatedFiles: IFiles[] = [];

    if (!matches[0]) {
      createLog("./error.log", "Unexpected Response. Please try again!");
      throw new Error("Unexpected Response. Please try again!");
    }

    matches.forEach((match) => {
      const filename = match[1].trim();
      const code = match[2].replace(/```/g, " ").trim();
      generatedFiles.push({ filename, code });
    });
    // create files
    generatedFiles.forEach((file: IFiles) => {
      fs.writeFileSync(generateFilePath(file.filename), file.code);
    });

    if (!generatedFiles[0]) {
      createLog("./error.log", "Unexpected Response. Please try again!");
      throw new Error("Unexpected Response. Please try again!");
    }

    const endTime = Date.now();
    // calculate response time
    const elapsedTime = Math.round((endTime - startTime) / 1000);
    spinner.success(
      `Successfully generated the following files: ${generateFilesString(
        generatedFiles
      )} in ${elapsedTime}s! 🎉`
    );
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    createLog("./error.log", error.message);
  } finally {
    spinner.stop();
  }
}

export async function generateCodeBasedOnFile(prompt: string, filepath: any) {
  const spinner = new Spinner();
  const spinnerMessage = "Generating files...";
  const startTime = Date.now();

  try {
    const fileText = fs.readFileSync(filepath, "utf8");
    const formattedPrompt = prompt[0].toUpperCase() + prompt.slice(1);
    const gptResponse: IGPTResponse = await SpheronApiService.generateCode(
      spinner,
      spinnerMessage,
      "Based",
      formattedPrompt,
      fileText
    );

    if (!gptResponse.response) {
      throw { message: "You need to login first using 'spheron login'." };
    }

    const matches = [...gptResponse.response.matchAll(REGEX)];
    const generatedFiles: IFiles[] = [];

    if (!matches[0]) {
      createLog("./error.log", "Unexpected Response. Please try again!");
      throw new Error("Unexpected Response. Please try again!");
    }

    matches.forEach((match) => {
      const filename = match[1].trim();
      const code = match[2].replace(/```/g, " ").trim();
      generatedFiles.push({ filename, code });
    });
    // create files
    generatedFiles.forEach((file: IFiles) => {
      fs.writeFileSync(generateFilePath(file.filename), file.code);
    });

    if (!generatedFiles[0]) {
      createLog("./error.log", "Unexpected Response. Please try again!");
      throw new Error("Unexpected Response. Please try again!");
    }

    const endTime = Date.now();
    // calculate response time
    const elapsedTime = Math.round((endTime - startTime) / 1000);
    spinner.success(
      `Successfully generated the following files: ${generateFilesString(
        generatedFiles
      )} in ${elapsedTime}s! 🎉`
    );
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    createLog("./error.log", error.message);
  } finally {
    spinner.stop();
  }
}

export async function updateCode(prompt: string, filepath: any) {
  const spinner = new Spinner();
  const spinnerMessage = "Updating code...";
  const startTime = Date.now();

  try {
    const fileText = fs.readFileSync(filepath, "utf8");
    const formattedPrompt = prompt[0].toUpperCase() + prompt.slice(1);
    const gptResponse: IGPTResponse = await SpheronApiService.generateCode(
      spinner,
      spinnerMessage,
      "Update",
      formattedPrompt,
      fileText
    );

    if (!gptResponse.response) {
      throw { message: "You need to login first using 'spheron login'." };
    }

    const matches = [...gptResponse.response.matchAll(REGEX)];
    const generatedFiles: IFiles[] = [];

    if (!matches[0]) {
      createLog("./error.log", "Unexpected Response. Please try again!");
      throw new Error("Unexpected Response. Please try again!");
    }

    matches.forEach((match) => {
      const filename = match[1].trim();
      const code = match[2].replace(/```/g, " ").trim();
      generatedFiles.push({ filename, code });
    });
    // create files
    generatedFiles.forEach((file: IFiles) => {
      fs.writeFileSync(filepath, file.code);
    });

    if (!generatedFiles[0]) {
      createLog("./error.log", "Unexpected Response. Please try again!");
      throw new Error("Unexpected Response. Please try again!");
    }

    const endTime = Date.now();
    // calculate response time
    const elapsedTime = Math.round((endTime - startTime) / 1000);
    spinner.success(
      `File: ${filepath} updated successfully in ${elapsedTime}s!`
    );
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    createLog("./error.log", error.message);
  } finally {
    spinner.stop();
  }
}

export async function findBugsInCode(filepath: any) {
  const spinner = new Spinner();
  const spinnerMessage = "Searching for bugs in your code \uD83D\uDC1B ...";

  try {
    const fileText = fs.readFileSync(filepath, "utf8");
    const gptResponse: IGPTResponse = await SpheronApiService.generateCode(
      spinner,
      spinnerMessage,
      "Find",
      fileText
    );

    if (!gptResponse.response) {
      throw { message: "You need to login first using 'spheron login'." };
    }

    createLog("./bugs.log", gptResponse.response);
    spinner.success("Bugs search completed! Check bugs.log for more info.");
    spinner.stop();

    const fixBug = await fixBugForGPT();

    if (fixBug.fix === FixBugEnum.YES) {
      const spinnerFixMessage = "Fixing bugs in your code ⚔️  ...";
      const startTime = Date.now();
      const gptResponse: IGPTResponse = await SpheronApiService.generateCode(
        spinner,
        spinnerFixMessage,
        "Fix",
        fileText
      );

      if (!gptResponse?.response) {
        throw { message: "You need to login first using 'spheron login'." };
      }

      const matches = [...gptResponse.response.matchAll(REGEX)];
      const generatedFiles: IFiles[] = [];

      if (!matches[0]) {
        createLog("./error.log", "Unexpected Response. Please try again!");
        throw new Error("Unexpected Response. Please try again!");
      }

      matches.forEach((match) => {
        const filename = match[1].trim();
        const code = match[2].replace(/```/g, " ").trim();
        generatedFiles.push({ filename, code });
      });
      // create files
      generatedFiles.forEach((file: IFiles) => {
        fs.writeFileSync(filepath, file.code);
      });

      if (!generatedFiles[0]) {
        createLog("./error.log", "Unexpected Response. Please try again!");
        throw new Error("Unexpected Response. Please try again!");
      }

      const endTime = Date.now();
      // calculate response time
      const elapsedTime = Math.round((endTime - startTime) / 1000);
      spinner.success(`Fixed all the bugs in ${filepath} in ${elapsedTime}s!`);
    }
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    createLog("./error.log", error.message);
  } finally {
    spinner.stop();
  }
}

export async function improveCode(filepath: any) {
  const spinner = new Spinner();
  const spinnerMessage = "Improving the performance of your code 🛠️  ...";
  const startTime = Date.now();

  try {
    const fileText = fs.readFileSync(filepath, "utf8");
    const gptResponse: IGPTResponse = await SpheronApiService.generateCode(
      spinner,
      spinnerMessage,
      "Improve",
      fileText
    );

    if (!gptResponse.response) {
      throw { message: "You need to login first using 'spheron login'." };
    }

    const matches = [...gptResponse.response.matchAll(REGEX)];
    const generatedFiles: IFiles[] = [];

    if (!matches[0]) {
      createLog("./error.log", "Unexpected Response. Please try again!");
      throw new Error("Unexpected Response. Please try again!");
    }

    matches.forEach((match) => {
      const filename = match[1].trim();
      const code = match[2].replace(/```/g, " ").trim();
      generatedFiles.push({ filename, code });
    });
    // create files
    generatedFiles.forEach((file: IFiles) => {
      fs.writeFileSync(filepath, file.code);
    });

    if (!generatedFiles[0]) {
      createLog("./error.log", "Unexpected Response. Please try again!");
      throw new Error("Unexpected Response. Please try again!");
    }

    const endTime = Date.now();
    // calculate response time
    const elapsedTime = Math.round((endTime - startTime) / 1000);

    spinner.success(
      `Successfully optimized ${filepath} for improved performance in ${elapsedTime}s! 🚀`
    );
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    createLog("./error.log", error.message);
  } finally {
    spinner.stop();
  }
}

export async function transpileCode(lang: string, filepath: any) {
  const spinner = new Spinner();
  const spinnerMessage = "Transpiling your code ⚙️  ...";
  const startTime = Date.now();

  try {
    const fileText = fs.readFileSync(filepath, "utf8");
    const gptResponse: IGPTResponse = await SpheronApiService.generateCode(
      spinner,
      spinnerMessage,
      "Transpile",
      fileText,
      "",
      lang
    );

    if (!gptResponse.response) {
      throw { message: "You need to login first using 'spheron login'." };
    }

    const matches = [...gptResponse.response.matchAll(REGEX)];
    const generatedFiles: IFiles[] = [];

    if (!matches[0]) {
      createLog("./error.log", "Unexpected Response. Please try again!");
      throw new Error("Unexpected Response. Please try again!");
    }

    matches.forEach((match) => {
      const filename = match[1].trim();
      const code = match[2].replace(/```/g, " ").trim();
      generatedFiles.push({ filename, code });
    });
    // create files
    generatedFiles.forEach((file: IFiles) => {
      fs.writeFileSync(generateFilePath(file.filename), file.code);
    });

    if (!generatedFiles[0]) {
      createLog("./error.log", "Unexpected Response. Please try again!");
      throw new Error("Unexpected Response. Please try again!");
    }

    const endTime = Date.now();
    // calculate response time
    const elapsedTime = Math.round((endTime - startTime) / 1000);
    spinner.success(
      `Successfully transpiled to ${lang}: ${generateFilesString(
        generatedFiles
      )} in ${elapsedTime}s! 🔥`
    );
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    createLog("./error.log", error.message);
  } finally {
    spinner.stop();
  }
}

export async function createTestCases(lang: string, filepath: any) {
  const spinner = new Spinner();
  const spinnerMessage = "Generating test cases for your code 🧪  ...";
  const startTime = Date.now();

  try {
    const fileText = fs.readFileSync(filepath, "utf8");
    const gptResponse: IGPTResponse = await SpheronApiService.generateCode(
      spinner,
      spinnerMessage,
      "Test",
      fileText,
      "",
      lang
    );

    if (!gptResponse?.response) {
      throw { message: "You need to login first using 'spheron login'." };
    }

    const matches = [...gptResponse.response.matchAll(REGEX)];
    const generatedFiles: IFiles[] = [];

    if (!matches[0]) {
      createLog("./error.log", "Unexpected Response. Please try again!");
      throw new Error("Unexpected Response. Please try again!");
    }

    matches.forEach((match) => {
      const filename = match[1].trim();
      const code = match[2].replace(/```/g, " ").trim();
      generatedFiles.push({ filename, code });
    });

    // create files
    generatedFiles.forEach((file: IFiles) => {
      fs.writeFileSync(
        generateTestCaseFileName(filepath, file.filename),
        file.code
      );
    });

    if (!generatedFiles[0]) {
      createLog("./error.log", "Unexpected Response. Please try again!");
      throw new Error("Unexpected Response. Please try again!");
    }

    const endTime = Date.now();
    // calculate response time
    const elapsedTime = Math.round((endTime - startTime) / 1000);
    spinner.success(
      `Successfully created test cases: ${generateTestCasesFilesString(
        filepath,
        generatedFiles
      )} in ${elapsedTime}s! ✅`
    );
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    createLog("./error.log", error.message);
  } finally {
    spinner.stop();
  }
}
