import { Request, Response, NextFunction } from "express";
import { UserService } from "./UserService";

const userService = new UserService();

function appendUserService(req: Request, res: Response, next: NextFunction) {
  req.userService = userService;
  next();
}

export default appendUserService;
