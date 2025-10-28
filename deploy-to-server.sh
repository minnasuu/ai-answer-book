#!/bin/bash

# AI答案之书 - 云服务器部署脚本
# 目标服务器: minnasu-any1.devcloud.woa.com

SERVER_HOST="minnasu-any1.devcloud.woa.com"
SERVER_USER="root"  # 根据实际情况修改用户名
DEPLOY_PATH="/opt/ai-answer-book"  # 服务器部署路径
LOCAL_PACKAGE="deploy-package"

echo "🚀 开始部署AI答案之书到云服务器..."
echo "📍 目标服务器: $SERVER_HOST"
echo "📁 部署路径: $DEPLOY_PATH"
echo ""

# 检查本地部署包是否存在
if [ ! -d "$LOCAL_PACKAGE" ]; then
    echo "❌ 错误: 未找到部署包目录 '$LOCAL_PACKAGE'"
    echo "请先运行构建命令生成部署包"
    exit 1
fi

# 检查SSH连接
echo "🔍 检查服务器连接..."
if ! ssh -o ConnectTimeout=10 $SERVER_USER@$SERVER_HOST "echo '连接成功'" 2>/dev/null; then
    echo "❌ 错误: 无法连接到服务器 $SERVER_HOST"
    echo "请检查:"
    echo "  1. 服务器地址是否正确"
    echo "  2. SSH密钥是否配置"
    echo "  3. 网络连接是否正常"
    exit 1
fi

echo "✅ 服务器连接正常"

# 创建部署目录
echo "📁 创建部署目录..."
ssh $SERVER_USER@$SERVER_HOST "mkdir -p $DEPLOY_PATH"

# 停止现有服务（如果存在）
echo "⏹️  停止现有服务..."
ssh $SERVER_USER@$SERVER_HOST "pkill -f 'node server.js' || true"

# 上传文件
echo "📤 上传部署包..."
rsync -avz --progress $LOCAL_PACKAGE/ $SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/

if [ $? -ne 0 ]; then
    echo "❌ 文件上传失败"
    exit 1
fi

echo "✅ 文件上传完成"

# 远程安装依赖和启动服务
echo "🔧 安装依赖并启动服务..."
ssh $SERVER_USER@$SERVER_HOST << 'EOF'
cd /opt/ai-answer-book

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 服务器未安装Node.js"
    echo "请先安装Node.js (>=16.0.0)"
    exit 1
fi

echo "📦 安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "🚀 启动服务..."
# 使用nohup后台启动
nohup node server.js > app.log 2>&1 &

# 等待服务启动
sleep 3

# 检查服务状态
if pgrep -f "node server.js" > /dev/null; then
    echo "✅ 服务启动成功！"
    echo "📍 访问地址: https://minnasu-any1.devcloud.woa.com/"
    echo "🔗 健康检查: https://minnasu-any1.devcloud.woa.com/health"
    echo "📊 查看日志: tail -f /opt/ai-answer-book/app.log"
else
    echo "❌ 服务启动失败，请查看日志:"
    tail -20 app.log
    exit 1
fi
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 部署完成！"
    echo "🌐 访问地址: https://$SERVER_HOST/"
    echo "🔍 健康检查: https://$SERVER_HOST/health"
    echo ""
    echo "📋 常用命令:"
    echo "  查看日志: ssh $SERVER_USER@$SERVER_HOST 'tail -f $DEPLOY_PATH/app.log'"
    echo "  重启服务: ssh $SERVER_USER@$SERVER_HOST 'cd $DEPLOY_PATH && pkill -f \"node server.js\" && nohup node server.js > app.log 2>&1 &'"
    echo "  停止服务: ssh $SERVER_USER@$SERVER_HOST 'pkill -f \"node server.js\"'"
else
    echo "❌ 部署失败，请检查错误信息"
    exit 1
fi