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

// 测试数据常量
export const TEST_HOUSE_DATA = {
  // 房屋测试数据 - 用于开发和测试
  HOUSE_FORM: {
    name: '测试公寓-阳光花园',
    roomNumber: 'A-1203',
    area: 85,
    floor: '12',
    layoutType: 3, // 三房一厅
    province: '110000', // 北京市
    city: '110100', // 北京市
    district: '110105', // 朝阳区
    addresInfo: '阳光花园小区12号楼1203室',
    toilet: 1, // 独立卫生间
    kitchen: 1, // 独立厨房
    balcony: 1, // 有阳台
    toward: 3, // 南向
    lighting: '采光充足，南北通透，通风良好',
    status: 1, // 待租
    price: 3500, // 实际租金
    fakePrice: 3800, // 对外租金
    depositNumber: 1, // 押金1个月
    priceNumber: 3, // 每3个月付一次
    waterFee: 50, // 水费
    electricityFee: 100, // 电费
    internetFee: 80, // 网费
    fuelFee: 30, // 燃气费
    note: '精装修，家电齐全，拎包入住，适合家庭居住'
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