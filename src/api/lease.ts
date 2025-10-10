import axios from '@/utils/request';

// 租客入住登记接口
export const leaseRegister = (data: any) => axios({
  url: '/api/lease/register',
  method: 'post',
  data
})

// 文件上传接口
export const uploadFile = (formData: FormData) => axios({
  url: '/api/file/upload',
  method: 'post',
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  data: formData
})

// 获取可租赁房屋列表
export const getAvailableHouseList = (params: any) => axios({
  url: '/api/house/available',
  method: 'get',
  params
})

// 检查房屋状态
export const checkHouseAvailable = (houseId: number) => axios({
  url: '/api/house/checkAvailable',
  method: 'get',
  params: { houseId }
})

// 获取租赁合同列表
export const getLeaseList = (params: any) => axios({
  url: '/api/lease/list',
  method: 'get',
  params
})

// 根据房屋ID获取租客详情
export const getTenantDetailByHouseId = (houseId: number) => axios({
  url: '/api/lease/byHouse',
  method: 'get',
  params: { houseId }
})