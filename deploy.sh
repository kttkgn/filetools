#!/bin/bash

# 设置错误时退出
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 打印带颜色的信息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 未安装"
        exit 1
    fi
}

# 检查必要的命令
check_command docker
check_command docker-compose
check_command git

# 拉取最新代码
print_info "拉取最新代码..."
git pull origin main

# 构建前端
print_info "构建前端..."
cd frontend
npm install
npm run build
cd ..

# 构建后端
print_info "构建后端..."
cd backend
npm install
cd ..

# 停止并删除旧容器
print_info "停止旧容器..."
docker-compose down

# 构建新镜像
print_info "构建新镜像..."
docker-compose build

# 启动新容器
print_info "启动新容器..."
docker-compose up -d

# 清理未使用的镜像
print_info "清理未使用的镜像..."
docker image prune -f

print_info "部署完成！"
print_info "前端地址: http://localhost"
print_info "后端地址: http://localhost:3004" 