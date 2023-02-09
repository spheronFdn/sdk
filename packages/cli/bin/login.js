const http = require("http");
const open = require("open");
const axios = require("axios");

async function login() {
  console.log("Login...");
  const server = http.createServer();
  const s = await server.listen(0, "127.0.0.1"); // 0 = random port
  const { port } = s.address();
  const baseURL = "http://localhost:8080/auth/github/cli/login";
  const fullURL = baseURL + `?port=${port}`;
  const successLocationRedirect = new URL(
    "https://app.spheron.network/notifications/cli-login"
  );
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
          console.log("jwt", verify.data.jwtToken);
          res.setHeader("connection", "close");
          res.statusCode = 302;
          res.setHeader("location", successLocationRedirect.href);
          res.end();
        });
        server.once("error", reject);
      }),
      open(fullURL),
    ]);
  } finally {
    server.close();
  }
}

module.exports = {
  login,
};
