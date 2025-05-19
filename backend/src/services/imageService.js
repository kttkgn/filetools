const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

// 支持的图片格式
const SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png', 'webp'];

// 创建临时目录
const TEMP_DIR = path.join(__dirname, '../../temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// 生成唯一文件名
const generateUniqueFilename = (originalName, suffix) => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  return `${timestamp}-${randomStr}-${nameWithoutExt}-${suffix}${ext}`;
};

// 图片压缩
const compressImage = async (file, quality) => {
  try {
    if (!file || !file.buffer) {
      throw new Error('无效的文件数据');
    }

    // 将 quality 转换为整数
    const qualityInt = parseInt(quality);
    if (isNaN(qualityInt) || qualityInt < 0 || qualityInt > 100) {
      throw new Error('无效的压缩质量参数');
    }

    const outputFilename = generateUniqueFilename(file.originalname, 'compressed');
    const outputPath = path.join(TEMP_DIR, outputFilename);

    // 获取原始图片格式
    const image = sharp(file.buffer);
    const metadata = await image.metadata();
    const format = metadata.format;

    // 根据原始格式进行压缩
    if (format === 'png') {
      await image
        .png({ quality: qualityInt })
        .toFile(outputPath);
    } else if (format === 'webp') {
      await image
        .webp({ quality: qualityInt })
        .toFile(outputPath);
    } else {
      // 默认使用 jpeg
      await image
        .jpeg({ quality: qualityInt })
        .toFile(outputPath);
    }

    return {
      filename: outputFilename,
      path: outputPath
    };
  } catch (error) {
    console.error('图片压缩错误:', error);
    throw new Error('图片压缩失败');
  }
};

// 图片裁剪
const cropImage = async (file, cropParams) => {
  try {
    if (!file || !file.buffer) {
      throw new Error('无效的文件数据');
    }

    if (!cropParams || !cropParams.width || !cropParams.height) {
      throw new Error('无效的裁剪参数');
    }

    const { width, height, left = 0, top = 0 } = cropParams;
    
    const outputFilename = generateUniqueFilename(file.originalname, 'cropped');
    const outputPath = path.join(TEMP_DIR, outputFilename);

    await sharp(file.buffer)
      .extract({
        left: Math.max(0, Math.floor(left)),
        top: Math.max(0, Math.floor(top)),
        width: Math.max(1, Math.floor(width)),
        height: Math.max(1, Math.floor(height))
      })
      .toFile(outputPath);

    return {
      filename: outputFilename,
      path: outputPath
    };
  } catch (error) {
    console.error('图片裁剪错误:', error);
    throw new Error('图片裁剪失败');
  }
};

// 添加水印
const addWatermark = async (file, watermarkParams) => {
  try {
    if (!file || !file.buffer) {
      throw new Error('无效的文件数据');
    }

    if (!watermarkParams || !watermarkParams.text) {
      throw new Error('无效的水印参数');
    }

    const { text, position = 'center', opacity = 0.5 } = watermarkParams;
    
    // 获取图片信息
    const imageInfo = await sharp(file.buffer).metadata();
    const { width, height } = imageInfo;

    // 创建水印文本
    const svgText = `
      <svg width="${width}" height="${height}">
        <style>
          .watermark {
            font-family: Arial, sans-serif;
            font-size: ${Math.min(width, height) / 20}px;
            fill: #000000;
            fill-opacity: ${opacity};
          }
        </style>
        <text
          x="50%"
          y="50%"
          text-anchor="middle"
          dominant-baseline="middle"
          class="watermark"
        >${text}</text>
      </svg>
    `;

    const outputFilename = generateUniqueFilename(file.originalname, 'watermarked');
    const outputPath = path.join(TEMP_DIR, outputFilename);

    // 添加水印
    await sharp(file.buffer)
      .composite([{
        input: Buffer.from(svgText),
        gravity: position
      }])
      .toFile(outputPath);

    return {
      filename: outputFilename,
      path: outputPath
    };
  } catch (error) {
    console.error('添加水印错误:', error);
    throw new Error('添加水印失败');
  }
};

module.exports = {
  compressImage,
  cropImage,
  addWatermark,
  SUPPORTED_FORMATS
}; 