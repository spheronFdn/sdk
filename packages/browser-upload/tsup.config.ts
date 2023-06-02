import { Options } from "tsup";

const options: Options = {
  entryPoints: ["src/index.ts"],
  format: ["cjs"],
  dts: true,
};

export default options;
