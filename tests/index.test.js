import assert from 'assert';
import { add, subtract, multiply, divide } from '../src/index.js';

// 测试 add 函数
assert.strictEqual(add(1, 2), 3, 'add(1, 2) 应该等于 3');
assert.strictEqual(add(-1, 1), 0, 'add(-1, 1) 应该等于 0');
assert.strictEqual(add(0, 0), 0, 'add(0, 0) 应该等于 0');

// 测试 subtract 函数
assert.strictEqual(subtract(5, 3), 2, 'subtract(5, 3) 应该等于 2');
assert.strictEqual(subtract(0, 5), -5, 'subtract(0, 5) 应该等于 -5');
assert.strictEqual(subtract(-1, -1), 0, 'subtract(-1, -1) 应该等于 0');

// 测试 multiply 函数
assert.strictEqual(multiply(3, 4), 12, 'multiply(3, 4) 应该等于 12');
assert.strictEqual(multiply(-2, 3), -6, 'multiply(-2, 3) 应该等于 -6');
assert.strictEqual(multiply(0, 5), 0, 'multiply(0, 5) 应该等于 0');

// 测试 divide 函数
assert.strictEqual(divide(6, 2), 3, 'divide(6, 2) 应该等于 3');
assert.strictEqual(divide(5, 2), 2.5, 'divide(5, 2) 应该等于 2.5');

// 测试 divide 除以 0 的错误
assert.throws(
  () => divide(1, 0),
  { message: '除数不能为 0' },
  'divide(1, 0) 应该抛出错误'
);