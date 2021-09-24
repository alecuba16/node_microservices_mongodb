import { Application, Request, Response } from "express";
import { accessTokenSecret } from "../config/access_token";
import { encodeSession } from "../middleware/jwt";
import { AuthRepository } from "../repositories/AuthRepository";
import { RouteConfig } from "../routes/routes";
import * as bcrypt from "bcryptjs";
import { Iuser } from "../models/Iuser";
import express from "express";

export const loginController = (app: Application, r: RouteConfig, dbCon: AuthRepository) => {
  return app.post(r.url, express.json(), (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username?.trim() || !password?.trim()) {
      return res.status(400).send("Bad username or password");
    }
    dbCon
      .findOneByUsername(username)
      .then((result: Iuser) => {
        var userHash = bcrypt.compareSync(password, result.password);
        if (!userHash) return res.status(401).json({ msg: "Invalid password" });
        if (userHash) {
          const session = encodeSession(accessTokenSecret, {
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
