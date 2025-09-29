import axios from '@/utils/request'

// 缴费类型枚举
export enum PaymentType {
  RENT = 1, // 租金
  WATER = 2, // 水费
  ELECTRICITY = 3, // 电费
  INTERNET = 4, // 网费
  GAS = 5, // 燃气费
  OTHER = 6 // 其他
}

// 缴费状态枚举
export enum PaymentStatus {
  UNPAID = 0, // 未缴费
  PAID = 1, // 已缴费
  OVERDUE = 2, // 欠费
  PARTIAL = 3 // 部分缴费
}

// 缴费记录接口
export interface PaymentRecord {
  id: number
  tenantId: number
  houseId: number
  landlordId: number
  paymentType: PaymentType
  paymentMonth: string
  amount: number
  status: PaymentStatus
  dueDate: string
  paymentDate?: string
  remark?: string
  createdAt: string
  updatedAt: string
  overdueDays?: number
  // 关联对象
  tenant?: {
    id: number
    name: string
    phone: string
    headImg?: string
  }
  house?: {
    id: number
    name: string
    price: number
    provinceName: string
    cityName: string
    areaName: string
    addresInfo: string
  }
  landlord?: {
    id: number
    name: string
    phone: string
  }
}

// 缴费状态统计接口
export interface PaymentStatistics {
  totalAmount: number
  paidAmount: number
  unpaidAmount: number
  overdueAmount: number
  totalRecords: number
  paidRecords: number
  unpaidRecords: number
  overdueRecords: number
}

// 缴费状态查询参数
export interface PaymentStatusParams {
  tenantId?: number
  paymentMonth?: string
  status?: PaymentStatus
  paymentType?: PaymentType
}

// 缴费记录查询参数
export interface PaymentRecordsParams {
  tenantId?: number
  tenantName?: string
  landlordId?: number
  houseId?: number
  paymentMonth?: string
  status?: PaymentStatus
  paymentType?: PaymentType
  size?: number
  index?: number
}

// 欠费查询参数
export interface OverdueParams {
  landlordId?: number
  houseId?: number
  overdueDays?: string
  size?: number
  index?: number
}

// 生成账单参数
export interface GenerateBillParams {
  houseId: number
  tenantId: number
  landlordId?: number
  paymentMonth: string
}

// 更新缴费状态参数
export interface UpdatePaymentStatusParams {
  id: number
  status: PaymentStatus
  paymentDate?: string
}

// 获取租客缴费状态总览
export const getPaymentStatus = (params: PaymentStatusParams) => {
  return axios<{
    records: PaymentRecord[]
    statistics: PaymentStatistics
  }>({
    url: '/api/tenantsUser/payment/status',
    method: 'get',
    params
  })
}

// 获取缴费记录明细
export const getPaymentRecords = (params: PaymentRecordsParams) => {
  return axios<{
    count: number
    data: PaymentRecord[]
  }>({
    url: '/api/tenantsUser/payment/records',
    method: 'get',
    params
  })
}

// 获取欠费租客列表
export const getOverdueTenants = (params: OverdueParams) => {
  return axios<{
    count: number
    data: PaymentRecord[]
  }>({
    url: '/api/tenantsUser/payment/overdue',
    method: 'get',
    params
  })
}

// 生成月度账单
export const generateMonthlyBill = (data: GenerateBillParams) => {
  return axios<PaymentRecord[]>({
    url: '/api/tenantsUser/payment/generateBill',
    method: 'post',
    data
  })
}

// 更新缴费状态
export const updatePaymentStatus = (data: UpdatePaymentStatusParams) => {
  return axios<PaymentRecord>({
    url: '/api/tenantsUser/payment/updateStatus',
    method: 'post',
    data
  })
}

// 缴费状态选项
export const paymentTypeOptions = [
  { label: '租金', value: PaymentType.RENT },
  { label: '水费', value: PaymentType.WATER },
  { label: '电费', value: PaymentType.ELECTRICITY },
  { label: '网费', value: PaymentType.INTERNET },
  { label: '燃气费', value: PaymentType.GAS },
  { label: '其他', value: PaymentType.OTHER }
]

// 缴费状态选项
export const paymentStatusOptions = [
  { label: '未缴费', value: PaymentStatus.UNPAID, color: 'gray' },
  { label: '已缴费', value: PaymentStatus.PAID, color: 'green' },
  { label: '欠费', value: PaymentStatus.OVERDUE, color: 'red' },
  { label: '部分缴费', value: PaymentStatus.PARTIAL, color: 'orange' }
]