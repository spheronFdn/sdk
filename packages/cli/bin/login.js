const http = require("http");
const open = require("open");
const axios = require("axios");
const { writeToConfigFile } = require("./utils");

async function login(provider) {
  console.log("Login...");
  const server = http.createServer();
  const s = await server.listen(0, "127.0.0.1"); // 0 = random port
  const { port } = s.address();
  const baseURL = `http://localhost:8080/auth/${provider}/cli/login`;
  const fullURL = baseURL + `?port=${port}`;
  const successLocationRedirect = new URL(
    "https://app.spheron.network/notifications/cli-login"
  );
  let loginError = false;
  try {
    await Promise.all([
      new Promise((resolve, reject) => {
        server.once("request", async (req, res) => {
          const code = req.url.split("&")[0].split("=")[1];
          const verify = await axios.get(
            `http://localhost:8080/auth/github/cli/verify-token/${code}`,
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
    console.log("Error: ", error.text);
    loginError = true;
  } finally {
    server.close();
    if (loginError) {
      console.log("Error occured while loging in, ");
    } else {
      console.log("Login succesfull!");
    }
  }
}

module.exports = {
  login,
};
