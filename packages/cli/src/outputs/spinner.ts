import wait, { StopSpinner } from "./wait";

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
    console.log(`> Success! ${str}\n`);
  };
}
