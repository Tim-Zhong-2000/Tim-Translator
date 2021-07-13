/**
 * @description OCR - 路由模块
 * @author Tim-Zhong-2000
 */
import axios from "axios";
import express, { Request, Response } from "express";
import { Paddle } from "../../types/Paddle";
import CONFIG from "../../utils/config";
import { msgBody } from "../../utils/msgBody";

const router = express.Router();
const OCRUrl: string = CONFIG.paddleocr.url;

router.post("/base64", async (req: Request, res: Response) => {
  const payload: {
    image: string;
  } = req.body;
  try {
    const paddlePayload: Paddle.Payload = (
      await axios.post(OCRUrl, { images: [payload.image] })
    ).data;
    const result = paddlePayload.results[0];
    console.log(paddlePayload);
    await req.userService.addOcrRecord(
      req.session.user.uid,
      payload.image.slice(0, 64),
      JSON.stringify(result)
    );
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(msgBody("ocr后端异常", err));
  }
});

router.get("/history", async (req: Request, res: Response) => {
  const pageSize = Number(req.query.size || 20);
  const offset = Number(req.query.page || 0) * pageSize;

  const uid = req.session.user.uid;
  try {
    const ocrList = await req.userService.getMyOcr(uid, pageSize, offset);
    res.json(msgBody("获取过去提交的ocr成功", ocrList));
  } catch (err) {
    res.status(500).json(msgBody("查找过去提交的ocr记录失败"));
  }
});

router.delete("/history/by-id/:id", async (req: Request, res: Response) => {
  const uid = req.session.user.uid;
  const ocrId = req.params.id;
  try {
    const result = await req.userService.deleteOcrRecordById(uid, ocrId);
    res.json(msgBody("删除记录成功"));
  } catch (err) {
    res.status(500).json(msgBody(err.message));
  }
});

router.delete("/history/by-text/:text", async (req: Request, res: Response) => {
  const text = req.params.text;
  const uid = req.session.user.uid;
  try {
    const result = await req.userService.deleteOcrRecordByText(uid, text);
    res.json(msgBody(`已删除${result}条历史记录`));
  } catch (err) {
    res.status(500).json(msgBody(err.message));
  }
});

export default router;
