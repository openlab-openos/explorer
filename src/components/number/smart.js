export function smartFormatNumber(num) {
  // 处理非数字输入
  if (isNaN(parseFloat(num))) {
    return num.toString();
  }

  const number = parseFloat(num);
  const [integerPartStr, decimalPartStr = ''] = number.toString().split('.');
  const integerPart = parseInt(integerPartStr);

  // 情况1：整数部分小于0，直接保留两位小数
  if (integerPart < 0) {
    return number.toFixed(2);
  }

  // 情况2：整数部分大于等于0
  if (decimalPartStr) {
    // 确保小数部分至少有两位（不足则补0）
    const paddedDecimal = decimalPartStr.padEnd(2, '0');

    // 如果小数点后第二位大于0，保留两位小数
    if (parseInt(paddedDecimal[1]) > 0) {
      return number.toFixed(2);
    }

    const firstNonZeroIndex = decimalPartStr.split('').findIndex(digit => digit !== '0');

    if (firstNonZeroIndex !== -1) {
      // 保留的位数 = 第一个非零数字的位置 + 1（索引从0开始）
      const precision = firstNonZeroIndex + 1;
      return number.toFixed(precision);
    }

    // 否则，动态保留到最后一个非零位
    const lastNonZeroIndex = decimalPartStr.split('').reduce((lastIndex, digit, index) => {
      return digit !== '0' ? index : lastIndex;
    }, -1);
    if (lastNonZeroIndex >= 0) {
      return number.toFixed(lastNonZeroIndex + 1);
    }
  }


  // 默认情况：没有小数部分或全是0
  return number < 1 ? number.toString() : number.toFixed(0);
}
