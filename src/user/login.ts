/**
 * @description 登录接口
 * @author Tim-Zhong-2000
 */

import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

const router = express.Router();
router.use(cookieParser());
router.get("/login", (req, res) => {});
router.post("/login", (req, res) => {});
