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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = exports.routes = exports.crudTypes = void 0;
const http_proxy_middleware_1 = require("http-proxy-middleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
const jwt_1 = require("../middleware/jwt");
const access_token_1 = require("./access_token");
const bcrypt = __importStar(require("bcryptjs"));
var crudTypes;
(function (crudTypes) {
    crudTypes[crudTypes["create"] = 0] = "create";
    crudTypes[crudTypes["read"] = 1] = "read";
    crudTypes[crudTypes["update"] = 2] = "update";
    crudTypes[crudTypes["delete"] = 3] = "delete";
})(crudTypes = exports.crudTypes || (exports.crudTypes = {}));
exports.routes = [];
const documentReaderRoute = {
    url: "/documentReader",
    auth: true,
    proxy: {
        target: "http://host.docker.internal:3001/",
        changeOrigin: true,
        pathRewrite: {
            [`^/documentReader`]: "",
        },
    },
};
exports.routes.push(documentReaderRoute);
const documentTextAnalysisRoute = {
    url: "/documentTextAnalysis",
    auth: true,
    proxy: {
        target: "http://documentTextAnalysis:3002/",
        changeOrigin: true,
        pathRewrite: {
            [`^/documentTextAnalysis`]: "",
        },
    },
};
exports.routes.push(documentTextAnalysisRoute);
const loginRoute = {
    url: "/login",
    crudType: crudTypes.create,
    auth: false,
};
exports.routes.push(loginRoute);
const loginHelper = (app, r, dbCon) => {
    return app.post(r.url, (req, res) => {
        const { username, password } = req.body;
        if (!(username === null || username === void 0 ? void 0 : username.trim()) || !(password === null || password === void 0 ? void 0 : password.trim())) {
            return res.status(400).send("Bad username or password");
        }
        dbCon
            .collection("users")
            .findOne({ username: username })
            .then((result) => {
            var userHash = bcrypt.compareSync(password, result.password);
            if (!userHash)
                return res.status(401).json({ msg: "Invalid password" });
            if (userHash) {
                const session = (0, jwt_1.encodeSession)(access_token_1.accessTokenSecret, {
                    id: result.id,
                    username: username,
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
const setupRoutes = (app, routes, dbCon) => {
    routes.forEach((r) => {
        if (r.proxy) {
            if (r.auth) {
                return app.use(r.url, authMiddleware_1.authMiddleware, (0, http_proxy_middleware_1.createProxyMiddleware)(r.proxy));
            }
            else {
                return app.use(r.url, (0, http_proxy_middleware_1.createProxyMiddleware)(r.proxy));
            }
        }
        else if (r.url == "/login") {
            return loginHelper(app, r, dbCon);
        }
    });
};
exports.setupRoutes = setupRoutes;
//# sourceMappingURL=routes.js.map