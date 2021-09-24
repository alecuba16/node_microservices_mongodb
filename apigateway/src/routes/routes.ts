import { Application } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { loginController } from "../controllers/LoginController";
import { authMiddleware } from "../middleware/authMiddleware";
import { AuthRepository } from "../repositories/AuthRepository";

export enum crudTypes {
  "create",
  "read",
  "update",
  "delete",
}
export type RouteConfig = {
  url: string;
  crudType?: crudTypes;
  auth: boolean;
  proxy?: any;
};

export var routes: RouteConfig[] = [];
const documentReaderRoute: RouteConfig = {
  url: "/documentReader",
  auth: true,
  proxy: {
    //target: process.env.PROD ? "http://documentreader:3001/" : "http://host.docker.internal:3001/",
    target: "http://host.docker.internal:3001/",
    changeOrigin: true,
    pathRewrite: {
      [`^/documentReader`]: "",
    },
    onProxyReq(proxyReq: any, req: any, res: any) {
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
routes.push(documentReaderRoute);

const documentAnalyzerRoute: RouteConfig = {
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
routes.push(documentAnalyzerRoute);

const loginRoute: RouteConfig = {
  url: "/login",
  crudType: crudTypes.create,
  auth: false,
};
routes.push(loginRoute);

export const setupRoutes = (app: Application, routes: RouteConfig[], dbCon: AuthRepository) => {
  routes.forEach((r: RouteConfig) => {
    if (r.proxy) {
      if (r.auth) {
        return app.use(r.url, authMiddleware, createProxyMiddleware(r.proxy));
      } else {
        return app.use(r.url, createProxyMiddleware(r.proxy));
      }
    } else if (r.url == "/login") {
      return loginController(app, r, dbCon);
    }
  });
};
