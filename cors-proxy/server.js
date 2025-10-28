const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// 启用CORS
app.use(cors({
  origin: ['https://ui.tad.woa.com', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// 解析JSON请求体
app.use(express.json());

// 代理配置
const proxyOptions = {
  target: 'https://hunyuanapi.woa.com',
  changeOrigin: true,
  secure: true,
  pathRewrite: {
    '^/api': '' // 移除/api前缀
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`代理请求: ${req.method} ${req.url} -> ${proxyOptions.target}${req.url}`);
    
    // 确保Content-Type正确设置
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`代理响应: ${proxyRes.statusCode} ${req.url}`);
    
    // 设置CORS头
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
  },
  onError: (err, req, res) => {
    console.error('代理错误:', err);
    res.status(500).json({ error: '代理服务器错误', details: err.message });
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

// 设置代理中间件
app.use('/api', createProxyMiddleware(proxyOptions));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`CORS代理服务器运行在端口 ${PORT}`);
  console.log(`代理目标: https://hunyuanapi.woa.com`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
});