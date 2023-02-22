"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const configuration = {
    spheron_server_address: "http://localhost:8080",
    spheron_frontend_address: "https://app.spheron.network",
    upload_api_address: "https://api-dev.spheron.network",
    version: "1.0.0",
    configFilePath: path_1.default.join(process.env.HOME ? process.env.HOME : "/home/ubuntu", ".spheron/config.json"),
    projectTrackingFilePath: path_1.default.join(process.env.HOME ? process.env.HOME : "/home/ubuntu", ".spheron/project-tracking.json"),
    templateUrls: {
        "react-app": "https://github.com/spheronFdn/react-boilerplate",
        "nft-edition-drop-template": "https://github.com/spheronFdn/react-boilerplate",
        "next-app": "https://github.com/spheronFdn/react-boilerplate",
        "portfolio-app": "https://github.com/spheronFdn/portfolio-template",
    },
    home_path: process.env.HOME || "",
};
exports.default = configuration;
