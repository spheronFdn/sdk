import http from "http";
import open from "open";
import { writeToJsonFile } from "../utils";
import configuration from "../configuration";
import Spinner from "../outputs/spinner";
import { SpheronApi, VerifiedTokenResponse } from "core";

let server: http.Server;

export async function login(provider: string): Promise<void> {
  const spinner = new Spinner();
  spinner.spin(`Waiting for ${provider} authentication to be completed `);
  server = http.createServer();
  server.listen(0, "127.0.0.1", async () => {
    const { port } = server.address() as any;
    const baseURL = `${configuration.spheronServerAddress}/auth/${provider}/cli/login`;
    const fullURL = baseURL + `?port=${port}`;
    let loginError = false;
    try {
      await Promise.all([
        new Promise<void>((resolve, reject) => {
          server.once("request", async (req, res) => {
            try {
              const code = req.url?.split("&")[0].split("=")[1];
              const client = new SpheronApi(
                "", //not needed
                configuration.spheronServerAddress
              );
              const verify: VerifiedTokenResponse = await client.verfiyGitToken(
                provider,
                String(code),
                port
              );

              // Closing of server
              res.setHeader("connection", "close");
              res.statusCode = 302;
              const successLocationRedirect = new URL(
                `${
                  configuration.spheronFrontendAddress
                }/#/notifications/cli-login?email=${encodeURIComponent(
                  verify.email
                )}`
              );
              res.setHeader("location", successLocationRedirect.href);
              res.end();
              //store jwt token in spheron-config file
              await writeToJsonFile(
                "jwtToken",
                verify.jwt,
                configuration.configFilePath
              );
              await writeToJsonFile(
                "organization",
                verify.organizationId,
                configuration.configFilePath
              );
              resolve();
            } catch (e) {
              if (e.response?.data?.message) {
                const error_message = e.response?.data?.message;
                if (error_message === "security_check") {
                  console.log(
                    `Your account is created! Before using our platform go ahead and fill up the form for security reasons. Visit ${configuration.spheronFrontendAddress} for more information.`
                  );
                } else if (error_message === "banned") {
                  console.log(
                    `Your account has been banned. Before using our platform again please fill up security form. Visit ${configuration.spheronFrontendAddress} for more information.`
                  );
                } else if (error_message === "user_not_found") {
                  console.log("User not found.");
                } else if (
                  error_message === "ask_admin_to_provide_access_to_dev_env"
                ) {
                  console.log(
                    "You signup request is in review process. Please contact Spheron team for more information."
                  );
                } else if (error_message === "waiting_for_access_to_dev_env") {
                  console.log(
                    "You signup request is in review process. Please contact Spheron team for more information."
                  );
                }
              }
              console.log(
                `✖️  Error occured while logging in. Check if you have created an account on Spheron. You need to sign up first with ${provider} connection to be able to login with CLI.`
              );
              spinner.stop();
              process.exit(0);
            }
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
        console.log(`✖️  Error occured while logging in`);
      } else {
        spinner.success(`${provider} authentication completed`);
      }
      spinner.stop();
      process.exit(0);
    }
  });
}
