# AI答案之书 - 云服务器部署包

## 📦 部署包内容

```
deploy-package/
├── server.js          # Node.js服务器（包含API代理和静态文件服务）
├── package.json       # 服务器依赖配置
├── start.sh          # 启动脚本
├── dist/             # 前端构建文件
│   ├── index.html
│   ├── assets/
│   └── ...
└── README.md         # 本文档
```

## 🚀 部署步骤

### 1. 上传文件到云服务器
将整个 `deploy-package` 目录上传到你的云服务器 `minnasu-any1.devcloud.woa.com`

### 2. 安装Node.js环境
确保服务器已安装Node.js (>=16.0.0)：
```bash
# 检查Node.js版本
node -v

# 如果未安装，可以使用以下命令安装
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. 启动服务
```bash
cd deploy-package
./start.sh
```

或者手动启动：
```bash
cd deploy-package
npm install
node server.js
```

## 🌐 服务配置

### 端口配置
- 默认端口: `5173`
- 自定义端口: `PORT=8080 node server.js`

### 服务功能
- ✅ **前端服务**: 提供React应用的静态文件服务
- ✅ **API代理**: 解决CORS跨域问题，代理混元API请求
- ✅ **SPA路由**: 支持React Router的前端路由
- ✅ **健康检查**: `/health` 端点用于监控服务状态

### API端点
- **前端应用**: `https://minnasu-any1.devcloud.woa.com/`
- **健康检查**: `https://minnasu-any1.devcloud.woa.com/health`
- **API状态**: `https://minnasu-any1.devcloud.woa.com/api-status`
- **混元API代理**: `https://minnasu-any1.devcloud.woa.com/api/openapi/v1/chat/completions`

## 🔧 Nginx配置（可选）

如果使用Nginx作为反向代理，可以使用以下配置：

```nginx
server {
    listen 80;
    server_name minnasu-any1.devcloud.woa.com;
    
    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name minnasu-any1.devcloud.woa.com;
    
    # SSL证书配置
    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/key.pem;
    
    # 代理到Node.js应用
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔍 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查看端口占用
   lsof -i :5173
   # 或使用其他端口
   PORT=8080 node server.js
   ```

2. **权限问题**
   ```bash
   chmod +x start.sh
   ```

3. **依赖安装失败**
   ```bash
   # 清理缓存重新安装
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **API调用失败**
   - 检查网络连接到 `hunyuanapi.woa.com`
   - 验证API密钥是否正确
   - 查看服务器日志获取详细错误信息

### 日志查看
```bash
# 启动时会显示实时日志
node server.js

# 后台运行并保存日志
nohup node server.js > app.log 2>&1 &

# 查看日志
tail -f app.log
```

## 📊 监控和维护

### 进程管理（推荐使用PM2）
```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name "ai-answer-book"

# 查看状态
pm2 status

# 查看日志
pm2 logs ai-answer-book

# 重启应用
pm2 restart ai-answer-book
```

### 健康检查
```bash
# 检查服务状态
curl https://minnasu-any1.devcloud.woa.com/health

# 检查API代理状态
curl https://minnasu-any1.devcloud.woa.com/api-status
```

## 🎯 部署完成

部署成功后，你可以通过以下地址访问：
- **AI答案之书应用**: https://minnasu-any1.devcloud.woa.com/
- **健康检查**: https://minnasu-any1.devcloud.woa.com/health

现在你的AI答案之书项目已经完全部署到云服务器，包含了前端应用和API代理服务，完美解决了CORS跨域问题！