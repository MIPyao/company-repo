/**
 * MIPYAO 公司核心工具库
 */

/**
 * 计算两个数字的和
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a, b) {
  return a + b;
}

/**
 * 计算两个数字的差
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function subtract(a, b) {
  return a - b;
}

/**
 * 计算两个数字的乘积
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function multiply(a, b) {
  return a * b;
}

/**
 * 计算两个数字的商
 * @param {number} a
 * @param {number} b
 * @returns {number}
 * @throws {Error} 当除数为 0 时抛出错误
 */
function divide(a, b) {
  if (b === 0) {
    throw new Error('除数不能为 0');
  }
  return a / b;
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
};
