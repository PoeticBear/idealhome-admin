import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { getCityCode } from '@/api/house';

export interface LocationItem {
  id: string | number;
  name: string;
  child?: LocationItem[];
}

/**
 * 省市区数据管理组合式函数
 */
export function useLocationData() {
  // 响应式数据
  const provinceList = ref<LocationItem[]>([]);
  const cityList = ref<LocationItem[]>([]);
  const districtList = ref<LocationItem[]>([]);
  const cityCodeLoading = ref(false);

  /**
   * 加载省份数据
   */
  const loadProvinceData = async (): Promise<boolean> => {
    try {
      cityCodeLoading.value = true;
      const response = await getCityCode();

      if (response.status === 1) {
        provinceList.value = response.data || [];
        return true;
      } else {
        Message.error(String(response.message) || '获取省份数据失败');
        return false;
      }
    } catch (error) {
      console.error('获取省份数据失败:', error);
      Message.error('获取省份数据失败');
      return false;
    } finally {
      cityCodeLoading.value = false;
    }
  };

  /**
   * 根据省份ID加载城市数据
   */
  const loadCityData = (provinceId: string | number, provinceName?: string): boolean => {
    let province = provinceList.value.find(item => item.id === provinceId);

    // 如果通过ID没找到，尝试通过名称查找
    if (!province && provinceName) {
      province = provinceList.value.find(item => item.name === provinceName);
    }

    if (province && province.child) {
      cityList.value = province.child;
      districtList.value = []; // 清空区县列表
      return true; // 返回成功标志
    } else {
      cityList.value = [];
      districtList.value = [];
      return false; // 返回失败标志
    }
  };

  /**
   * 根据城市ID加载区县数据
   */
  const loadDistrictData = (cityId: string | number, cityName?: string): boolean => {
    let city = cityList.value.find(item => item.id === cityId);

    // 如果通过ID没找到，尝试通过名称查找
    if (!city && cityName) {
      city = cityList.value.find(item => item.name === cityName);
    }

    if (city && city.child) {
      districtList.value = city.child;
      return true; // 返回成功标志
    } else {
      districtList.value = [];
      return false; // 返回失败标志
    }
  };

  /**
   * 根据名称查找省份ID
   */
  const findProvinceIdByName = (provinceName: string): string | null => {
    const province = provinceList.value.find(item => item.name === provinceName);
    return province ? String(province.id) : null;
  };

  /**
   * 根据名称查找城市ID
   */
  const findCityIdByName = (cityName: string): string | null => {
    const city = cityList.value.find(item => item.name === cityName);
    return city ? String(city.id) : null;
  };

  /**
   * 根据名称查找区县ID
   */
  const findDistrictIdByName = (districtName: string): string | null => {
    const district = districtList.value.find(item => item.name === districtName);
    return district ? String(district.id) : null;
  };

  /**
   * 根据ID获取省份名称
   */
  const getProvinceNameById = (provinceId: string | number): string => {
    const province = provinceList.value.find(item => item.id === provinceId);
    return province?.name || '';
  };

  /**
   * 根据ID获取城市名称
   */
  const getCityNameById = (cityId: string | number): string => {
    const city = cityList.value.find(item => item.id === cityId);
    return city?.name || '';
  };

  /**
   * 根据ID获取区县名称
   */
  const getDistrictNameById = (districtId: string | number): string => {
    const district = districtList.value.find(item => item.id === districtId);
    return district?.name || '';
  };

  /**
   * 智能匹配省市区数据（用于编辑表单回显）
   */
  const smartMatchLocation = (
    provinceName?: string,
    cityName?: string,
    districtName?: string,
    provinceId?: string | number,
    cityId?: string | number,
    districtId?: string | number
  ): { provinceId: string; cityId: string; districtId: string } => {
    const result = {
      provinceId: '',
      cityId: '',
      districtId: ''
    };

    // 处理省份数据
    if (provinceName) {
      if (provinceId) {
        // 如果有ID，优先使用ID
        const idStr = String(provinceId);
        if (getProvinceNameById(idStr) === provinceName) {
          result.provinceId = idStr;
        } else {
          // ID和名称不匹配，通过名称重新查找
          const matchedId = findProvinceIdByName(provinceName);
          result.provinceId = matchedId || '';
        }
      } else {
        // 没有ID，通过名称查找
        const matchedId = findProvinceIdByName(provinceName);
        result.provinceId = matchedId || '';
      }
    }

    // 加载城市数据
    if (result.provinceId) {
      loadCityData(result.provinceId);

      // 处理城市数据
      if (cityName) {
        if (cityId) {
          // 如果有ID，优先使用ID
          const idStr = String(cityId);
          if (getCityNameById(idStr) === cityName) {
            result.cityId = idStr;
          } else {
            // ID和名称不匹配，通过名称重新查找
            const matchedId = findCityIdByName(cityName);
            result.cityId = matchedId || '';
          }
        } else {
          // 没有ID，通过名称查找
          const matchedId = findCityIdByName(cityName);
          result.cityId = matchedId || '';
        }
      }

      // 加载区县数据
      if (result.cityId) {
        loadDistrictData(result.cityId);

        // 处理区县数据
        if (districtName) {
          if (districtId) {
            // 如果有ID，优先使用ID
            const idStr = String(districtId);
            if (getDistrictNameById(idStr) === districtName) {
              result.districtId = idStr;
            } else {
              // ID和名称不匹配，通过名称重新查找
              const matchedId = findDistrictIdByName(districtName);
              result.districtId = matchedId || '';
            }
          } else {
            // 没有ID，通过名称查找
            const matchedId = findDistrictIdByName(districtName);
            result.districtId = matchedId || '';
          }
        }
      }
    }

    return result;
  };

  /**
   * 清空省市区数据
   */
  const clearLocationData = (level?: 'province' | 'city' | 'district') => {
    switch (level) {
      case 'province':
        provinceList.value = [];
        cityList.value = [];
        districtList.value = [];
        break;
      case 'city':
        cityList.value = [];
        districtList.value = [];
        break;
      case 'district':
        districtList.value = [];
        break;
      default:
        // 不传参数则清空所有
        cityList.value = [];
        districtList.value = [];
        break;
    }
  };

  return {
    // 数据
    provinceList,
    cityList,
    districtList,
    cityCodeLoading,

    // 方法
    loadProvinceData,
    loadCityData,
    loadDistrictData,
    findProvinceIdByName,
    findCityIdByName,
    findDistrictIdByName,
    getProvinceNameById,
    getCityNameById,
    getDistrictNameById,
    smartMatchLocation,
    clearLocationData,
  };
}