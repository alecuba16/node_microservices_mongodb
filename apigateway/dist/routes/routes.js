"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = exports.routes = exports.crudTypes = void 0;
const http_proxy_middleware_1 = require("http-proxy-middleware");
const LoginController_1 = require("../controllers/LoginController");
const authMiddleware_1 = require("../middleware/authMiddleware");
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
        //target: process.env.PROD ? "http://documentreader:3001/" : "http://host.docker.internal:3001/",
        target: "http://host.docker.internal:3001/",
        changeOrigin: true,
        pathRewrite: {
            [`^/documentReader`]: "",
        },
        onProxyReq(proxyReq, req, res) {
            if (req.locals) {
                proxyReq.setHeader("locals", JSON.stringify(req.locals));
            }
            if (req.body && !req.is("multipart/form-data")) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader("Content-Type", "application/json");
                proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
                proxyReq.end();
            }
        },
    },
};
exports.routes.push(documentReaderRoute);
const documentAnalyzerRoute = {
    url: "/documentAnalyzer",
    auth: true,
    proxy: {
        // target: process.env.PROD ? "http://documentanalyzer:3002/" : "http://host.docker.internal:3002/",
        target: "http://host.docker.internal:3002/",
        changeOrigin: true,
        pathRewrite: {
            [`^/documentAnalyzer`]: "",
        },
    },
};
exports.routes.push(documentAnalyzerRoute);
const loginRoute = {
    url: "/login",
    crudType: crudTypes.create,
    auth: false,
};
exports.routes.push(loginRoute);
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
            return (0, LoginController_1.loginController)(app, r, dbCon);
        }
    });
};
exports.setupRoutes = setupRoutes;
//# sourceMappingURL=routes.js.map