import CONFIG from "./config";

export default function checkConfig() {
  // 1.启用ocr和team-trans的前置条件 开启用户系统
  if (CONFIG["team-trans"].enabled || CONFIG["paddleocr"].enabled) {
    if (!CONFIG["user-system"].enabled)
      throw new Error("开启team-trans或者paddleocr之前必须先开启用户系统");
  }
  // 2.检查计费的前置条件 开启用户系统
  if (
    (CONFIG["baidu"].enabled && CONFIG["baidu"].charging) ||
    (CONFIG["baiduapi"].enabled && CONFIG["baiduapi"].charging) ||
    (CONFIG["google"].enabled && CONFIG["google"].charging) ||
    (CONFIG["paddleocr"].enabled && CONFIG["paddleocr"].charging)
  ) {
    if (!CONFIG["user-system"].enabled)
      throw new Error("开启team-trans或者paddleocr之前必须先开启用户系统");
  }

  console.log("成功通过配置文件检查");
}
