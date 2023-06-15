import * as fs from "fs";
import Spinner from "../outputs/spinner";
import SpheronApiService from "../services/spheron-api";
import { generateFilePath } from "../utils";
import { fixBugForGPT } from "../prompts/prompts";

export enum CommandEnum {
  FINDBUG = "findbug",
  IMPROVE = "improve",
  TRANSPILE = "transpile",
}

export enum FixBugEnum {
  YES = "Yes",
  NO = "No",
}

export interface IGPTResponse {
  response: string;
}

const GENERATE =
  "Follow these Instructions: Generate Full Code, Use Double Quotes, Don't use single quotes, Don't use backticks, Don't give description, Give answer in JSON, Create an array of objects for multiple JSONs \nUse this Format: { filename: 'generated-file-name', code: 'generated-code'} \nQuestion:";
const UPDATE =
  "Follow these Instructions: Generate Full Code, Use Double Quotes, Don't give description \nUpdate the following file/s and give results in the same format:";
const FIX =
  "Follow these Instructions: Generate Full Code, Use Double Quotes, Don't give description, Give answer in JSON \nUse this Format: { code: 'fixed-code' } \nFix bugs in this code:";
const IMPROVE =
  "Follow these Instructions: Generate Full Code, Use Double Quotes, Don't give description, Give answer in JSON \nUse this Format: { code: 'imporved-code' } \nImprove the performance of this code:";
const TRANSPILE =
  "Follow these Instructions: Generate Full Code, Use Double Quotes, Don't use single quotes, Don't use backticks, Don't give description, Give answer in JSON \nUse this Format: { filename: 'generated-file-name', code: 'transpiled-code' } \nTranspile this code to";

export async function generateCode(prompt: string) {
  const spinner = new Spinner();
  const spinnerMessage = "Generating code...";

  try {
    const formattedPrompt = prompt[0].toUpperCase() + prompt.slice(1);
    const gptPrompt = `${GENERATE} ${formattedPrompt}`;
    const gptResponse: IGPTResponse = await SpheronApiService.generateCode(
      spinner,
      spinnerMessage,
      gptPrompt
    );
    if (!gptResponse.response) {
      throw { message: "You need to login first using 'spheron login'." };
    }
    try {
      const parsedGPTRes = JSON.parse(gptResponse.response);
      parsedGPTRes.map((file: { filename: string; code: string }) => {
        fs.writeFileSync(generateFilePath(file.filename), file.code);
      });
      spinner.success("Files generated successfully!");
    } catch (error) {
      throw new Error("Unexpected Response. Please try again!");
    }
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
  } finally {
    spinner.stop();
  }
}

export async function updateCode(prompt: string, path: any) {
  const spinner = new Spinner();
  const spinnerMessage = "Updating code...";

  try {
    const files = path.split(",");
    const filesArray: any[] = [];
    files.map((filename: any) => {
      const fileText = fs.readFileSync(filename.trim(), "utf8");
      filesArray.push({ filename: filename.trim(), code: fileText });
    });
    const formattedPrompt = prompt[0].toUpperCase() + prompt.slice(1);
    const gptPrompt = `${UPDATE} ${JSON.stringify(
      filesArray
    )} \nQuestion: ${formattedPrompt}`;
    const gptResponse: IGPTResponse = await SpheronApiService.generateCode(
      spinner,
      spinnerMessage,
      gptPrompt
    );
    if (!gptResponse.response) {
      throw { message: "You need to login first using 'spheron login'." };
    }
    try {
      const parsedGPTRes = JSON.parse(gptResponse.response);
      parsedGPTRes.map((file: { filename: string; code: string }) => {
        fs.writeFileSync(generateFilePath(file.filename), file.code);
      });
      spinner.success("Files updated successfully!");
    } catch (error) {
      throw new Error("Unexpected Response. Please try again!");
    }
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
  } finally {
    spinner.stop();
  }
}

export async function findBugInCode(path: any) {
  const spinner = new Spinner();
  const spinnerMessage = "Searching for bugs in your code \uD83D\uDC1B ...";

  try {
    const fileText = fs.readFileSync(path, "utf8");
    const findBugPrompt = `Find bugs in this code: ${fileText}`;
    const gptResponse: IGPTResponse = await SpheronApiService.generateCode(
      spinner,
      spinnerMessage,
      findBugPrompt
    );
    if (!gptResponse.response) {
      throw { message: "You need to login first using 'spheron login'." };
    }

    fs.writeFileSync("./bugs.log", gptResponse.response);
    spinner.success("Bug search completed!");
    spinner.stop();

    const fixBug = await fixBugForGPT();

    if (fixBug.fix === FixBugEnum.YES) {
      const spinnerFixMessage = "Fixing bugs in your code ⚔️  ...";

      const fixBugPrompt = `${FIX} ${fileText}`;
      const gptResponse: IGPTResponse = await SpheronApiService.generateCode(
        spinner,
        spinnerFixMessage,
        fixBugPrompt
      );

      try {
        const parsedGPTRes = JSON.parse(gptResponse.response);
        fs.writeFileSync(path, parsedGPTRes.code);
        spinner.success("Fixed all the bugs!");
      } catch (error) {
        throw new Error("Unexpected Response. Please try again!");
      }
    }
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
  } finally {
    spinner.stop();
  }
}

export async function improveCode(path: any) {
  const spinner = new Spinner();
  const spinnerMessage = "Improving the performance of your code 🛠️  ...";

  try {
    const fileText = fs.readFileSync(path, "utf8");
    const improveCodePrompt = `${IMPROVE} ${fileText}`;
    const gptResponse: IGPTResponse = await SpheronApiService.generateCode(
      spinner,
      spinnerMessage,
      improveCodePrompt
    );
    if (!gptResponse.response) {
      throw { message: "You need to login first using 'spheron login'." };
    }

    try {
      const parsedGPTRes = JSON.parse(gptResponse.response);
      fs.writeFileSync(path, parsedGPTRes.code);
      spinner.success(
        "Successfully optimized your code for improved performance! 🚀"
      );
    } catch (error) {
      throw new Error("Unexpected Response. Please try again!");
    }
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
  } finally {
    spinner.stop();
  }
}

export async function transpileCode(lang: string, path: any) {
  const spinner = new Spinner();
  const spinnerMessage = "Transpiling your code ⚙️  ...";

  try {
    const fileText = fs.readFileSync(path, "utf8");
    const transpileCodePrompt = `${TRANSPILE} ${lang} : ${fileText}`;
    const gptResponse: IGPTResponse = await SpheronApiService.generateCode(
      spinner,
      spinnerMessage,
      transpileCodePrompt
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
      spinner.success("Successfully transpiled your code! 🔥");
    } catch (error) {
      throw new Error("Unexpected Response. Please try again!");
    }
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
  } finally {
    spinner.stop();
  }
}
