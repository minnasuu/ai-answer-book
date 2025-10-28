#!/bin/bash

echo "🚀 启动AI答案之书CORS代理服务器..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

# 进入代理服务器目录
cd cors-proxy

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装代理服务器依赖..."
    npm install
fi

# 启动代理服务器
echo "🌐 启动代理服务器在端口3001..."
echo "📍 代理目标: https://hunyuanapi.woa.com"
echo "🔗 本地访问: http://localhost:3001"
echo "❌ 按Ctrl+C停止服务器"
echo ""

npm start