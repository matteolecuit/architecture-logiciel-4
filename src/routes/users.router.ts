import { Router } from "express";
import jwt from "express-jwt";
import { UnknownUserError } from "../errors/unknown-user.error";
import { UsersService } from "../services/users.service";
const usersRouter = Router();
const dotenv = require("dotenv");
dotenv.config();
const usersService = new UsersService();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 */
usersRouter.get(
  "/",
  jwt({ secret: process.env.TOKEN_KEY, algorithms: ["HS256"] }),
  (req, res) => {
    console.log(req.user);
    const users = usersService.getAllUsers();
    res.status(200).send(users);
  }
);

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: creates a new user
 */
usersRouter.post("/", (req, res) => {
  try {
    const user = usersService.createUser(req.body);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

usersRouter.put("/:userID", (req, res) => {
  try {
    const user = usersService.updateUser(req.params.userID, req.body);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

usersRouter.delete("/:userID", (req: any, res) => {
  try {
    usersService.deleteUser(req.params.userID, req.user.id);
  } catch (error) {
    if (error instanceof UnknownUserError) {
      res.status(404);
    } else {
      res.status(400);
    }
    res.send(error.message);
  }
});

export default usersRouter;
