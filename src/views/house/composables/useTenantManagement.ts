import { ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
import { leaseRegister, uploadFile, getTenantDetailByHouseId } from '@/api/lease';
import { DEFAULT_FORM_VALUES, VALIDATION_RULES } from '../constants/form';
import { validateCheckinForm, validateImageFile } from '../utils/validators';
import { calculateMonthlyTotal, calculateStayDuration, calculateRemainingDays } from '../utils/calculators';
import { getPaymentDayLabel } from '../utils/formatters';

export interface TenantCheckinForm {
  tenantName: string;
  idCard: string;
  phoneNumber: string;
  idPhoto: any[];
  contractStartDate: string;
  contractEndDate: string;
  paymentDay: number | null;
  rentPrice: number | null;
  houseDeposit: number | null;
  otherDeposit: number | null;
  managementFee: number | null;
  internetFee: number | null;
  waterMeterReading: number | null;
  electricMeterReading: number | null;
  notes: string;
}

export interface TenantDetail {
  houseId: number;
  houseName: string;
  tenantName: string;
  phoneNumber: string;
  idCardNumber: string;
  idCardImage: string;
  joinTime: string;
  leaseStartDate: string;
  leaseEndDate: string;
  monthlyPaymentDay: number;
  rentPrice: number;
  houseDeposit: number;
  otherDeposit: number;
  propertyFee: number;
  internetFee: number;
  waterMeterReading: number;
  electricityMeterReading: number;
  remark: string;
}

/**
 * 租客管理组合式函数
 */
export function useTenantManagement() {
  // 弹窗显示状态
  const showCheckinModal = ref(false);
  const showTenantDetailModal = ref(false);
  const checkinLoading = ref(false);

  // 登记相关数据
  const checkinData = reactive({ houseId: 0, houseName: '' });
  const checkinForm = reactive<TenantCheckinForm>({ ...DEFAULT_FORM_VALUES.CHECKIN_FORM });

  // 租客详情数据
  const tenantDetailData = reactive<TenantDetail>({} as TenantDetail);

  /**
   * 显示租客入住登记弹窗
   */
  const showCheckinModalHandler = (house: any) => {
    // 重置表单数据
    Object.keys(checkinForm).forEach(key => {
      (checkinForm as any)[key] = (DEFAULT_FORM_VALUES.CHECKIN_FORM as any)[key];
    });

    // 设置房屋信息
    checkinData.houseId = house.id;
    checkinData.houseName = house.name;

    showCheckinModal.value = true;
  };

  /**
   * 取消租客入住登记
   */
  const cancelCheckin = () => {
    showCheckinModal.value = false;
    checkinLoading.value = false;
    // 重置表单
    Object.keys(checkinForm).forEach(key => {
      (checkinForm as any)[key] = (DEFAULT_FORM_VALUES.CHECKIN_FORM as any)[key];
    });
  };

  /**
   * 文件上传前的验证
   */
  const handleBeforeUpload = (file: File): boolean => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      Message.error(validation.error);
      return false;
    }
    return true;
  };

  /**
   * 文件选择变化处理
   */
  const handleFileChange = (fileList: any[], file: any) => {
    if (file.status === 'uploading') {
      // 开始上传
      Message.loading({
        content: '正在上传身份照片...',
        duration: 0
      });
    } else if (file.status === 'done') {
      // 上传成功
      Message.success({
        content: '身份照片上传成功'
      });
    } else if (file.status === 'error') {
      // 上传失败
      Message.error({
        content: '身份照片上传失败，请重试'
      });
    }
  };

  /**
   * 上传身份照片到服务器
   */
  const uploadIdCardImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'id_card');

      const response = await uploadFile(formData);

      if (response.status === 1) {
        return response.data.url;
      } else {
        Message.error(response.message || '照片上传失败');
        return null;
      }
    } catch (error: any) {
      console.error('上传身份照片失败:', error);
      Message.error('照片上传失败，请检查网络连接');
      return null;
    }
  };

  /**
   * 保存租客入住登记
   */
  const saveCheckin = async (onSuccess?: () => void): Promise<boolean> => {
    try {
      checkinLoading.value = true;

      // 验证表单数据
      const validation = validateCheckinForm(checkinForm);
      if (!validation.isValid) {
        Message.error(validation.error);
        return false;
      }

      // 处理身份照片上传
      let idCardImageUrl = '';
      if (checkinForm.idPhoto && checkinForm.idPhoto.length > 0 && checkinForm.idPhoto[0].originFile) {
        Message.loading({
          content: '正在上传身份照片...',
          duration: 0
        });

        idCardImageUrl = await uploadIdCardImage(checkinForm.idPhoto[0].originFile);

        if (!idCardImageUrl) {
          Message.error('身份照片上传失败，请重试');
          return false;
        }
      }

      // 构建API请求数据
      const requestData = {
        houseId: checkinData.houseId,
        tenantName: checkinForm.tenantName.trim(),
        idCardNumber: checkinForm.idCard.trim(),
        phone: checkinForm.phoneNumber.trim(),
        leaseStartDate: checkinForm.contractStartDate,
        leaseEndDate: checkinForm.contractEndDate,
        monthlyPaymentDay: checkinForm.paymentDay,
        rentPrice: Number(checkinForm.rentPrice) || 0,
        houseDeposit: Number(checkinForm.houseDeposit) || 0,
        otherDeposit: Number(checkinForm.otherDeposit) || 0,
        propertyFee: Number(checkinForm.managementFee) || 0,
        internetFee: Number(checkinForm.internetFee) || 0,
        waterMeterReading: Number(checkinForm.waterMeterReading) || 0,
        electricityMeterReading: Number(checkinForm.electricMeterReading) || 0,
        remark: checkinForm.notes?.trim() || '',
        idCardImage: idCardImageUrl
      };

      // 调用API进行租客入住登记
      const response = await leaseRegister(requestData);

      if (response.status === 1) {
        // 登记成功
        const successMessage = response.data?.contractNumber
          ? `租客入住登记成功！合同编号：${response.data.contractNumber}`
          : '租客入住登记成功！';

        Message.success({
          content: successMessage,
          duration: 5000
        });

        // 关闭弹窗
        showCheckinModal.value = false;

        // 执行成功回调
        if (onSuccess) {
          onSuccess();
        }

        return true;
      } else {
        // API返回失败
        Message.error({
          content: response.message || '租客入住登记失败',
          duration: 5000
        });
        return false;
      }

    } catch (error: any) {
      console.error('租客入住登记失败:', error);

      let errorMessage = '租客入住登记失败，请稍后重试';

      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          errorMessage = '未授权，请重新登录';
        } else if (status === 403) {
          errorMessage = '权限不足，无法进行入住登记';
        } else if (status === 404) {
          errorMessage = '房屋不存在或状态不可租赁';
        } else if (status === 422) {
          errorMessage = '数据验证失败，请检查输入信息';
        } else if (status >= 500) {
          errorMessage = '服务器错误，请稍后重试';
        }
      }

      Message.error({
        content: errorMessage,
        duration: 5000
      });

      return false;
    } finally {
      checkinLoading.value = false;
    }
  };

  /**
   * 显示租客详情弹窗
   */
  const showTenantDetailModalHandler = async (house: any): Promise<boolean> => {
    try {
      // 重置租客详情数据
      Object.keys(tenantDetailData).forEach(key => delete (tenantDetailData as any)[key]);

      // 设置房屋基本信息
      (tenantDetailData as any).houseId = house.id;
      (tenantDetailData as any).houseName = house.name;

      // 调用API获取租客详情数据
      const response = await getTenantDetailByHouseId(house.id);

      if (response.status === 1 && response.data && Array.isArray(response.data) && response.data.length > 0) {
        // 查找生效中的合同（status === 1），如果有多个，取最新的
        const activeContracts = response.data.filter((contract: any) => contract.status === 1);

        if (activeContracts.length === 0) {
          Message.warning('该房屋暂无生效中的租赁合同');
          return false;
        }

        // 按创建时间降序排序，取最新的合同
        const latestContract = activeContracts.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        // 提取租客信息
        if (latestContract.tenant) {
          tenantDetailData.tenantName = latestContract.tenant.realName || '';
          tenantDetailData.phoneNumber = latestContract.tenant.phone || '';
          tenantDetailData.idCardNumber = latestContract.tenant.idCardNumber || '';
          tenantDetailData.idCardImage = ''; // 租客头像需要单独处理
          tenantDetailData.joinTime = latestContract.createdAt || '';
        }

        // 设置租赁信息
        tenantDetailData.leaseStartDate = latestContract.leaseStartDate || '';
        tenantDetailData.leaseEndDate = latestContract.leaseEndDate || '';
        tenantDetailData.monthlyPaymentDay = latestContract.monthlyPaymentDay || 1;
        tenantDetailData.rentPrice = latestContract.rentPrice || 0;
        tenantDetailData.houseDeposit = latestContract.houseDeposit || 0;
        tenantDetailData.otherDeposit = latestContract.otherDeposit || 0;
        tenantDetailData.propertyFee = latestContract.propertyFee || 0;
        tenantDetailData.internetFee = latestContract.internetFee || 0;
        tenantDetailData.waterMeterReading = latestContract.waterMeterReading || 0;
        tenantDetailData.electricityMeterReading = latestContract.electricityMeterReading || 0;
        tenantDetailData.remark = latestContract.remark || '';

        showTenantDetailModal.value = true;
        return true;
      } else {
        // 如果API调用失败或没有数据，显示提示
        Message.warning('该房屋暂无租客信息');
        return false;
      }
    } catch (error) {
      console.error('获取租客详情失败:', error);
      Message.error('获取租客详情失败，请稍后重试');
      return false;
    }
  };

  /**
   * 关闭租客详情弹窗
   */
  const closeTenantDetail = () => {
    showTenantDetailModal.value = false;
    // 重置数据
    Object.keys(tenantDetailData).forEach(key => delete (tenantDetailData as any)[key]);
  };

  /**
   * 计算月度总费用
   */
  const calculateMonthlyTotalFee = (): number => {
    return calculateMonthlyTotal(
      tenantDetailData.rentPrice,
      tenantDetailData.propertyFee,
      tenantDetailData.internetFee
    );
  };

  /**
   * 计算入住时长
   */
  const calculateTenantStayDuration = (): string => {
    return calculateStayDuration(tenantDetailData.joinTime);
  };

  /**
   * 计算合同剩余天数
   */
  const calculateContractRemainingDays = (): number => {
    return calculateRemainingDays(tenantDetailData.leaseEndDate);
  };

  /**
   * 获取月结日标签
   */
  const getPaymentDayText = (): string => {
    return getPaymentDayLabel(tenantDetailData.monthlyPaymentDay);
  };

  return {
    // 数据
    showCheckinModal,
    showTenantDetailModal,
    checkinLoading,
    checkinData,
    checkinForm,
    tenantDetailData,

    // 方法
    showCheckinModalHandler,
    cancelCheckin,
    saveCheckin,
    showTenantDetailModalHandler,
    closeTenantDetail,
    handleBeforeUpload,
    handleFileChange,
    calculateMonthlyTotalFee,
    calculateTenantStayDuration,
    calculateContractRemainingDays,
    getPaymentDayText,
  };
}