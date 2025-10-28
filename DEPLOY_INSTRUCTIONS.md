# 🚀 部署到 minnasu-any1.devcloud.woa.com

## 📋 配置说明

你的项目现在已经正确配置为：
- **前端调用**: `https://minnasu-any1.devcloud.woa.com/api/openapi/v1/chat/completions`
- **代理目标**: `https://hunyuanapi.woa.com/openapi/v1/chat/completions`
- **CORS解决**: 通过Node.js代理服务器

## 🎯 一键部署

```bash
./deploy-to-minnasu.sh
```

## 📋 手动部署步骤

如果自动脚本有问题，可以手动执行：

### 1. 上传文件
```bash
scp -r deploy-package/ root@minnasu-any1.devcloud.woa.com:/opt/ai-answer-book/
```

### 2. 登录服务器并启动
```bash
ssh root@minnasu-any1.devcloud.woa.com
cd /opt/ai-answer-book
npm install
nohup node server.js > app.log 2>&1 &
```

### 3. 验证部署
```bash
# 检查服务状态
curl https://minnasu-any1.devcloud.woa.com/health

# 查看日志
tail -f /opt/ai-answer-book/app.log
```

## 🌐 访问地址

部署成功后：
- **主页**: https://minnasu-any1.devcloud.woa.com/
- **健康检查**: https://minnasu-any1.devcloud.woa.com/health
- **API状态**: https://minnasu-any1.devcloud.woa.com/api-status

## 🔧 服务管理

```bash
# 查看服务状态
ssh root@minnasu-any1.devcloud.woa.com 'pgrep -f "node server.js"'

# 查看日志
ssh root@minnasu-any1.devcloud.woa.com 'tail -f /opt/ai-answer-book/app.log'

# 重启服务
ssh root@minnasu-any1.devcloud.woa.com 'cd /opt/ai-answer-book && pkill -f "node server.js" && nohup node server.js > app.log 2>&1 &'

# 停止服务
ssh root@minnasu-any1.devcloud.woa.com 'pkill -f "node server.js"'
```

## ✅ 部署检查清单

- [ ] 服务器已安装Node.js (>=16.0.0)
- [ ] SSH访问配置正确
- [ ] 端口5173开放或配置Nginx代理
- [ ] 网络可访问 hunyuanapi.woa.com
- [ ] SSL证书配置（如需HTTPS）

现在执行 `./deploy-to-minnasu.sh` 开始部署！