# 使用Node.js官方镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 创建上传目录
RUN mkdir -p uploads

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3004

# 暴露端口
EXPOSE 3004

# 启动命令
CMD ["npm", "start"] 