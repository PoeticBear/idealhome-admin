import { ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
import { getHouseList, updateHouse, createHouse } from '@/api/house';
import { formatHouseListData } from '../utils/formatters';
import { PAGINATION_CONFIG } from '../constants/house';

export interface HouseItem {
  id: number;
  name: string;
  location: string;
  layoutTypeText: string;
  areaText: string;
  priceText: string;
  status: number;
  [key: string]: any;
}

export interface SearchData {
  name: string;
  address: string;
  status: string | number;
  starTime: string;
  endTime: string;
  size: number;
  index: number;
}

export interface Pagination {
  total: number;
  pageSize: number;
  showPageSize: boolean;
  showTotal: boolean;
  showMore: boolean;
  showJumper: boolean;
  simple: boolean;
  current: number;
}

/**
 * 房屋列表管理组合式函数
 */
export function useHouseList() {
  // 响应式数据
  const houseList = ref<HouseItem[]>([]);
  const tableLoading = ref(false);

  // 分页配置
  const pagination = reactive<Pagination>({
    total: 0,
    pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
    showPageSize: true,
    showTotal: true,
    showMore: true,
    showJumper: true,
    simple: false,
    current: 1,
  });

  // 搜索数据
  const searchData = reactive<SearchData>({
    name: '',
    address: '',
    status: '',
    starTime: '',
    endTime: '',
    size: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
    index: 1,
  });

  // 防抖变量和请求计数器
  let isLoading = false;
  let requestCount = 0;
  let lastRequestTime = 0;

  /**
   * 获取房屋列表数据
   */
  const fetchHouseList = async () => {
    const now = Date.now();

    // 防抖：500ms内只允许一次请求
    if (isLoading || (now - lastRequestTime) < 500) {
      console.log('防抖拦截请求，距离上次请求:', now - lastRequestTime, 'ms');
      return;
    }

    if (requestCount > 10) {
      console.error('请求次数过多，停止请求');
      return;
    }

    requestCount++;
    lastRequestTime = now;
    isLoading = true;
    tableLoading.value = true;

    console.log('发送房屋列表请求 #', requestCount, searchData);

    try {
      const response = await getHouseList(searchData);

      if (response.status === 1) {
        pagination.total = response.count || 0;

        // 处理数据，为每个房屋添加格式化字段
        const processedData = formatHouseListData(response.data || []);
        houseList.value.splice(0, houseList.value.length, ...processedData);

        console.log('房屋列表请求成功，数据条数:', processedData?.length || 0);
        // 成功获取数据后重置计数器
        requestCount = 0;
      } else {
        console.error('房屋列表请求失败，状态:', response.status);
        Message.error(String(response.message) || '获取房屋列表失败');
      }
    } catch (error) {
      console.error('获取房屋列表失败:', error);
      Message.error('获取房屋列表失败，请稍后重试');
    } finally {
      tableLoading.value = false;
      isLoading = false;
    }
  };

  /**
   * 页面变化处理
   */
  const onPageChange = (index: number) => {
    pagination.current = index;
    searchData.index = index;
    fetchHouseList();
  };

  /**
   * 页面大小变化处理
   */
  const onPageSizeChange = (size: number) => {
    pagination.pageSize = size;
    searchData.size = size;
    searchData.index = 1;
    pagination.current = 1;
    fetchHouseList();
  };

  /**
   * 搜索处理
   */
  const handleSearch = () => {
    pagination.current = 1;
    searchData.index = 1;
    fetchHouseList();
  };

  /**
   * 日期范围选择处理
   */
  const handleDatePickerChange = (value: any) => {
    if (value) {
      searchData.starTime = value[0];
      searchData.endTime = value[1];
    } else {
      searchData.starTime = '';
      searchData.endTime = '';
    }
    handleSearch();
  };

  /**
   * 重置搜索条件
   */
  const resetSearch = () => {
    searchData.name = '';
    searchData.address = '';
    searchData.status = '';
    searchData.starTime = '';
    searchData.endTime = '';
    searchData.index = 1;
    pagination.current = 1;
    fetchHouseList();
  };

  /**
   * 更新房屋信息
   */
  const updateHouseInfo = async (houseId: number, updateData: any) => {
    try {
      const response = await updateHouse({ id: houseId, ...updateData });

      if (response.status === 1) {
        Message.success('房屋信息更新成功');
        fetchHouseList(); // 刷新列表
        return true;
      } else {
        Message.error(String(response.message) || '房屋信息更新失败');
        return false;
      }
    } catch (error: any) {
      console.error('更新房屋信息失败:', error);

      let errorMessage = '房屋信息更新失败';
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          errorMessage = '未授权，请重新登录';
        } else if (status === 403) {
          errorMessage = '权限不足，无法修改此房屋信息';
        } else if (status === 404) {
          errorMessage = '房屋信息不存在';
        } else if (status === 422) {
          errorMessage = '数据验证失败，请检查输入信息';
        } else if (status >= 500) {
          errorMessage = '服务器错误，请稍后重试';
        }
      }

      Message.error(errorMessage);
      return false;
    }
  };

  /**
   * 创建新房屋
   */
  const createNewHouse = async (houseData: any) => {
    try {
      const response = await createHouse(houseData);

      if (response.status === 1) {
        Message.success('房屋添加成功');
        fetchHouseList(); // 刷新列表
        return response.data; // 返回新房屋ID
      } else {
        Message.error(String(response.message) || '房屋添加失败');
        return null;
      }
    } catch (error: any) {
      console.error('添加房屋失败:', error);

      let errorMessage = '房屋添加失败';
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          errorMessage = '未授权，请重新登录';
        } else if (status === 403) {
          errorMessage = '权限不足，无法添加房屋';
        } else if (status === 422) {
          errorMessage = '数据验证失败，请检查输入信息';
        } else if (status >= 500) {
          errorMessage = '服务器错误，请稍后重试';
        }
      }

      Message.error(errorMessage);
      return null;
    }
  };

  /**
   * 根据ID查找房屋
   */
  const findHouseById = (houseId: number): HouseItem | undefined => {
    return houseList.value.find(house => house.id === houseId);
  };

  return {
    // 数据
    houseList,
    tableLoading,
    pagination,
    searchData,

    // 方法
    fetchHouseList,
    onPageChange,
    onPageSizeChange,
    handleSearch,
    handleDatePickerChange,
    resetSearch,
    updateHouseInfo,
    createNewHouse,
    findHouseById,
  };
}