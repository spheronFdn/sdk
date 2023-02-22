"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const http_1 = __importDefault(require("http"));
const open_1 = __importDefault(require("open"));
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
const configuration_1 = __importDefault(require("./configuration"));
function login(provider) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Login...");
        const server = http_1.default.createServer();
        const s = yield server.listen(0, "127.0.0.1");
        const { port } = s.address();
        const baseURL = `${configuration_1.default.spheron_server_address}/auth/${provider}/cli/login`;
        const fullURL = baseURL + `?port=${port}`;
        const successLocationRedirect = new URL(`${configuration_1.default.spheron_frontend_address}/notifications/cli-login`);
        let loginError = false;
        try {
            yield Promise.all([
                new Promise((resolve, reject) => {
                    server.once("request", (req, res) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        const code = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split("&")[0].split("=")[1];
                        const verify = yield axios_1.default.get(`${configuration_1.default.spheron_server_address}/auth/${provider}/cli/verify-token/${code}?port=${port}`, {
                            headers: {
                                Accept: "application/json",
                            },
                        });
                        if (verify.status != 200 || !verify.data.jwtToken) {
                            loginError = true;
                            throw new Error("Verification of token failed");
                        }
                        const jwt = verify.data.jwtToken;
                        res.setHeader("connection", "close");
                        res.statusCode = 302;
                        res.setHeader("location", successLocationRedirect.href);
                        res.end();
                        yield (0, utils_1.writeToConfigFile)("jwtToken", jwt);
                        resolve();
                    }));
                    server.once("error", reject);
                }),
                (0, open_1.default)(fullURL),
            ]);
        }
        catch (error) {
            loginError = true;
        }
        finally {
            server.close();
            if (loginError) {
                console.log("Error occured while loging in, ");
            }
            else {
                console.log("Login succesfull!");
            }
            process.exit(0);
        }
    });
}
exports.login = login;
