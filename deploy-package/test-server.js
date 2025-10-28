const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5173;

// 简单的静态文件服务
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    console.log('Serving file:', filePath);
    
    // 设置正确的MIME类型
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  }
}));

// SPA fallback
app.get('*', (req, res) => {
  console.log('Fallback for:', req.url);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 测试服务器启动在端口 ${PORT}`);
  console.log(`📁 静态文件目录: ${path.join(__dirname, 'dist')}`);
});