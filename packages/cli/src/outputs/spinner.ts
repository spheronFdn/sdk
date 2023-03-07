import wait, { StopSpinner } from "./wait";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require("chalk");

export default class Spinner {
  private _spinner: StopSpinner | null;

  constructor() {
    this._spinner = null;
  }
  spin = (message: string, delay = 300): void => {
    if (this._spinner) {
      this._spinner.text = message;
    } else {
      this._spinner = wait(
        {
          text: message,
        },
        delay
      );
    }
  };

  stop = () => {
    if (this._spinner) {
      this._spinner();
      this._spinner = null;
    }
  };

  success = (str: string) => {
    console.log(`${chalk.cyan(`> Success!`)} ${str}\n`);
  };
}
