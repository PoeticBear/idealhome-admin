/**
 * 金额格式化工具函数
 */

/**
 * 格式化金额为字符串
 * @param amount 金额值（可以是数字、字符串等）
 * @param precision 小数位数，默认2位
 * @returns 格式化后的金额字符串
 */
export function formatAmount (amount: any, precision: number = 2): string {
  if (amount === null || amount === undefined || amount === '') {
    return '0.00';
  }

  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(num)) {
    return '0.00';
  }

  return num.toFixed(precision);
}

/**
 * 解析金额为数字
 * @param amount 金额值（可以是数字、字符串等）
 * @returns 解析后的数字
 */
export function parseAmount (amount: any): number {
  if (amount === null || amount === undefined || amount === '') {
    return 0;
  }

  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  return isNaN(num) ? 0 : num;
}

/**
 * 格式化金额为中文货币格式
 * @param amount 金额值
 * @returns 带人民币符号的金额字符串
 */
export function formatCurrency (amount: any): string {
  return `¥${formatAmount(amount)}`;
}

/**
 * 计算金额总和
 * @param amounts 金额数组
 * @returns 总和
 */
export function sumAmounts (amounts: any[]): number {
  return amounts.reduce((sum: number, amount) => sum + parseAmount(amount), 0);
}

/**
 * 检查金额是否有效
 * @param amount 金额值
 * @returns 是否为有效金额
 */
export function isValidAmount (amount: any): boolean {
  if (amount === null || amount === undefined || amount === '') {
    return false;
  }

  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  return !isNaN(num) && num >= 0;
}

/**
 * 格式化百分比
 * @param value 百分比值
 * @param precision 小数位数
 * @returns 格式化后的百分比字符串
 */
export function formatPercentage (value: any, precision: number = 1): string {
  if (value === null || value === undefined || value === '') {
    return '0%';
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return '0%';
  }

  return `${String(num.toFixed(precision))}%`;
}