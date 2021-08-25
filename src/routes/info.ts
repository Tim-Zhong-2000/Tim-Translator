/**
 * @description 路由-info
 * @author Tim-Zhong-2000
 */

import express from "express";
import CONFIG from "../utils/config";
import { msgBody } from "../utils/msgBody";

const router = express.Router();

const entryList: { name: string; value: string }[] = [];
if (CONFIG.baidu.enabled) {
  entryList.push({ name: "百度翻译Web", value: "baidu" });
}
if (CONFIG.baiduapi.enabled) {
  entryList.push({ name: "百度翻译Api", value: "baiduapi" });
}
if (CONFIG.google.enabled) {
  entryList.push({ name: "谷歌翻译", value: "google" });
}

router.get("/entrys", (_req, res) => {
  res.json(msgBody("获取翻译器列表成功", entryList));
});

router.get("/", (_req, res) => {
  const info = CONFIG.serverConfig;
  res.json(msgBody("获取服务器公开设置信息成功", info));
});

export default router;
