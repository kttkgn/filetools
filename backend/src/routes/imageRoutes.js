const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  convertImage,
  compressImage,
  cropImage,
  addWatermark
} = require('../services/imageService');
const fs = require('fs');

// 配置文件上传
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件类型'));
    }
  }
});

// 图片格式转换
router.post('/convert', upload.single('image'), async (req, res) => {
  try {
    const result = await convertImage(req.file, req.body.format);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '图片转换失败'
    });
  }
});

// 图片压缩
router.post('/compress', upload.single('image'), async (req, res) => {
  try {
    const result = await compressImage(req.file, req.body.quality);
    
    // 读取压缩后的文件
    const fileBuffer = fs.readFileSync(result.path);
    
    // 删除临时文件
    fs.unlinkSync(result.path);
    
    // 设置响应头
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    
    // 发送文件内容
    res.send(fileBuffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '图片压缩失败'
    });
  }
});

// 图片裁剪
router.post('/crop', upload.single('image'), async (req, res) => {
  try {
    const result = await cropImage(req.file, req.body);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '图片裁剪失败'
    });
  }
});

// 添加水印
router.post('/watermark', upload.single('image'), async (req, res) => {
  try {
    const result = await addWatermark(req.file, req.body);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '添加水印失败'
    });
  }
});

module.exports = router; 