import { Options } from "tsup";

const options: Options = {
  entryPoints: ["src/index.ts"],
  format: ["cjs"],
  dts: true,
  env: {
    SPHERON_API_URL: "http://localhost:8080",
  },
};

export default options;
