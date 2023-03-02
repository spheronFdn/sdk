import http from "http";
import open from "open";
import axios from "axios";
import { writeToConfigFile } from "../utils";
import configuration from "../configuration";
import { createSpinner } from "nanospinner";

let server: http.Server;

export async function login(provider: string): Promise<void> {
  server = http.createServer();
  server.listen(0, "127.0.0.1", async () => {
    const { port } = server.address() as any;
    const baseURL = `${configuration.spheron_server_address}/auth/${provider}/cli/login`;
    const fullURL = baseURL + `?port=${port}`;
    const successLocationRedirect = new URL(
      `${configuration.spheron_frontend_address}/notifications/cli-login`
    );
    let loginError = false;
    const spinner = createSpinner().start();
    console.log("Login");
    try {
      await Promise.all([
        new Promise<void>((resolve, reject) => {
          server.once("request", async (req, res) => {
            const code = req.url?.split("&")[0].split("=")[1];
            const verify = await axios.get(
              `${configuration.spheron_server_address}/auth/${provider}/cli/verify-token/${code}?port=${port}`, //port used for bitbucket
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
            // Closing of server
            res.setHeader("connection", "close");
            res.statusCode = 302;
            res.setHeader("location", successLocationRedirect.href);
            res.end();
            //store jwt token in spheron-config file
            await writeToConfigFile("jwtToken", jwt);
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
      }
      spinner.success();
      process.exit(0);
    }
  });
}
