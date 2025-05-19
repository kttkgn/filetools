# FileTools - 文件转换工具

一个功能强大的在线文件转换和图片处理工具。

## 功能特点

- 支持多种文件格式转换
- 图片压缩、裁剪、水印等处理
- 批量处理功能
- 在线预览
- 安全可靠的文件处理

## 技术栈

### 前端
- React 18
- Ant Design 5
- React Router 6
- Axios
- Styled Components

### 后端
- Node.js
- Express
- Multer
- Sharp
- PDFKit

## 快速开始

### 开发环境

1. 克隆项目
```bash
git clone [项目地址]
cd file-tools
```

2. 安装依赖
```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

3. 启动开发服务器
```bash
# 启动前端开发服务器
cd frontend
npm start

# 启动后端开发服务器
cd ../backend
npm run dev
```

### 生产环境部署

1. 构建前端
```bash
cd frontend
npm run build
```

2. 启动后端服务
```bash
cd backend
npm run start
```

## 项目结构

```
file-tools/
├── frontend/          # 前端项目
├── backend/           # 后端项目
├── docker-compose.yml # Docker编排配置
├── nginx.conf        # Nginx配置
└── deploy.sh         # 部署脚本
```

## 环境要求

- Node.js >= 16
- npm >= 8
- Docker (可选)
- Nginx (可选)

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

