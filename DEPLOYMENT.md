# 部署指南

## 部署到 https://ui.tad.woa.com/web/minna/ai-answer/

### 1. 构建项目

```bash
npm run build
```

构建完成后，会在 `dist` 目录生成静态文件。

### 2. 配置说明

#### 2.1 Base Path 配置
项目已配置 `base: '/web/minna/ai-answer/'`，所有资源路径会自动添加此前缀。

#### 2.2 API 请求配置
生产环境 API 请求路径：`/web/minna/ai-answer/api/openapi/v1/chat/completions`

这需要在服务器端配置反向代理，将此路径代理到混元 API。

### 3. Nginx 配置

参考 `nginx.conf.example` 文件，需要配置两个 location：

1. **静态文件服务**：`/web/minna/ai-answer/`
   - 指向构建后的 `dist` 目录
   - 支持 SPA 路由

2. **API 代理**：`/web/minna/ai-answer/api/`
   - 代理到 `http://hunyuanapi.woa.com/`
   - 处理跨域问题

### 4. 部署步骤

1. 将 `dist` 目录的内容上传到服务器
2. 配置 Nginx（参考 `nginx.conf.example`）
3. 重启 Nginx
4. 访问 `https://ui.tad.woa.com/web/minna/ai-answer/`

### 5. 环境变量（可选）

如果需要使用不同的 API 配置，可以在构建时设置环境变量：

```bash
# .env.production
VITE_HUNYUAN_API_URL=https://your-api-url.com/openapi/v1/chat/completions
VITE_HUNYUAN_API_KEY=your-api-key
VITE_HUNYUAN_MODEL=hunyuan-turbos-latest
```

然后构建：
```bash
npm run build
```

### 6. 验证部署

访问以下 URL 验证部署是否成功：
- 主页：`https://ui.tad.woa.com/web/minna/ai-answer/`
- 静态资源应正确加载
- AI 功能应正常工作

### 7. 故障排查

#### 7.1 资源 404
- 检查 `base` 配置是否正确
- 检查 Nginx `alias` 路径是否正确

#### 7.2 API 请求失败
- 检查 Nginx API 代理配置
- 检查混元 API 是否可访问
- 查看浏览器控制台和 Nginx 错误日志

#### 7.3 路由刷新 404
- 检查 Nginx `try_files` 配置
- 确保所有路由都回退到 `index.html`

### 8. 本地测试生产构建

```bash
# 构建
npm run build

# 预览（会在 http://localhost:4173/web/minna/ai-answer/ 启动）
npm run preview
```

注意：预览时 API 请求可能失败，因为没有代理配置。
