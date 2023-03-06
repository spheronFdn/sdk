import eraseLines from "./erase-lines";

export interface StopSpinner {
  (): void;
  text: string;
}

export default function wait(opts: any, delay = 300): StopSpinner {
  let text = opts.text;
  let spinner: any | null = null;

  if (typeof text !== "string") {
    throw new Error(`"text" is required for Ora spinner`);
  }

  const timeout = setTimeout(async () => {
    const { default: ora } = await import("ora");
    spinner = ora(opts);
    spinner.text = text;
    spinner.color = "gray";
    spinner.start();
  }, delay);

  const stop = async () => {
    clearTimeout(timeout);
    if (spinner) {
      spinner.stop();
      spinner = null;
      process.stderr.write(await eraseLines(1));
    }
  };

  stop.text = text;

  // Allow `text` property to update the text while the spinner is in action
  Object.defineProperty(stop, "text", {
    get() {
      return text;
    },
    set(v: string) {
      text = v;
      if (spinner) {
        spinner.text = v;
      }
    },
  });

  return stop;
}
