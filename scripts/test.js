#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

try {
  console.log('运行测试...\n');

  const testDir = path.join(__dirname, '..', 'tests');

  if (!fs.existsSync(testDir)) {
    console.log('没有测试目录，跳过测试。');
    process.exit(0);
  }

  const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith('.test.js') || f.endsWith('.spec.js'));

  if (testFiles.length === 0) {
    console.log('没有找到测试文件，跳过测试。');
    process.exit(0);
  }

  let passed = 0;
  let failed = 0;

  testFiles.forEach(file => {
    try {
      console.log(`运行测试: ${file}`);
      const testPath = path.join(testDir, file);
      require(testPath);
      passed++;
    } catch (error) {
      console.error(`✗ ${file} 测试失败:`, error.message);
      failed++;
    }
  });

  console.log(`\n测试结果: ${passed} 通过, ${failed} 失败`);

  if (failed > 0) {
    process.exit(1);
  }
} catch (error) {
  console.error('测试执行失败:', error.message);
  process.exit(1);
}
