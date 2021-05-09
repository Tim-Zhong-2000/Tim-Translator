import { Request, Response, NextFunction } from "express";
import { errBody } from "./errorPayload";

export function checkPayload(template: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    let flag = true; // 是否具有template的所有字段
    Object.keys(template).forEach((key) => {
      if (!(req.body as Object).hasOwnProperty(key)) {
        flag = false;
      }
    });
    if (flag) {
      next();
    } else {
      res.status(400).json(errBody(400, "请求参数非法"));
    }
  };
}
