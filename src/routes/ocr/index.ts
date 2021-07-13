/**
 * @description OCR - 路由模块
 * @author Tim-Zhong-2000
 */
import express from "express";
import { checkLogin } from "../../utils/userSession";
import paddle from "./paddle";

const router = express.Router();

router.use(checkLogin());
router.use("/paddle", paddle);

export default router;
