import http from "http";
import open from "open";
import axios from "axios";
import { writeToJsonFile } from "../utils";
import configuration from "../configuration";
import Spinner from "../outputs/spinner";

let server: http.Server;

export async function login(provider: string): Promise<void> {
  const spinner = new Spinner();
  spinner.spin(`Waiting for ${provider} authentication to be completed `);
  server = http.createServer();
  server.listen(0, "127.0.0.1", async () => {
    const { port } = server.address() as any;
    const baseURL = `${configuration.spheronServerAddress}/auth/${provider}/cli/login`;
    const fullURL = baseURL + `?port=${port}`;
    const successLocationRedirect = new URL(
      `${configuration.spheronFrontendAddress}/notifications/cli-login`
    );
    let loginError = false;
    try {
      await Promise.all([
        new Promise<void>((resolve, reject) => {
          server.once("request", async (req, res) => {
            const code = req.url?.split("&")[0].split("=")[1];
            const verify = await axios.get(
              `${configuration.spheronServerAddress}/auth/${provider}/cli/verify-token/${code}?port=${port}`, //port used for bitbucket
              {
                headers: {
                  Accept: "application/json",
                },
              }
            );
            if (verify.status != 200 || !verify.data.jwtToken) {
              loginError = true;
              throw new Error("Verification of token failed");
            }

            const jwt = verify.data.jwtToken;
            const organizationId = verify.data.organizationId;
            // Closing of server
            res.setHeader("connection", "close");
            res.statusCode = 302;
            res.setHeader("location", successLocationRedirect.href);
            res.end();
            //store jwt token in spheron-config file
            await writeToJsonFile(
              "jwtToken",
              jwt,
              configuration.configFilePath
            );
            await writeToJsonFile(
              "organization",
              organizationId,
              configuration.configFilePath
            );
            resolve();
          });
          server.once("error", reject);
        }),
        open(fullURL),
      ]);
    } catch (error) {
      loginError = true;
    } finally {
      server.close();
      if (loginError) {
        console.log("Error occured while loging in, ");
      } else {
        spinner.success(`${provider} authentication completed`);
      }
      spinner.stop();
      process.exit(0);
    }
  });
}
