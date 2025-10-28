# CORS 跨域问题解决方案

## 问题描述
部署到 `https://ui.tad.woa.com` 后，直接调用 `https://hunyuanapi.woa.com` 遇到CORS跨域限制：
```
Access to fetch at 'https://hunyuanapi.woa.com/openapi/v1/chat/completions' from origin 'https://ui.tad.woa.com' has been blocked by CORS policy
```

## 解决方案：代理服务器

### 1. 本地开发环境

#### 启动代理服务器
```bash
# 方法1: 使用启动脚本
./start-proxy.sh

# 方法2: 手动启动
cd cors-proxy
npm install
npm start
```

#### 启动前端项目
```bash
npm run dev
```

现在前端会通过 `http://localhost:3001/api/openapi/v1/chat/completions` 访问API。

### 2. 生产环境部署

#### 选项A: 部署代理服务器到云端
1. 将 `cors-proxy` 目录部署到云服务器
2. 修改 `.env.production` 中的 `VITE_HUNYUAN_API_URL` 为你的代理服务器地址
3. 构建并部署前端项目

#### 选项B: 使用现有的代理服务
如果你有现有的后端服务，可以在其中添加代理路由：

**Express.js 示例：**
```javascript
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use('/api/hunyuan', createProxyMiddleware({
  target: 'https://hunyuanapi.woa.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/hunyuan': ''
  }
}));
```

### 3. 配置说明

#### 环境变量配置
- **开发环境** (`.env.development`): 使用本地代理 `http://localhost:3001/api/openapi/v1/chat/completions`
- **生产环境** (`.env.production`): 使用云端代理 `https://your-proxy-domain.com/api/openapi/v1/chat/completions`

#### 代理服务器特性
- ✅ 解决CORS跨域问题
- ✅ 支持HTTPS到HTTPS的安全代理
- ✅ 自动处理预检请求(OPTIONS)
- ✅ 保持原始请求头和认证信息
- ✅ 错误处理和日志记录

### 4. 测试验证

#### 检查代理服务器状态
```bash
curl http://localhost:3001/health
```

#### 测试API代理
```bash
curl -X POST http://localhost:3001/api/openapi/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{"model":"hunyuan-turbos-latest","messages":[{"role":"user","content":"测试"}]}'
```

### 5. 部署检查清单

- [ ] 代理服务器正常运行
- [ ] 环境变量配置正确
- [ ] CORS头设置正确
- [ ] HTTPS证书配置(生产环境)
- [ ] 防火墙和安全组配置
- [ ] 域名解析配置

### 6. 故障排除

#### 常见问题
1. **代理服务器无法启动**: 检查端口是否被占用
2. **仍然有CORS错误**: 检查代理服务器的CORS配置
3. **API调用失败**: 检查目标API地址和认证信息
4. **网络超时**: 检查网络连接和防火墙设置

#### 调试命令
```bash
# 检查端口占用
lsof -i :3001

# 查看代理服务器日志
cd cors-proxy && npm start

# 测试网络连接
curl -I https://hunyuanapi.woa.com/openapi/v1/chat/completions
```

## 总结

通过代理服务器方案，我们成功解决了CORS跨域问题，使得前端应用可以安全地调用混元API。这个方案既适用于本地开发，也适用于生产环境部署。