const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const pdf = require('html-pdf');
const pdfParse = require('pdf-parse');
const PDFDocument = require('pdfkit');
const sharp = require('sharp');
const mammoth = require('mammoth');
const { Document, Paragraph, Packer, TextRun } = require('docx');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

// 支持的格式
const SUPPORTED_FORMATS = {
  'pdf': ['txt', 'docx', 'html'],
  'txt': ['pdf', 'docx', 'html'],
  'docx': ['pdf', 'txt', 'html'],
  'html': ['pdf', 'txt', 'docx'],
  'jpg': ['png', 'webp', 'gif'],
  'jpeg': ['png', 'webp', 'gif'],
  'png': ['jpg', 'webp', 'gif'],
  'webp': ['jpg', 'png', 'gif'],
  'gif': ['jpg', 'png', 'webp']
};

// 创建临时目录
const TEMP_DIR = path.join(__dirname, '../../temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// 生成唯一文件名
const generateUniqueFilename = (originalName, targetFormat) => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  return `${timestamp}-${randomStr}-${nameWithoutExt}.${targetFormat}`;
};

// 文件转换服务
const convertFile = async (file, targetFormat) => {
  try {
    if (!file || !file.buffer) {
      throw new Error('无效的文件数据');
    }

    if (!targetFormat) {
      throw new Error('未指定目标格式');
    }

    const originalFormat = path.extname(file.originalname).toLowerCase().slice(1);
    
    // 检查格式支持
    if (!SUPPORTED_FORMATS[originalFormat] || !SUPPORTED_FORMATS[originalFormat].includes(targetFormat)) {
      throw new Error(`不支持从 ${originalFormat} 转换到 ${targetFormat}`);
    }

    // 根据转换类型处理
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(originalFormat) && 
        ['jpg', 'png', 'webp', 'gif'].includes(targetFormat)) {
      return await convertImage(file.buffer, targetFormat);
    }

    // 文档转换
    if (originalFormat === 'pdf') {
      if (targetFormat === 'txt') return await convertPdfToTxt(file.buffer);
      if (targetFormat === 'docx') return await convertPdfToDocx(file.buffer);
      if (targetFormat === 'html') return await convertPdfToHtml(file.buffer);
    }

    if (originalFormat === 'txt') {
      if (targetFormat === 'pdf') return await convertTxtToPdf(file.buffer);
      if (targetFormat === 'docx') return await convertTxtToDocx(file.buffer);
      if (targetFormat === 'html') return await convertTxtToHtml(file.buffer);
    }

    if (originalFormat === 'docx') {
      if (targetFormat === 'pdf') return await convertDocxToPdf(file.buffer);
      if (targetFormat === 'txt') return await convertDocxToTxt(file.buffer);
      if (targetFormat === 'html') return await convertDocxToHtml(file.buffer);
    }

    if (originalFormat === 'html') {
      if (targetFormat === 'pdf') return await convertHtmlToPdf(file.buffer);
      if (targetFormat === 'txt') return await convertHtmlToTxt(file.buffer);
      if (targetFormat === 'docx') return await convertHtmlToDocx(file.buffer);
    }

    throw new Error('不支持的转换类型');
  } catch (error) {
    console.error('文件转换错误:', error);
    throw error;
  }
};

// PDF转TXT
const convertPdfToTxt = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return Buffer.from(data.text);
  } catch (error) {
    console.error('PDF转TXT错误:', error);
    throw new Error('PDF转TXT失败');
  }
};

// PDF转DOCX
const convertPdfToDocx = async (buffer) => {
  try {
    // 使用 pdf-parse 提取文本内容
    const data = await pdfParse(buffer);
    const text = data.text;

    // 创建新的 DOCX 文档
    const doc = new Document({
      sections: [{
        properties: {},
        children: text.split('\n')
          .filter(line => line.trim()) // 过滤空行
          .map(line => new Paragraph({
            children: [new TextRun(line.trim())],
          })),
      }],
    });

    // 将文档转换为 Buffer
    const docBuffer = await Packer.toBuffer(doc);
    return docBuffer;
  } catch (error) {
    console.error('PDF转DOCX错误:', error);
    throw new Error('PDF转DOCX失败');
  }
};

// PDF转HTML
const convertPdfToHtml = async (buffer) => {
  try {
    const text = await convertPdfToTxt(buffer);
    return await convertTxtToHtml(text);
  } catch (error) {
    console.error('PDF转HTML错误:', error);
    throw new Error('PDF转HTML失败');
  }
};

// TXT转PDF
const convertTxtToPdf = async (buffer) => {
  return new Promise((resolve, reject) => {
    try {
      const chunks = [];
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        font: 'Times-Roman'
      });

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const text = buffer.toString('utf-8');
      doc.font('Times-Roman')
         .fontSize(12)
         .text(text, {
           align: 'left',
           features: ['traditional']
         });

      doc.end();
    } catch (error) {
      console.error('TXT转PDF错误:', error);
      reject(new Error('TXT转PDF失败'));
    }
  });
};

// TXT转DOCX
const convertTxtToDocx = async (buffer) => {
  try {
    const text = buffer.toString('utf-8');
    const html = `<html><body><p>${text}</p></body></html>`;
    return await convertHtmlToDocx(Buffer.from(html));
  } catch (error) {
    console.error('TXT转DOCX错误:', error);
    throw new Error('TXT转DOCX失败');
  }
};

// TXT转HTML
const convertTxtToHtml = async (buffer) => {
  try {
    const text = buffer.toString('utf-8');
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            padding: 20px;
          }
          pre {
            white-space: pre-wrap;
            word-wrap: break-word;
          }
        </style>
      </head>
      <body>
        <pre>${text}</pre>
      </body>
      </html>
    `;
    return Buffer.from(html);
  } catch (error) {
    console.error('TXT转HTML错误:', error);
    throw new Error('TXT转HTML失败');
  }
};

// DOCX转PDF
const convertDocxToPdf = async (buffer) => {
  try {
    const text = await convertDocxToTxt(buffer);
    return await convertTxtToPdf(text);
  } catch (error) {
    console.error('DOCX转PDF错误:', error);
    throw new Error('DOCX转PDF失败');
  }
};

// DOCX转TXT
const convertDocxToTxt = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return Buffer.from(result.value);
  } catch (error) {
    console.error('DOCX转TXT错误:', error);
    throw new Error('DOCX转TXT失败');
  }
};

// DOCX转HTML
const convertDocxToHtml = async (buffer) => {
  try {
    const result = await mammoth.convertToHtml({ buffer });
    return Buffer.from(result.value);
  } catch (error) {
    console.error('DOCX转HTML错误:', error);
    throw new Error('DOCX转HTML失败');
  }
};

// HTML转PDF
const convertHtmlToPdf = async (buffer) => {
  try {
    const text = await convertHtmlToTxt(buffer);
    return await convertTxtToPdf(text);
  } catch (error) {
    console.error('HTML转PDF错误:', error);
    throw new Error('HTML转PDF失败');
  }
};

// HTML转TXT
const convertHtmlToTxt = async (buffer) => {
  try {
    const html = buffer.toString('utf-8');
    // 简单的HTML到文本转换
    const text = html.replace(/<[^>]+>/g, '')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'");
    return Buffer.from(text);
  } catch (error) {
    console.error('HTML转TXT错误:', error);
    throw new Error('HTML转TXT失败');
  }
};

// HTML转DOCX
const convertHtmlToDocx = async (buffer) => {
  try {
    const text = await convertHtmlToTxt(buffer);
    return await convertTxtToDocx(text);
  } catch (error) {
    console.error('HTML转DOCX错误:', error);
    throw new Error('HTML转DOCX失败');
  }
};

// 图片格式转换
const convertImage = async (buffer, targetFormat) => {
  try {
    const image = sharp(buffer);
    const outputBuffer = await image.toFormat(targetFormat).toBuffer();
    return outputBuffer;
  } catch (error) {
    console.error('图片转换错误:', error);
    throw new Error('图片转换失败');
  }
};

module.exports = {
  convertFile,
  SUPPORTED_FORMATS
}; 