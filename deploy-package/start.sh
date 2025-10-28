#!/bin/bash

echo "🚀 启动AI答案之书完整服务..."

# 检查Node.js版本
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js (>=16.0.0)"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ 错误: Node.js版本过低，需要>=16.0.0，当前版本: $(node -v)"
    exit 1
fi

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装服务器依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
fi

# 检查前端文件
if [ ! -d "dist" ]; then
    echo "❌ 错误: 未找到前端构建文件(dist目录)"
    echo "请确保已经运行了前端构建命令"
    exit 1
fi

# 设置环境变量
export NODE_ENV=production
export PORT=${PORT:-5173}

echo "✅ 环境检查完成"
echo "📁 前端文件: ./dist"
echo "🔗 API代理: /api -> https://hunyuanapi.woa.com"
echo "🌐 服务端口: $PORT"
echo ""

# 启动服务器
echo "🎯 启动服务器..."
node server.js