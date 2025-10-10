/**
 * 房屋相关常量定义
 */

// 房屋状态选项
export const HOUSE_STATUS_OPTIONS = [
  {
    label: '全部',
    value: '',
    color: ''
  },
  {
    label: '待租',
    value: 1,
    color: 'red'
  },
  {
    label: '已租',
    value: 2,
    color: 'green'
  }
];

// 户型选项
export const HOUSE_TYPE_OPTIONS = [
  { label: '单间', value: 1 },
  { label: '一房一厅', value: 2 },
  { label: '两房一厅', value: 3 },
  { label: '三房一厅', value: 4 },
  { label: '四房一厅', value: 5 },
  { label: '四房两厅', value: 6 }
];

// 卫生间配置选项
export const TOILET_OPTIONS = [
  { label: '没有', value: 0 },
  { label: '独立', value: 1 },
  { label: '公用', value: 2 }
];

// 厨房配置选项
export const KITCHEN_OPTIONS = [
  { label: '没有', value: 0 },
  { label: '独立', value: 1 },
  { label: '公用', value: 2 }
];

// 阳台选项
export const BALCONY_OPTIONS = [
  { label: '无', value: 0 },
  { label: '有', value: 1 }
];

// 朝向选项
export const TOWARD_OPTIONS = [
  { label: '东', value: 1 },
  { label: '西', value: 2 },
  { label: '南', value: 3 },
  { label: '北', value: 4 }
];

// 月结日选项
export const PAYMENT_DAY_OPTIONS = [
  { label: '1日', value: 1 },
  { label: '15日', value: 15 },
  { label: '20日', value: 20 }
];

// 视图模式类型
export const VIEW_MODE = {
  TABLE: 'table',
  CARD: 'card'
} as const;

// 分页配置
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// 文件上传配置
export const UPLOAD_CONFIG = {
  IMAGE_MAX_SIZE: 2 * 1024 * 1024, // 2MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  MAX_FILE_COUNT: 1
};