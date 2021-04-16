/**
 * @description 路由-服务发现，3x3测试图片
 * @author Tim-Zhong-2000
 */

import fs from "fs";
import express from "express"

const router = express.Router();

router.get("/",(_req,res)=>{
    const png = fs.createReadStream("../../servicediscovery.png");
    png.pipe(res);
})

export default router;