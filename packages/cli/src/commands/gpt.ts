import * as fs from "fs";
import Spinner from "../outputs/spinner";
import SpheronApiService from "../services/spheron-api";
import { createLog, generateFilePath, generateFilesString } from "../utils";
import { fixBugForGPT } from "../prompts/prompts";

export enum CommandEnum {
  UPDATE = "update",
  FINDBUG = "findbug",
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

    try {
      const parsedGPTRes = JSON.parse(gptResponse.response);
      // create files
      parsedGPTRes.map((file: IParsedResponse) => {
        fs.writeFileSync(generateFilePath(file.filename), file.code);
      });
      const endTime = Date.now();
      // calculate response time
      const elapsedTime = Math.round((endTime - startTime) / 1000);

      spinner.success(
        `Successfully generated the following files: ${generateFilesString(
          parsedGPTRes
        )} in ${elapsedTime}s! 🎉`
      );
    } catch (error) {
      createLog(
        "./error.log",
        `${error.message}\nResponse: ${gptResponse?.response}`
      );
      throw new Error("Unexpected Response. Please try again!");
    }
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

    try {
      const parsedGPTRes = JSON.parse(gptResponse.response);
      // create files
      parsedGPTRes.map((file: IParsedResponse) => {
        fs.writeFileSync(generateFilePath(file.filename), file.code);
      });
      const endTime = Date.now();
      // calculate response time
      const elapsedTime = Math.round((endTime - startTime) / 1000);

      spinner.success(
        `Successfully generated the following files: ${generateFilesString(
          parsedGPTRes
        )} in ${elapsedTime}s! 🎉`
      );
    } catch (error) {
      createLog(
        "./error.log",
        `${error.message}\nResponse: ${gptResponse?.response}`
      );
      throw new Error("Unexpected Response. Please try again!");
    }
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

    try {
      const parsedGPTRes = JSON.parse(gptResponse.response);
      fs.writeFileSync(filepath, parsedGPTRes.code);
      const endTime = Date.now();
      // calculate response time
      const elapsedTime = Math.round((endTime - startTime) / 1000);

      spinner.success(
        `File: ${filepath} updated successfully in ${elapsedTime}s!`
      );
    } catch (error) {
      createLog(
        "./error.log",
        `${error.message}\nResponse: ${gptResponse?.response}`
      );
      throw new Error("Unexpected Response. Please try again!");
    }
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    createLog("./error.log", error.message);
  } finally {
    spinner.stop();
  }
}

export async function findBugInCode(filepath: any) {
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

      try {
        const parsedGPTRes = JSON.parse(gptResponse.response);
        fs.writeFileSync(filepath, parsedGPTRes.code);
        const endTime = Date.now();
        // calculate response time
        const elapsedTime = Math.round((endTime - startTime) / 1000);
        spinner.success(
          `Fixed all the bugs in ${filepath} in ${elapsedTime}s!`
        );
      } catch (error) {
        createLog(
          "./error.log",
          `${error.message}\nResponse: ${gptResponse?.response}`
        );
        throw new Error("Unexpected Response. Please try again!");
      }
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

    try {
      const parsedGPTRes = JSON.parse(gptResponse.response);
      fs.writeFileSync(filepath, parsedGPTRes.code);
      const endTime = Date.now();
      // calculate response time
      const elapsedTime = Math.round((endTime - startTime) / 1000);

      spinner.success(
        `Successfully optimized ${filepath} for improved performance in ${elapsedTime}s! 🚀`
      );
    } catch (error) {
      createLog(
        "./error.log",
        `${error.message}\nResponse: ${gptResponse?.response}`
      );
      throw new Error("Unexpected Response. Please try again!");
    }
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

    try {
      const parsedGPTRes = JSON.parse(gptResponse.response);
      fs.writeFileSync(
        generateFilePath(parsedGPTRes.filename),
        parsedGPTRes.code
      );
      const endTime = Date.now();
      // calculate response time
      const elapsedTime = Math.round((endTime - startTime) / 1000);
      spinner.success(
        `Successfully transpiled ${parsedGPTRes.filename} to ${lang} in ${elapsedTime}s! 🔥`
      );
    } catch (error) {
      createLog(
        "./error.log",
        `${error.message}\nResponse: ${gptResponse?.response}`
      );
      throw new Error("Unexpected Response. Please try again!");
    }
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

    const testFilepath = filepath.replace(/(.*\/)(.*)(\..*)/, `$1$2.test$3`);

    try {
      const parsedGPTRes = JSON.parse(gptResponse.response);
      parsedGPTRes.map((file: IParsedResponse) => {
        fs.writeFileSync(generateFilePath(testFilepath), file.code);
      });
      createLog(
        "./error.log",
        `Error message\nResponse: ${gptResponse?.response}`
      );
      const endTime = Date.now();
      // calculate response time
      const elapsedTime = Math.round((endTime - startTime) / 1000);
      spinner.success(
        `Successfully created test cases for ${testFilepath} in ${elapsedTime}s! ✅`
      );
    } catch (error) {
      createLog(
        "./error.log",
        `${error.message}\nResponse: ${gptResponse?.response}`
      );
      throw new Error("Unexpected Response. Please try again!");
    }
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
    createLog("./error.log", error.message);
  } finally {
    spinner.stop();
  }
}
