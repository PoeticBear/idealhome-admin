import axios from '@/utils/request';

export const getHouseList = (params: any) => axios({
  url: '/api/house/list',
  method: 'get',
  params
})

export const updateHouse = (data: any) => axios({
  url: '/api/house/update',
  method: 'post',
  data
})

export const createHouse = (data: any) => axios({
  url: '/api/house/insert',
  method: 'post',
  data
})

export const getCityCode = () => axios({
  url: '/api/house/getCityCode',
  method: 'get'
})