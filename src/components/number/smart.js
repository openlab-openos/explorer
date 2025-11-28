// export function smartFormatNumber(num) {
//   // 处理非数字输入
//   if (isNaN(parseFloat(num))) {
//     return num.toString();
//   }

//   const number = parseFloat(num);
//   const [integerPartStr, decimalPartStr = ''] = number.toString().split('.');
//   const integerPart = parseInt(integerPartStr);

//   // 情况1：整数部分小于0，直接保留两位小数
//   if (integerPart < 0) {
//     return number.toFixed(2);
//   }

//   // 情况2：整数部分大于等于0
//   if (decimalPartStr) {
//     // 确保小数部分至少有两位（不足则补0）
//     // const paddedDecimal = decimalPartStr.padEnd(2, '0');

//     // // 如果小数点后第二位大于0，保留两位小数
//     // if (parseInt(paddedDecimal[1]) > 0) {
//     //   return number.toFixed(2);
//     // }

//     // const firstNonZeroIndex = decimalPartStr.split('').findIndex(digit => digit !== '0');

//     // if (firstNonZeroIndex !== -1) {
//     //   // 保留的位数 = 第一个非零数字的位置 + 1（索引从0开始）
//     //   const precision = firstNonZeroIndex + 1;
//     //   return number.toFixed(precision);
//     // }

//     // 否则，动态保留到最后一个非零位
//     const lastNonZeroIndex = decimalPartStr.split('').reduce((lastIndex, digit, index) => {
//       return digit !== '0' ? index : lastIndex;
//     }, -1);
//     if (lastNonZeroIndex >= 0) {
//       return number.toFixed(lastNonZeroIndex + 1);
//     }
//   }


//   // 默认情况：没有小数部分或全是0
//   return number < 1 ? number.toString() : number.toFixed(0);
// }
// 格式化代币价格
export function smartFormatNumber(price) {
  // 处理非数字输入
  if (isNaN(parseFloat(price))) {
    console.log(4);
    
    return price.toString();
  }

  const num = parseFloat(price);
  if (num === 0) {
    return ' 0';
  }

  // 情况1：价格高于$0但低于$0.00001
  if (num > 0 && num < 0.00001) {
    return ' < 0.00001';
  }

  // 情况2：价格不低于$0.00001但低于$1
  if (num >= 0.00001 && num < 1) {
    // 转换为字符串处理，避免浮点数精度问题
    const numStr = num.toString();
    const [integerPart, decimalPart = ''] = numStr.split('.');

    // 找到小数点后第一个非零数字的位置（起始索引）
    let startIndex = 0;
    while (startIndex < decimalPart.length && decimalPart[startIndex] === '0') {
      startIndex++;
    }

    // 从第一个非零数字开始，取5位有效数字（直接截断）
    const endIndex = Math.min(startIndex + 5, decimalPart.length);
    const truncatedDecimal = decimalPart.substring(0, 3);

    // 拼接结果
    return `${integerPart}.${truncatedDecimal}`;
  }

  // 情况3：价格高于等于$1（保留两位小数，直接截断）
  if (num >= 1) {
    // 扩大100倍后取整再缩小，实现截断效果
    const truncated = Math.floor(num * 100) / 100;
    // 确保显示两位小数（如1 → 1.00）
    return `${truncated.toFixed(2)}`;
  }

  // 处理负数（保留两位小数，直接截断）
  const truncatedNegative = Math.ceil(num * 100) / 100;
  return `${truncatedNegative.toFixed(2)}`;
}


// 格式化代币市值
export function formatMarketCap(cap) {
  // 处理非数字输入
  if (isNaN(parseFloat(cap))) {
    return cap.toString();
  }

  const num = parseFloat(cap);

  // 情况4：市值小于$0.01
  if (num < 0.01) {
    return '0';
  }

  // 情况5：市值不低于$0.01，最多保留两位小数
  return `${num.toFixed(2)}`;
}
