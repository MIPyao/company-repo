#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

// 创建 dist 目录
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 复制并构建文件
try {
  const files = fs.readdirSync(srcDir);

  files.forEach(file => {
    if (file.endsWith('.js')) {
      const srcFile = path.join(srcDir, file);
      const distFile = path.join(distDir, file);

      const content = fs.readFileSync(srcFile, 'utf8');
      fs.writeFileSync(distFile, content);

      console.log(`✓ 构建文件: ${file}`);
    }
  });

  console.log('\n构建完成！输出目录: dist/');
} catch (error) {
  console.error('构建失败:', error.message);
  process.exit(1);
}
