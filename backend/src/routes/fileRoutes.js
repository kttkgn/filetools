const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { convertFile, SUPPORTED_FORMATS } = require('../services/fileService');
const { compressImage, cropImage, addWatermark, SUPPORTED_FORMATS: SUPPORTED_IMAGE_FORMATS } = require('../services/imageService');

// 配置 multer 使用内存存储
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 限制文件大小为 10MB
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (SUPPORTED_FORMATS[ext] || SUPPORTED_IMAGE_FORMATS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件格式'));
    }
  }
});

// 文件转换路由
router.post('/convert', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请选择要转换的文件' });
    }

    if (!req.body.targetFormat) {
      return res.status(400).json({ error: '请指定目标格式' });
    }

    const fileBuffer = await convertFile(req.file, req.body.targetFormat);
    
    // 设置响应头
    res.setHeader('Content-Type', getContentType(req.body.targetFormat));
    res.setHeader('Content-Disposition', `attachment; filename="converted.${req.body.targetFormat}"`);
    
    // 发送文件内容
    res.send(fileBuffer);
  } catch (error) {
    console.error('文件转换错误:', error);
    res.status(500).json({ error: error.message || '文件转换失败' });
  }
});

// 图片压缩路由
router.post('/compress', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请选择要压缩的图片' });
    }

    const quality = parseInt(req.body.quality) || 80;
    const result = await compressImage(req.file, quality);
    
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
    console.error('图片压缩错误:', error);
    res.status(500).json({ error: error.message || '图片压缩失败' });
  }
});

// 图片裁剪路由
router.post('/crop', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请选择要裁剪的图片' });
    }

    const cropParams = {
      width: parseInt(req.body.width),
      height: parseInt(req.body.height),
      left: parseInt(req.body.left) || 0,
      top: parseInt(req.body.top) || 0
    };

    if (!cropParams.width || !cropParams.height) {
      return res.status(400).json({ error: '请指定裁剪尺寸' });
    }

    const result = await cropImage(req.file, cropParams);
    
    // 读取裁剪后的文件
    const fileBuffer = fs.readFileSync(result.path);
    
    // 删除临时文件
    fs.unlinkSync(result.path);
    
    // 设置响应头
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    
    // 发送文件内容
    res.send(fileBuffer);
  } catch (error) {
    console.error('图片裁剪错误:', error);
    res.status(500).json({ error: error.message || '图片裁剪失败' });
  }
});

// 添加水印路由
router.post('/watermark', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请选择要添加水印的图片' });
    }

    if (!req.body.text) {
      return res.status(400).json({ error: '请输入水印文字' });
    }

    const watermarkParams = {
      text: req.body.text,
      position: req.body.position || 'center',
      opacity: parseFloat(req.body.opacity) || 0.5
    };

    const result = await addWatermark(req.file, watermarkParams);
    
    // 读取添加水印后的文件
    const fileBuffer = fs.readFileSync(result.path);
    
    // 删除临时文件
    fs.unlinkSync(result.path);
    
    // 设置响应头
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    
    // 发送文件内容
    res.send(fileBuffer);
  } catch (error) {
    console.error('添加水印错误:', error);
    res.status(500).json({ error: error.message || '添加水印失败' });
  }
});

// 获取内容类型
function getContentType(format) {
  const contentTypes = {
    'pdf': 'application/pdf',
    'txt': 'text/plain',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp'
  };
  return contentTypes[format] || 'application/octet-stream';
}

module.exports = router; 