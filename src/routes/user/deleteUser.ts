/**
 * @description /user/delete-user 删除用户
 * @author Tim-Zhong-2000
 */

import express, { NextFunction, Request, Response } from "express";
import { checkPayload } from "../../utils/checkPayload";
import { errBody } from "../../utils/errorPayload";
import { checkLogin } from "../../utils/userSession";

const router = express.Router();

function checkInfo() {
  return function (req: Request, res: Response, next: NextFunction) {
    const { nickname, email } = req.session.user;
    const { nickname2, email2 } = req.body;
    if (nickname === nickname2 && email === email2) {
      next();
    } else {
      res
        .status(403)
        .json(errBody(403, "信息不匹配，请再次确认将要删除的账号"));
    }
  };
}

router
  .use(checkLogin())
  .use(
    checkPayload({
      nickname: "",
      email: "",
      password: "",
    })
  )
  .use(checkInfo())
  .post("/", async (req: Request, res: Response) => {
    const { uid } = req.session.user;
    try {
      res.json(await req.userService.delete(uid));
    } catch (err) {
      res
        .status(500)
        .json(errBody(500, "服务器错误，删除用户失败", err.message));
    }
  });

export default router;
