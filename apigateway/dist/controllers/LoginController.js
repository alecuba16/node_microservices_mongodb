"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const access_token_1 = require("../config/access_token");
const jwt_1 = require("../middleware/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const express_1 = __importDefault(require("express"));
const loginController = (app, r, dbCon) => {
    return app.post(r.url, express_1.default.json(), (req, res) => {
        const { username, password } = req.body;
        if (!(username === null || username === void 0 ? void 0 : username.trim()) || !(password === null || password === void 0 ? void 0 : password.trim())) {
            return res.status(400).send("Bad username or password");
        }
        dbCon
            .findOneByUsername(username)
            .then((result) => {
            var userHash = bcrypt.compareSync(password, result.password);
            if (!userHash)
                return res.status(401).json({ msg: "Invalid password" });
            if (userHash) {
                const session = (0, jwt_1.encodeSession)(access_token_1.accessTokenSecret, {
                    id: result.id,
                    username: result.username,
                    role: result.role,
                    dateCreated: new Date().getTime(),
                });
                return res.status(201).json(session);
            }
        })
            .catch((err) => {
            return res.status(500).json(err);
        });
    });
};
exports.loginController = loginController;
//# sourceMappingURL=LoginController.js.map