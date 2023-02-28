import { Options } from "tsup";

const options: Options = {
  entryPoints: ["src/index.ts"],
  format: ["cjs"],
  dts: true,
  env: {
    SPHERON_API_URL: "https://api-v2.spheron.network",
  },
};

export default options;
