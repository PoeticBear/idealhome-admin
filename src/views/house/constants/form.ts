/**
 * 表单相关常量定义
 */

// 表单验证规则
export const VALIDATION_RULES = {
  // 必填验证
  REQUIRED: { required: true, message: '此字段为必填项' },

  // 房屋名称验证
  HOUSE_NAME: [
    { required: true, message: '请输入房屋名称' },
    { maxLength: 50, message: '房屋名称不能超过50个字符' }
  ],

  // 身份证验证
  ID_CARD: [
    { required: true, message: '请输入身份证号码' },
    {
      validator: (value: string, callback: Function) => {
        const idCardReg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
        if (!idCardReg.test(value)) {
          callback('请输入正确的身份证号码')
        } else {
          callback()
        }
      }
    }
  ],

  // 手机号验证
  PHONE_NUMBER: [
    { required: true, message: '请输入手机号码' },
    {
      validator: (value: string, callback: Function) => {
        const phoneReg = /^1[3-9]\d{9}$/
        if (!phoneReg.test(value)) {
          callback('请输入正确的手机号码')
        } else {
          callback()
        }
      }
    }
  ],

  // 月结日验证
  PAYMENT_DAY: [
    { required: true, message: '请选择月结日' },
    {
      validator: (value: number, callback: Function) => {
        const validDays = [1, 15, 20]
        if (!validDays.includes(value)) {
          callback('月结日只能是1日、15日或20日')
        } else {
          callback()
        }
      }
    }
  ]
};

// 表单字段默认值
export const DEFAULT_FORM_VALUES = {
  // 房屋表单默认值
  HOUSE_FORM: {
    name: '',
    roomNumber: '',
    area: null,
    floor: '',
    layoutType: null,
    province: '',
    city: '',
    district: '',
    addresInfo: '',
    toilet: 0,
    kitchen: 0,
    balcony: 0,
    toward: 1,
    lighting: '',
    status: 1,
    price: null,
    fakePrice: null,
    depositNumber: null,
    priceNumber: 1,
    waterFee: null,
    electricityFee: null,
    internetFee: null,
    fuelFee: null,
    note: ''
  },

  // 租客入住登记表单默认值
  CHECKIN_FORM: {
    tenantName: '',
    idCard: '',
    phoneNumber: '',
    idPhoto: [],
    contractStartDate: '',
    contractEndDate: '',
    paymentDay: null,
    rentPrice: null,
    houseDeposit: null,
    otherDeposit: null,
    managementFee: null,
    internetFee: null,
    waterMeterReading: null,
    electricMeterReading: null,
    notes: ''
  }
};

// 表单布局配置
export const FORM_LAYOUT = {
  LABEL_WIDTH: '100px',
  SPAN_SMALL: 8,
  SPAN_MEDIUM: 12,
  SPAN_LARGE: 24,
  GUTTER: 16
};