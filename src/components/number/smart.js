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
    return price.toString();
  }

  const num = parseFloat(price);
  if (num == 0 ) {
    return '$ 0';
  }
  // 情况1：价格高于$0但低于$0.00001
  if (num > 0 && num < 0.00001) {
    return '$ < 0.00001';
  }

  // 情况2：价格不低于$0.00001但低于$1
  if (num >= 0.00001 && num < 1) {
    // 转换为字符串并分割整数和小数部分
    const [, decimalPart = ''] = num.toString().split('.');

    // 找到前5位有效数字的位置
    let significantCount = 0;
    let lastIndex = 0;

    for (let i = 0; i < decimalPart.length; i++) {
      if (decimalPart[i] !== '0') {
        significantCount++;
      }
      if (significantCount > 0) {
        lastIndex = i;
        if (significantCount >= 5) {
          break;
        }
      }
    }

    // 保留到第5位有效数字
    const precision = lastIndex;
    return `$${num.toFixed(precision)}`;
  }

  // 情况3：价格高于等于$1
  if (num >= 1) {
    return `$${num.toFixed(2)}`;
  }

  // 处理0或负数
  return `$${num.toFixed(2)}`;
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
    return '$0';
  }

  // 情况5：市值不低于$0.01，最多保留两位小数
  return `$${num.toFixed(2)}`;
}
