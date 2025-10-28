#!/bin/bash

# 部署到 minnasu-any1.devcloud.woa.com 的专用脚本

SERVER_HOST="minnasu-any1.devcloud.woa.com"
SERVER_USER="root"  # 根据实际情况修改
DEPLOY_PATH="/opt/ai-answer-book"
LOCAL_PACKAGE="deploy-package"

echo "🚀 部署AI答案之书到 $SERVER_HOST"
echo "📍 目标API: https://hunyuanapi.woa.com/openapi/v1/chat/completions"
echo "🔄 通过代理: https://$SERVER_HOST/api/openapi/v1/chat/completions"
echo ""

# 检查部署包
if [ ! -d "$LOCAL_PACKAGE" ]; then
    echo "❌ 错误: 未找到部署包 '$LOCAL_PACKAGE'"
    exit 1
fi

# 检查服务器连接
echo "🔍 检查服务器连接..."
if ! ssh -o ConnectTimeout=10 $SERVER_USER@$SERVER_HOST "echo 'SSH连接成功'" 2>/dev/null; then
    echo "❌ 无法连接到服务器，请检查:"
    echo "  1. 服务器地址: $SERVER_HOST"
    echo "  2. SSH配置和密钥"
    echo "  3. 网络连接"
    exit 1
fi

echo "✅ 服务器连接正常"

# 停止现有服务
echo "⏹️  停止现有服务..."
ssh $SERVER_USER@$SERVER_HOST "pkill -f 'node server.js' || true"

# 创建部署目录
echo "📁 准备部署目录..."
ssh $SERVER_USER@$SERVER_HOST "mkdir -p $DEPLOY_PATH && cd $DEPLOY_PATH && rm -rf *"

# 上传文件
echo "📤 上传部署包..."
rsync -avz --progress --delete $LOCAL_PACKAGE/ $SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/

if [ $? -ne 0 ]; then
    echo "❌ 文件上传失败"
    exit 1
fi

echo "✅ 文件上传完成"

# 远程部署
echo "🔧 在服务器上安装和启动..."
ssh $SERVER_USER@$SERVER_HOST << EOF
cd $DEPLOY_PATH

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 服务器未安装Node.js，请先安装 Node.js >= 16.0.0"
    exit 1
fi

echo "Node.js版本: \$(node -v)"

# 安装依赖
echo "📦 安装依赖..."
npm install --production

if [ \$? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

# 启动服务
echo "🚀 启动服务..."
nohup node server.js > app.log 2>&1 &

# 等待启动
sleep 5

# 检查服务状态
if pgrep -f "node server.js" > /dev/null; then
    echo "✅ 服务启动成功！"
    echo ""
    echo "🌐 访问地址:"
    echo "  主页: https://$SERVER_HOST/"
    echo "  健康检查: https://$SERVER_HOST/health"
    echo "  API状态: https://$SERVER_HOST/api-status"
    echo ""
    echo "📊 服务信息:"
    echo "  进程ID: \$(pgrep -f 'node server.js')"
    echo "  日志文件: $DEPLOY_PATH/app.log"
    echo ""
    echo "📋 管理命令:"
    echo "  查看日志: ssh $SERVER_USER@$SERVER_HOST 'tail -f $DEPLOY_PATH/app.log'"
    echo "  重启服务: ssh $SERVER_USER@$SERVER_HOST 'cd $DEPLOY_PATH && pkill -f \"node server.js\" && nohup node server.js > app.log 2>&1 &'"
    echo "  停止服务: ssh $SERVER_USER@$SERVER_HOST 'pkill -f \"node server.js\"'"
else
    echo "❌ 服务启动失败，查看日志:"
    tail -20 app.log
    exit 1
fi
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 部署完成！"
    echo "🌐 你的AI答案之书现在运行在: https://$SERVER_HOST/"
    echo ""
    echo "🔧 API配置:"
    echo "  前端调用: https://$SERVER_HOST/api/openapi/v1/chat/completions"
    echo "  代理目标: https://hunyuanapi.woa.com/openapi/v1/chat/completions"
    echo "  CORS: 已解决 ✅"
else
    echo "❌ 部署失败"
    exit 1
fi