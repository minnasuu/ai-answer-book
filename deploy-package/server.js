const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5173;

// 启用CORS - 允许所有来源（生产环境可以限制具体域名）
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务 - 服务前端构建文件
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1d',
  etag: true,
  setHeaders: (res, path) => {
    // 确保JavaScript文件的MIME类型正确
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
    if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
  }
}));

// API代理配置
const proxyOptions = {
  target: 'https://hunyuanapi.woa.com',
  changeOrigin: true,
  secure: true,
  timeout: 30000,
  pathRewrite: {
    '^/api': '' // 移除/api前缀
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[${new Date().toISOString()}] 代理请求: ${req.method} ${req.url} -> ${proxyOptions.target}${req.url.replace('/api', '')}`);
    
    // 确保Content-Type正确设置
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[${new Date().toISOString()}] 代理响应: ${proxyRes.statusCode} ${req.url}`);
    
    // 设置CORS头
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
  },
  onError: (err, req, res) => {
    console.error(`[${new Date().toISOString()}] 代理错误:`, err.message);
    res.status(500).json({ 
      error: '代理服务器错误', 
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

// 处理预检请求
app.options('/api/*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// 设置API代理中间件
app.use('/api', createProxyMiddleware(proxyOptions));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'AI答案之书',
    proxy_target: 'https://hunyuanapi.woa.com'
  });
});

// API状态检查
app.get('/api-status', (req, res) => {
  res.json({
    api_proxy: '/api/openapi/v1/chat/completions',
    target: 'https://hunyuanapi.woa.com/openapi/v1/chat/completions',
    cors_enabled: true,
    timestamp: new Date().toISOString()
  });
});

// SPA路由处理 - 所有其他请求返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AI答案之书服务器启动成功！`);
  console.log(`📍 服务地址: http://0.0.0.0:${PORT}`);
  console.log(`🌐 代理目标: https://hunyuanapi.woa.com`);
  console.log(`🔗 健康检查: http://0.0.0.0:${PORT}/health`);
  console.log(`📊 API状态: http://0.0.0.0:${PORT}/api-status`);
  console.log(`❌ 按Ctrl+C停止服务器`);
});