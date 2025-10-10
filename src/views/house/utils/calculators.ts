/**
 * 计算相关工具函数
 */

// 计算月度总费用
export const calculateMonthlyTotal = (rentPrice: any, propertyFee: any, internetFee: any): number => {
  const rent = Number(rentPrice) || 0;
  const property = Number(propertyFee) || 0;
  const internet = Number(internetFee) || 0;
  return rent + property + internet;
};

// 计算入住时长
export const calculateStayDuration = (joinTime: string): string => {
  if (!joinTime) return '未知';

  try {
    const joinDate = new Date(joinTime);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays}天`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      return remainingDays > 0 ? `${months}个月${remainingDays}天` : `${months}个月`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingDays = diffDays % 365;
      const months = Math.floor(remainingDays / 30);
      return months > 0 ? `${years}年${months}个月` : `${years}年`;
    }
  } catch (error) {
    return '计算错误';
  }
};

// 计算合同剩余天数
export const calculateRemainingDays = (leaseEndDate: string): number => {
  if (!leaseEndDate) return 0;

  try {
    const endDate = new Date(leaseEndDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 0;
    }
    return diffDays;
  } catch (error) {
    return 0;
  }
};

// 计算水费
export const calculateWaterFee = (currentReading: number, previousReading: number, unitPrice: number): number => {
  const usage = Math.max(0, currentReading - previousReading);
  return usage * unitPrice;
};

// 计算电费
export const calculateElectricityFee = (currentReading: number, previousReading: number, unitPrice: number): number => {
  const usage = Math.max(0, currentReading - previousReading);
  return usage * unitPrice;
};

// 计算总租金（包含物业费、网费等）
export const calculateTotalRent = (baseRent: number, propertyFee: number = 0, internetFee: number = 0, otherFees: number = 0): number => {
  return baseRent + propertyFee + internetFee + otherFees;
};

// 计算押金总额
export const calculateTotalDeposit = (houseDeposit: number, otherDeposit: number = 0): number => {
  return houseDeposit + otherDeposit;
};

// 格式化货币金额
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY'
  }).format(amount);
};