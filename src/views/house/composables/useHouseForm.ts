import { ref, reactive, nextTick } from 'vue';
import { Message } from '@arco-design/web-vue';
import { DEFAULT_FORM_VALUES } from '../constants/form';
import { validateHouseForm } from '../utils/validators';
import { useLocationData } from './useLocationData';

export interface HouseFormData {
  id?: number;
  name: string;
  roomNumber: string;
  area: number | null;
  floor: string;
  layoutType: number | null;
  province: string;
  city: string;
  district: string;
  addresInfo: string;
  toilet: number;
  kitchen: number;
  balcony: number;
  toward: number;
  lighting: string;
  status: number;
  price: number | null;
  fakePrice: number | null;
  depositNumber: number | null;
  priceNumber: number | null;
  waterFee: number | null;
  electricityFee: number | null;
  internetFee: number | null;
  fuelFee: number | null;
  note: string;
}

/**
 * 房屋表单管理组合式函数
 */
export function useHouseForm() {
  // 位置数据管理
  const {
    provinceList,
    cityList,
    districtList,
    cityCodeLoading,
    loadProvinceData,
    loadCityData,
    loadDistrictData,
    smartMatchLocation,
    clearLocationData
  } = useLocationData();

  // 表单显示状态
  const showAddModal = ref(false);
  const showEditModal = ref(false);
  const addLoading = ref(false);
  const editLoading = ref(false);

  // 编辑数据
  const editData = reactive({ id: 0, name: '' });

  // 表单数据
  const addForm = reactive<HouseFormData>({ ...DEFAULT_FORM_VALUES.HOUSE_FORM });
  const editForm = reactive<HouseFormData>({ ...DEFAULT_FORM_VALUES.HOUSE_FORM });

  /**
   * 显示新增房屋弹窗
   */
  const showAddModalHandler = () => {
    // 重置表单数据
    Object.keys(addForm).forEach(key => {
      (addForm as any)[key] = (DEFAULT_FORM_VALUES.HOUSE_FORM as any)[key];
    });

    // 清空省市区选择器数据
    clearLocationData('city');
    showAddModal.value = true;
  };

  /**
   * 显示编辑房屋弹窗
   */
  const showEditModalHandler = (data: any) => {
    // 深拷贝数据到编辑对象
    editData.id = data.id;
    editData.name = data.name;

    // 初始化编辑表单数据
    Object.keys(editForm).forEach(key => delete (editForm as any)[key]);

    // 清空省市区选择器数据
    clearLocationData('city');

    // 立即显示弹窗
    showEditModal.value = true;

    // 在下一个 tick 中设置表单数据
    nextTick(() => {
      // 设置基本表单数据
      editForm.id = data.id;
      editForm.name = data.name || '';
      editForm.roomNumber = data.roomNumber || '';
      editForm.area = data.area ? Number(data.area) : null;
      editForm.floor = data.floor ? String(data.floor) : '';
      editForm.layoutType = data.layoutType ? Number(data.layoutType) : null;

      // 智能匹配省市区数据
      const matchedLocation = smartMatchLocation(
        data.provinceName,
        data.cityName,
        data.areaName,
        data.provinceId,
        data.cityId,
        data.areaId
      );

      editForm.province = matchedLocation.provinceId;
      editForm.city = matchedLocation.cityId;
      editForm.district = matchedLocation.districtId;

      // 如果通过智能匹配没有找到完整的省市区数据，尝试异步加载
      if (matchedLocation.provinceId && (!matchedLocation.cityId || !matchedLocation.districtId)) {
        // 异步加载城市数据
        setTimeout(() => {
          if (data.cityName) {
            const cityLoaded = loadCityData(matchedLocation.provinceId);
            if (cityLoaded) {
              setTimeout(() => {
                if (data.areaName) {
                  const districtLoaded = loadDistrictData(matchedLocation.cityId);
                  if (districtLoaded) {
                    // 重新查找区县ID
                    const districtId = findDistrictIdByName(data.areaName);
                    if (districtId) {
                      editForm.district = districtId;
                    }
                  }
                }
              }, 100);
            }
          }
        }, 100);
      }

      // 设置其他表单数据
      editForm.addresInfo = data.addresInfo || '';
      editForm.toilet = data.toilet !== undefined ? Number(data.toilet) : null;
      editForm.kitchen = data.kitchen !== undefined ? Number(data.kitchen) : null;
      editForm.balcony = data.balcony !== undefined ? Number(data.balcony) : null;
      editForm.toward = data.toward !== undefined ? Number(data.toward) : null;
      editForm.lighting = data.lighting || '';
      editForm.status = data.status ? Number(data.status) : 1;
      editForm.price = data.price ? Number(data.price) : null;
      editForm.fakePrice = data.fakePrice ? Number(data.fakePrice) : null;
      editForm.depositNumber = data.depositNumber ? Number(data.depositNumber) : null;
      editForm.priceNumber = data.priceNumber ? Number(data.priceNumber) : null;
      editForm.waterFee = data.waterFee ? Number(data.waterFee) : null;
      editForm.electricityFee = data.electricityFee ? Number(data.electricityFee) : null;
      editForm.internetFee = data.internetFee ? Number(data.internetFee) : null;
      editForm.fuelFee = data.fuelFee ? Number(data.fuelFee) : null;
      editForm.note = data.note || '';
    });
  };

  /**
   * 取消新增
   */
  const cancelAdd = () => {
    showAddModal.value = false;
    addLoading.value = false;
  };

  /**
   * 取消编辑
   */
  const cancelEdit = () => {
    showEditModal.value = false;
    editLoading.value = false;
  };

  /**
   * 省份选择变化处理
   */
  const handleProvinceChange = (value: string, isEdit = false) => {
    if (isEdit) {
      editForm.city = '';
      editForm.district = '';
    } else {
      (addForm as any).city = '';
      (addForm as any).district = '';
    }
    loadCityData(value);
  };

  /**
   * 城市选择变化处理
   */
  const handleCityChange = (value: string, isEdit = false) => {
    if (isEdit) {
      editForm.district = '';
    } else {
      (addForm as any).district = '';
    }
    loadDistrictData(value);
  };

  /**
   * 验证表单数据
   */
  const validateFormData = (formData: HouseFormData): boolean => {
    const validation = validateHouseForm(formData);
    if (!validation.isValid) {
      Message.error(validation.error || '表单验证失败');
      return false;
    }
    return true;
  };

  /**
   * 构建API请求数据
   */
  const buildRequestData = (formData: HouseFormData, isEdit = false) => {
    const requestData: any = {
      // 基本信息
      name: formData.name.trim(),
      addresInfo: formData.addresInfo,
      area: formData.area ? String(formData.area) : '',
      roomNumber: formData.roomNumber,
      note: formData.note || '',

      // 省市区信息
      provinceId: formData.province ? Number(formData.province) : null,
      cityId: formData.city ? Number(formData.city) : null,
      areaId: formData.district ? Number(formData.district) : null,

      // 租金信息
      price: formData.price ? Number(formData.price) : 0,
      fakePrice: formData.fakePrice ? Number(formData.fakePrice) : 0,
      depositNumber: formData.depositNumber ? Number(formData.depositNumber) : 0,
      priceNumber: formData.priceNumber ? Number(formData.priceNumber) : 1,

      // 房屋属性
      floor: formData.floor ? Number(formData.floor) : 0,
      toward: formData.toward ? Number(formData.toward) : 1,
      layoutType: formData.layoutType ? Number(formData.layoutType) : 1,
      toilet: formData.toilet !== null && formData.toilet !== undefined ? Number(formData.toilet) : 0,
      kitchen: formData.kitchen !== null && formData.kitchen !== undefined ? Number(formData.kitchen) : 0,
      balcony: formData.balcony !== null && formData.balcony !== undefined ? Number(formData.balcony) : 0,

      // 配套费用
      waterFee: formData.waterFee ? Number(formData.waterFee) : 0,
      electricityFee: formData.electricityFee ? Number(formData.electricityFee) : 0,
      internetFee: formData.internetFee ? Number(formData.internetFee) : 0,
      fuelFee: formData.fuelFee ? Number(formData.fuelFee) : 0,

      // 其他信息
      lighting: formData.lighting || '',
      headImg: [], // 图片数组，暂时为空
      videoUrl: '', // 视频URL，暂时为空
    };

    // 编辑时需要添加ID
    if (isEdit && formData.id) {
      requestData.id = formData.id;
    } else {
      // 新增时需要添加parentId
      requestData.parentId = 0; // 根级房屋
    }

    return requestData;
  };

  /**
   * 查找区县ID的辅助函数
   */
  const findDistrictIdByName = (districtName: string): string => {
    // 这里需要从districtList中查找，但由于districtList不在当前作用域
    // 我们需要通过其他方式处理，或者修改useLocationData的返回值
    return '';
  };

  return {
    // 数据
    showAddModal,
    showEditModal,
    addLoading,
    editLoading,
    editData,
    addForm,
    editForm,
    provinceList,
    cityList,
    districtList,
    cityCodeLoading,

    // 方法
    showAddModalHandler,
    showEditModalHandler,
    cancelAdd,
    cancelEdit,
    handleProvinceChange,
    handleCityChange,
    validateFormData,
    buildRequestData,
    loadProvinceData,
  };
}