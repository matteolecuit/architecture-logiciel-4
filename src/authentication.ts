import jwt from "jsonwebtoken";
import { UserModel } from "./models/user.model";
const dotenv = require("dotenv");

dotenv.config();

export const authenticateToken = (req: any, res: any, next: any) => {
  const { err, user } = getToken(req);
  if (err) res.sendStatus(403);
  req.user = user;
  next();
};

export const authenticateAdminToken = (req: any, res: any, next: any) => {
  const { err, user } = getToken(req);
  if (err) {
    res.sendStatus(403);
  }
  if (user.roles.indexOf("administrator") === -1) {
    res.sendStatus(403);
  }
  req.user = user;
  next();
};

const getToken = (req: any): { user: UserModel; err: Error } => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return { err: new Error("no token found"), user: null };

  try {
    const user = jwt.verify(token, process.env.TOKEN_KEY) as UserModel;
    return { user, err: null };
  } catch (err) {
    return { user: null, err };
  }
};
