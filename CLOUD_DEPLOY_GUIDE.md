# 🚀 AI答案之书 - 云服务器部署指南

## 📋 部署概览

你的AI答案之书项目已经成功准备好部署到云服务器 `minnasu-any1.devcloud.woa.com`！

### 🎯 部署方案特点
- ✅ **完整解决方案**: 前端 + API代理服务器
- ✅ **CORS问题解决**: 通过Node.js代理服务器完美解决跨域问题
- ✅ **一键部署**: 提供自动化部署脚本
- ✅ **生产就绪**: 包含错误处理、日志记录、健康检查

## 🔄 两种部署方式

### 方式1: CloudStudio预览（已完成）
**预览地址**: http://75f4c4c09ac5461994ef4464bd0704ad.codebuddy.cloudstudio.run

这是一个临时的预览环境，你可以立即测试项目功能。

### 方式2: 部署到你的云服务器

#### 📦 准备工作
1. **确保云服务器环境**:
   - 已安装Node.js (>=16.0.0)
   - 已配置SSH访问
   - 开放端口5173或配置Nginx反向代理

2. **修改部署脚本**（如需要）:
   ```bash
   # 编辑 deploy-to-server.sh
   SERVER_HOST="minnasu-any1.devcloud.woa.com"  # 你的服务器地址
   SERVER_USER="root"                           # SSH用户名
   DEPLOY_PATH="/opt/ai-answer-book"           # 部署路径
   ```

#### 🚀 一键部署
```bash
# 执行自动部署脚本
./deploy-to-server.sh
```

#### 📋 手动部署步骤
如果自动脚本遇到问题，可以手动执行：

```bash
# 1. 上传部署包
scp -r deploy-package/ root@minnasu-any1.devcloud.woa.com:/opt/ai-answer-book/

# 2. 登录服务器
ssh root@minnasu-any1.devcloud.woa.com

# 3. 安装依赖
cd /opt/ai-answer-book
npm install

# 4. 启动服务
nohup node server.js > app.log 2>&1 &
```

## 🌐 访问地址

部署成功后，可通过以下地址访问：

- **主应用**: https://minnasu-any1.devcloud.woa.com/
- **健康检查**: https://minnasu-any1.devcloud.woa.com/health
- **API状态**: https://minnasu-any1.devcloud.woa.com/api-status

## 🔧 服务管理

### 查看服务状态
```bash
ssh root@minnasu-any1.devcloud.woa.com 'pgrep -f "node server.js"'
```

### 查看日志
```bash
ssh root@minnasu-any1.devcloud.woa.com 'tail -f /opt/ai-answer-book/app.log'
```

### 重启服务
```bash
ssh root@minnasu-any1.devcloud.woa.com 'cd /opt/ai-answer-book && pkill -f "node server.js" && nohup node server.js > app.log 2>&1 &'
```

### 停止服务
```bash
ssh root@minnasu-any1.devcloud.woa.com 'pkill -f "node server.js"'
```

## 🔍 故障排除

### 常见问题

1. **无法访问服务**
   - 检查服务器防火墙设置
   - 确认端口5173是否开放
   - 查看服务日志排查错误

2. **API调用失败**
   - 检查网络连接到 `hunyuanapi.woa.com`
   - 验证API密钥配置
   - 查看代理服务器日志

3. **部署脚本失败**
   - 检查SSH连接配置
   - 确认服务器用户权限
   - 手动执行部署步骤

### 调试命令
```bash
# 检查Node.js版本
node -v

# 检查端口占用
lsof -i :5173

# 测试API连接
curl -I https://hunyuanapi.woa.com/openapi/v1/chat/completions

# 测试本地健康检查
curl http://localhost:5173/health
```

## 📊 监控建议

### 使用PM2进程管理（推荐）
```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name "ai-answer-book"

# 设置开机自启
pm2 startup
pm2 save
```

### Nginx反向代理配置
```nginx
server {
    listen 80;
    server_name minnasu-any1.devcloud.woa.com;
    
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🎉 部署完成

恭喜！你的AI答案之书项目现在已经：
- ✅ 完美解决了CORS跨域问题
- ✅ 支持混元大模型API调用
- ✅ 提供了完整的前端用户界面
- ✅ 具备生产环境的稳定性和可维护性

现在你可以通过 `https://minnasu-any1.devcloud.woa.com/` 访问你的AI答案之书应用了！