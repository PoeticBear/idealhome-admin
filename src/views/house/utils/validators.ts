import { Message } from '@arco-design/web-vue';

/**
 * 表单验证工具函数
 */

// 验证身份证号码
export const validateIdCard = (idCard: string): boolean => {
  const idCardReg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  return idCardReg.test(idCard);
};

// 验证手机号码
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneReg = /^1[3-9]\d{9}$/;
  return phoneReg.test(phone);
};

// 验证邮箱地址
export const validateEmail = (email: string): boolean => {
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailReg.test(email);
};

// 验证非负数
export const validateNonNegative = (value: any): boolean => {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
};

// 验证正数
export const validatePositive = (value: any): boolean => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

// 验证整数
export const validateInteger = (value: any): boolean => {
  const num = Number(value);
  return !isNaN(num) && Number.isInteger(num);
};

// 验证日期范围
export const validateDateRange = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return false;
  return new Date(endDate) > new Date(startDate);
};

// 验证字符串长度
export const validateStringLength = (str: string, min: number, max: number): boolean => {
  if (typeof str !== 'string') return false;
  return str.length >= min && str.length <= max;
};

// 验证必填字段
export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

// 批量验证表单字段
export const validateForm = (formData: Record<string, any>, rules: Record<string, Array<(value: any) => boolean | string>>): { isValid: boolean; errors: Record<string, string[]> } => {
  const errors: Record<string, string[]> = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = formData[field];
    const fieldErrors: string[] = [];

    fieldRules.forEach(rule => {
      const result = rule(value);
      if (typeof result === 'string') {
        fieldErrors.push(result);
        isValid = false;
      } else if (result === false) {
        fieldErrors.push(`${field} 格式不正确`);
        isValid = false;
      }
    });

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  });

  return { isValid, errors };
};

// 显示验证错误信息
export const showValidationError = (errors: Record<string, string[]>): void => {
  const firstError = Object.values(errors)[0]?.[0];
  if (firstError) {
    Message.error({
      content: firstError,
      duration: 3000
    });
  }
};

// 文件验证规则
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // 检查文件类型
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: '只能上传图片文件（jpg、png格式）'
    };
  }

  // 检查文件大小（2MB）
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: '图片大小不能超过2MB'
    };
  }

  return { isValid: true };
};

// 验证房屋表单
export const validateHouseForm = (formData: any): { isValid: boolean; error?: string } => {
  // 验证房屋名称
  if (!validateRequired(formData.name)) {
    return { isValid: false, error: '请输入房屋名称' };
  }

  if (!validateStringLength(formData.name, 1, 50)) {
    return { isValid: false, error: '房屋名称长度应在1-50个字符之间' };
  }

  // 验证面积
  if (formData.area !== null && formData.area !== undefined && formData.area !== '') {
    if (!validateNonNegative(formData.area)) {
      return { isValid: false, error: '面积必须是非负数' };
    }
  }

  // 验证租金
  if (formData.price !== null && formData.price !== undefined && formData.price !== '') {
    if (!validateNonNegative(formData.price)) {
      return { isValid: false, error: '租金必须是非负数' };
    }
  }

  return { isValid: true };
};

// 验证租客入住登记表单
export const validateCheckinForm = (formData: any): { isValid: boolean; error?: string } => {
  // 验证租客姓名
  if (!validateRequired(formData.tenantName)) {
    return { isValid: false, error: '请输入租客姓名' };
  }

  // 验证身份证号
  if (!validateRequired(formData.idCard)) {
    return { isValid: false, error: '请输入身份证号码' };
  }

  if (!validateIdCard(formData.idCard)) {
    return { isValid: false, error: '请输入正确的身份证号码' };
  }

  // 验证手机号
  if (!validateRequired(formData.phoneNumber)) {
    return { isValid: false, error: '请输入手机号码' };
  }

  if (!validatePhoneNumber(formData.phoneNumber)) {
    return { isValid: false, error: '请输入正确的手机号码' };
  }

  // 验证合同日期
  if (!validateRequired(formData.contractStartDate)) {
    return { isValid: false, error: '请选择合同起始日期' };
  }

  if (!validateRequired(formData.contractEndDate)) {
    return { isValid: false, error: '请选择合同结束日期' };
  }

  if (!validateDateRange(formData.contractStartDate, formData.contractEndDate)) {
    return { isValid: false, error: '合同结束日期必须晚于起始日期' };
  }

  // 验证月结日
  if (!validateRequired(formData.paymentDay)) {
    return { isValid: false, error: '请选择月结日' };
  }

  const validDays = [1, 15, 20];
  if (!validDays.includes(formData.paymentDay)) {
    return { isValid: false, error: '月结日只能是1日、15日或20日' };
  }

  return { isValid: true };
};