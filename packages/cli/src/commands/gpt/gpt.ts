import * as fs from "fs";
import Spinner from "../../outputs/spinner";
import SpheronApiService from "../../services/spheron-api";
import {
  createLog,
  generateFilePath,
  generateFilesString,
  generateTestCaseFileName,
  generateTestCasesFilesString,
} from "../../utils";
import { fixBugForGPT } from "../../prompts/prompts";

export enum GptCommandEnum {
  GENERATE = "generate",
  UPDATE = "update",
  FINDBUGS = "findbugs",
  IMPROVE = "improve",
  TRANSPILE = "transpile",
  TEST = "ctc",
}

export enum YesNoEnum {
  YES = "Yes",
  NO = "No",
}

export interface IGPTResponse {
  response: any;
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

    // create files
    gptResponse?.response.forEach((file: IFiles) => {
      fs.writeFileSync(generateFilePath(file.filename), file.code);
    });

    const endTime = Date.now();
    // calculate response time
    const elapsedTime = Math.round((endTime - startTime) / 1000);
    spinner.success(
      `Successfully generated the following files: ${generateFilesString(
        gptResponse?.response
      )} in ${elapsedTime}s! 🎉`
    );
  } catch (error) {
    const errorMessage = error.response.data.error || error.message || error;
    console.log(`✖️  Error: ${errorMessage}`);
    createLog("./error.log", errorMessage);
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

    // create files
    gptResponse?.response.forEach((file: IFiles) => {
      fs.writeFileSync(generateFilePath(file.filename), file.code);
    });

    const endTime = Date.now();
    // calculate response time
    const elapsedTime = Math.round((endTime - startTime) / 1000);
    spinner.success(
      `Successfully generated the following files: ${generateFilesString(
        gptResponse?.response
      )} in ${elapsedTime}s! 🎉`
    );
  } catch (error) {
    const errorMessage = error.response.data.error || error.message || error;
    console.log(`✖️  Error: ${errorMessage}`);
    createLog("./error.log", errorMessage);
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

    // create files
    gptResponse?.response.forEach((file: IFiles) => {
      fs.writeFileSync(filepath, file.code);
    });

    const endTime = Date.now();
    // calculate response time
    const elapsedTime = Math.round((endTime - startTime) / 1000);
    spinner.success(
      `File: ${filepath} updated successfully in ${elapsedTime}s!`
    );
  } catch (error) {
    const errorMessage = error.response.data.error || error.message || error;
    console.log(`✖️  Error: ${errorMessage}`);
    createLog("./error.log", errorMessage);
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

    createLog("./bugs.log", gptResponse.response);
    spinner.success("Bugs search completed! Check bugs.log for more info.");
    spinner.stop();

    const fixBug = await fixBugForGPT();

    if (fixBug.fix === YesNoEnum.YES) {
      const spinnerFixMessage = "Fixing bugs in your code ⚔️  ...";
      const startTime = Date.now();
      const gptResponse: any = await SpheronApiService.generateCode(
        spinner,
        spinnerFixMessage,
        "Fix",
        fileText
      );

      // create files
      gptResponse?.response.forEach((file: IFiles) => {
        fs.writeFileSync(filepath, file.code);
      });

      const endTime = Date.now();
      // calculate response time
      const elapsedTime = Math.round((endTime - startTime) / 1000);
      spinner.success(`Fixed all the bugs in ${filepath} in ${elapsedTime}s!`);
    }
  } catch (error) {
    const errorMessage = error.response.data.error || error.message || error;
    console.log(`✖️  Error: ${errorMessage}`);
    createLog("./error.log", errorMessage);
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

    // create files
    gptResponse?.response.forEach((file: IFiles) => {
      fs.writeFileSync(filepath, file.code);
    });

    const endTime = Date.now();
    // calculate response time
    const elapsedTime = Math.round((endTime - startTime) / 1000);
    spinner.success(
      `Successfully optimized ${filepath} for improved performance in ${elapsedTime}s! 🚀`
    );
  } catch (error) {
    const errorMessage = error.response.data.error || error.message || error;
    console.log(`✖️  Error: ${errorMessage}`);
    createLog("./error.log", errorMessage);
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

    // create files
    gptResponse?.response.forEach((file: IFiles) => {
      fs.writeFileSync(generateFilePath(file.filename), file.code);
    });

    const endTime = Date.now();
    // calculate response time
    const elapsedTime = Math.round((endTime - startTime) / 1000);
    spinner.success(
      `Successfully transpiled to ${lang}: ${generateFilesString(
        gptResponse?.response
      )} in ${elapsedTime}s! 🔥`
    );
  } catch (error) {
    const errorMessage = error.response.data.error || error.message || error;
    console.log(`✖️  Error: ${errorMessage}`);
    createLog("./error.log", errorMessage);
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

    // create files
    gptResponse?.response.forEach((file: IFiles) => {
      fs.writeFileSync(
        generateTestCaseFileName(filepath, file.filename),
        file.code
      );
    });

    const endTime = Date.now();
    // calculate response time
    const elapsedTime = Math.round((endTime - startTime) / 1000);
    spinner.success(
      `Successfully created test cases: ${generateTestCasesFilesString(
        filepath,
        gptResponse?.response
      )} in ${elapsedTime}s! ✅`
    );
  } catch (error) {
    const errorMessage = error.response.data.error || error.message || error;
    console.log(`✖️  Error: ${errorMessage}`);
    createLog("./error.log", errorMessage);
  } finally {
    spinner.stop();
  }
}
