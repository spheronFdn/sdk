import * as dotenv from "dotenv";

dotenv.config();

interface IConfig {
  spheronApiUrl: string;
}

const config: IConfig = {
  spheronApiUrl: process.env.SPHERON_API_URL || "",
};

export default config;
