const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fileRoutes = require('./routes/fileRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());

// 限流配置
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
});
app.use(limiter);

// 静态文件服务
app.use('/temp', express.static(path.join(__dirname, '../temp')));

// 路由配置
app.use('/api', fileRoutes);
app.use('/api/convert', fileRoutes);
app.use('/api/image', imageRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 