#!/usr/bin/env node

console.log('启动开发服务器...');
console.log('当前支持的功能:');
console.log('  - 数学工具函数 (add, subtract, multiply, divide)');
console.log('\n开发模式已就绪，等待文件变更...');

// 监听文件变更（简化版）
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

try {
  const watcher = fs.watch(path.join(__dirname, '..', 'src'), (eventType, filename) => {
    if (filename) {
      console.log(`[${new Date().toLocaleTimeString()}] ${filename} 已更新`);
    }
  });

  console.log('正在监听 src/ 目录...');

  // 保持进程运行
  process.on('SIGINT', () => {
    console.log('\n停止开发服务器');
    watcher.close();
    process.exit(0);
  });
} catch (error) {
  console.log('文件监听需要 chokidar 依赖，当前为简化版本');
  console.log('开发服务器已启动（无热重载）');
}
