# 手动部署到 minnasu-any1.devcloud.woa.com 说明

## 部署文件
已生成部署压缩包：`ai-answer-book-deploy.tar.gz`

## 部署步骤

### 1. 上传文件到服务器
```bash
# 上传压缩包到服务器
scp ai-answer-book-deploy.tar.gz root@minnasu-any1.devcloud.woa.com:/opt/

# 或者使用其他方式上传到服务器的 /opt/ 目录
```

### 2. 在服务器上解压和部署
```bash
# SSH登录到服务器
ssh root@minnasu-any1.devcloud.woa.com

# 创建部署目录
mkdir -p /opt/ai-answer-book
cd /opt/ai-answer-book

# 解压文件
tar -xzf /opt/ai-answer-book-deploy.tar.gz

# 安装依赖
npm install --production

# 停止现有服务（如果有）
pkill -f "node server.js" || true

# 启动服务
nohup node server.js > app.log 2>&1 &

# 检查服务状态
ps aux | grep "node server.js"
```

### 3. 验证部署
访问以下地址验证部署是否成功：

- **主页**: https://minnasu-any1.devcloud.woa.com/ai-answer-book/
- **健康检查**: https://minnasu-any1.devcloud.woa.com/ai-answer-book/health
- **API状态**: https://minnasu-any1.devcloud.woa.com/ai-answer-book/api-status

### 4. 服务管理命令

```bash
# 查看日志
tail -f /opt/ai-answer-book/app.log

# 重启服务
cd /opt/ai-answer-book
pkill -f "node server.js"
nohup node server.js > app.log 2>&1 &

# 停止服务
pkill -f "node server.js"
```

## 配置说明

- **服务端口**: 3000
- **部署路径**: `/ai-answer-book/`
- **API代理**: `/ai-answer-book/api/` -> `https://hunyuanapi.woa.com/`
- **静态文件**: 前端构建文件通过 `/ai-answer-book/` 路径访问

## 注意事项

1. 确保服务器已安装 Node.js (>= 16.0.0)
2. 确保端口 3000 可以访问
3. 如果使用 nginx 反向代理，需要配置子路径转发
4. 检查防火墙设置，确保端口开放

## 故障排除

如果遇到问题，请检查：
1. 服务器日志：`tail -f /opt/ai-answer-book/app.log`
2. 进程状态：`ps aux | grep "node server.js"`
3. 端口占用：`netstat -tlnp | grep 3000`
4. API连通性：访问健康检查端点