/**
 * @description OCR - 路由模块
 * @author Tim-Zhong-2000
 */
import axios from "axios";
import express from "express";
import CONFIG from "../../utils/config";

const router = express.Router();
const OCRUrl = CONFIG.paddleocr.url;
router.post("/detect",async (req,res)=>{
    const payload:{
        images:string[]
    } = req.body;
    try {
        const result = await axios.post(OCRUrl,payload);
        res.json(result)        
    } catch (err) {
        res.status(500).json("ocr后端异常")
    }
})

export default router;