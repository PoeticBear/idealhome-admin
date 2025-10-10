import { HOUSE_TYPE_OPTIONS, HOUSE_STATUS_OPTIONS } from '../constants/house';

/**
 * 数据格式化工具函数
 */

// 格式化金额，保留2位小数
export const formatAmount = (value: any): string => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  const num = parseFloat(value);
  return isNaN(num) ? '-' : num.toFixed(2);
};

// 获取户型标签
export const getHouseTypeLabel = (value: number): string => {
  const option = HOUSE_TYPE_OPTIONS.find(item => item.value === value);
  return option ? option.label : '未知';
};

// 获取卫生间/厨房配置标签
export const getFacilityLabel = (value: number): string => {
  if (value === 0) return '没有';
  if (value === 1) return '独立';
  if (value === 2) return '公用';
  return '未知';
};

// 获取朝向标签
export const getTowardLabel = (value: number): string => {
  const directionMap: { [key: number]: string } = {
    1: '东',
    2: '西',
    3: '南',
    4: '北'
  };
  return directionMap[value] || '未知';
};

// 获取阳台标签
export const getBalconyLabel = (value: number): string => {
  return value === 1 ? '有' : '无';
};

// 获取状态信息
export const getStatusInfo = (status: number) => {
  return HOUSE_STATUS_OPTIONS.find(item => item.value === status) || { label: '未知', color: '' };
};

// 获取月结日标签
export const getPaymentDayLabel = (day: number): string => {
  const options = [
    { label: '1日', value: 1 },
    { label: '15日', value: 15 },
    { label: '20日', value: 20 }
  ];
  const option = options.find(item => item.value === day);
  return option ? option.label : `${day}日`;
};

// 格式化面积
export const formatArea = (area: any): string => {
  if (!area) return '-';
  return `${area}㎡`;
};

// 格式化租金
export const formatRent = (price: any): string => {
  if (!price) return '-';
  const num = parseFloat(price);
  return isNaN(num) ? '-' : `¥${num.toLocaleString()}/月`;
};

// 格式化完整地址
export const formatFullAddress = (provinceName?: string, cityName?: string, areaName?: string, detailAddress?: string): string => {
  const parts = [provinceName, cityName, areaName, detailAddress].filter(Boolean);
  return parts.join(' ').trim() || '-';
};

// 格式化房屋列表数据
export const formatHouseListData = (data: any[]) => {
  return (data || []).map(item => ({
    ...item,
    location: formatFullAddress(item.provinceName, item.cityName, item.areaName),
    layoutTypeText: getHouseTypeLabel(item.layoutType),
    areaText: formatArea(item.area),
    priceText: formatRent(item.price)
  }));
};

// 处理图片数据
export const processImageData = (data: any): any[] => {
  if (!data) return [];

  try {
    if (typeof data === 'string') {
      // 尝试解析JSON字符串
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [parsed];
    } else if (Array.isArray(data)) {
      // 已经是数组
      return data;
    } else {
      // 其他情况转为数组
      return [data];
    }
  } catch (e) {
    // JSON解析失败，当作单个图片路径处理
    if (typeof data === 'string') {
      return [{ url: data }];
    } else {
      return [{ url: String(data) }];
    }
  }
};

// 处理视频数据
export const processVideoData = (data: any): any[] => {
  if (!data) return [];

  try {
    if (typeof data === 'string') {
      // 尝试解析JSON字符串
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [parsed];
    } else if (Array.isArray(data)) {
      // 已经是数组
      return data;
    } else {
      // 其他情况转为数组
      return [data];
    }
  } catch (e) {
    // JSON解析失败，当作单个视频路径处理
    if (typeof data === 'string') {
      return [{ url: data }];
    } else {
      return [{ url: String(data) }];
    }
  }
};