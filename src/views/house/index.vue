<template>
  <div class="house-list-container">
    <!-- 搜索筛选区域已隐藏 -->
    <!-- 暂时完全移除搜索表单以避免v-model触发问题 -->

    <!-- 操作按钮区域 -->
    <div class="table-operations">
      <div class="operations-left">
        <a-button type="primary" @click="showAddModalHandler">
          <template #icon>
            <icon-plus />
          </template>
          新增房屋
        </a-button>
        <a-button @click="handleOpenIncomeExpenseModal">
          <template #icon>
            <icon-bar-chart />
          </template>
          收支详情
        </a-button>
      </div>
      <div class="operations-right">
        <ViewModeToggle
          :view-mode="viewMode"
          @update:viewMode="viewMode = $event"
        />
      </div>
    </div>

    <!-- 表格视图 -->
    <HouseTable
      v-if="viewMode === 'table'"
      :house-list="houseList"
      :loading="tableLoading"
      :pagination="pagination"
      @page-size-change="onPageSizeChange"
      @page-change="onPageChange"
      @edit="showEdit"
      @detail="showInfo"
    />

    <!-- 卡片视图 -->
    <div v-if="viewMode === 'card'" class="card-view-container">
      <a-row :gutter="16">
        <a-col
          v-for="house in houseList"
          :key="house.id"
          :xs="24" :sm="12" :md="8" :lg="6" :xl="6"
        >
          <HouseCard
            :house="house"
            @edit="showEdit"
            @detail="showInfo"
            @checkin="handleShowCheckinModal"
            @view-tenant="handleShowTenantDetailModal"
            @payment="handlePaymentManagement"
            @utility="handleShowUtilityModal"
            @batch-utility="handleShowBatchUtilityModal"
          />
        </a-col>
      </a-row>

      <!-- 卡片视图分页 -->
      <div class="card-pagination">
        <a-pagination
          :total="pagination.total"
          :page-size="pagination.pageSize"
          :current="pagination.current"
          :show-page-size="pagination.showPageSize"
          :show-total="pagination.showTotal"
          :show-more="pagination.showMore"
          :show-jumper="pagination.showJumper"
          :simple="pagination.simple"
          @change="onPageChange"
          @page-size-change="onPageSizeChange"
        />
      </div>
    </div>

    <!-- 房屋详情弹窗 -->
    <HouseDetailModal
      :visible="showInfoModel"
      :house-data="showData"
      @update:visible="showInfoModel = $event"
    />

    <!-- 新增房屋弹窗 -->
    <HouseFormModal
      :visible="showAddModal"
      :form-type="'add'"
      :form-data="addForm"
      :loading="addLoading"
      :province-list="provinceList"
      :city-list="cityList"
      :district-list="districtList"
      :city-code-loading="cityCodeLoading"
      @update:visible="showAddModal = $event"
      @confirm="saveAdd"
      @province-change="handleProvinceChange"
      @city-change="handleCityChange"
    />

    <!-- 编辑房屋弹窗 -->
    <HouseFormModal
      :visible="showEditModal"
      :form-type="'edit'"
      :form-data="editForm"
      :loading="editLoading"
      :province-list="provinceList"
      :city-list="cityList"
      :district-list="districtList"
      :city-code-loading="cityCodeLoading"
      @update:visible="showEditModal = $event"
      @confirm="saveEdit"
      @province-change="(value) => handleProvinceChange(value, true)"
      @city-change="(value) => handleCityChange(value, true)"
    />

    <!-- 租客入住登记弹窗 -->
    <TenantCheckinModal
      :visible="showCheckinModal"
      :checkin-data="checkinData"
      :checkin-form="checkinForm"
      :loading="checkinLoading"
      @update:visible="showCheckinModal = $event"
      @confirm="saveCheckin"
    />

    <!-- 租客详情弹窗 -->
    <TenantDetailModal
      :visible="showTenantDetailModal"
      :tenant-detail-data="tenantDetailData"
      @update:visible="showTenantDetailModal = $event"
    />

    <!-- 水电录入弹窗组件 -->
    <UtilityModal
      :visible="showUtilityModal"
      :house="selectedHouse"
      @update:visible="showUtilityModal = $event"
      @success="handleUtilitySuccess"
    />

    <!-- 批量水电录入弹窗组件 -->
    <BatchUtilityModal
      :visible="showBatchUtilityModal"
      :houses="houseList"
      @update:visible="showBatchUtilityModal = $event"
      @success="handleBatchUtilitySuccess"
    />

    <!-- 收款管理弹窗组件 -->
    <PaymentModal
      :visible="showPaymentModal"
      :house="selectedHouse"
      @update:visible="showPaymentModal = $event"
      @success="handlePaymentSuccess"
    />

    <!-- 收支详情弹窗组件 -->
    <IncomeExpenseModal
      :visible="showIncomeExpenseModal"
      :houses="houseList"
      @update:visible="showIncomeExpenseModal = $event"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import useStore from '@/stores/index';
import { storeToRefs } from 'pinia';
import { Message } from '@arco-design/web-vue';

// 导入组合式函数
import { useHouseList } from './composables/useHouseList';
import { useHouseForm } from './composables/useHouseForm';
import { useTenantManagement } from './composables/useTenantManagement';

// 导入组件
import ViewModeToggle from './components/ViewModeToggle.vue';
import HouseTable from './components/HouseTable.vue';
import HouseCard from './components/HouseCard.vue';
import HouseFormModal from './components/forms/HouseFormModal.vue';
import TenantCheckinModal from './components/forms/TenantCheckinModal.vue';
import HouseDetailModal from './components/modals/HouseDetailModal.vue';
import TenantDetailModal from './components/modals/TenantDetailModal.vue';

// 导入外部组件（这些组件可能来自其他目录）
import UtilityModal from '@/components/utility/UtilityModal.vue';
import BatchUtilityModal from '@/components/utility/BatchUtilityModal.vue';
import PaymentModal from '@/components/utility/PaymentModal.vue';
import IncomeExpenseModal from '@/components/utility/IncomeExpenseModal.vue';

const store = storeToRefs(useStore());

// 使用组合式函数
const {
  houseList,
  tableLoading,
  pagination,
  fetchHouseList,
  onPageChange,
  onPageSizeChange,
  updateHouseInfo,
  createNewHouse,
} = useHouseList();

const {
  showAddModal,
  showEditModal,
  addLoading,
  editLoading,
  addForm,
  editForm,
  provinceList,
  cityList,
  districtList,
  cityCodeLoading,
  showAddModalHandler,
  showEditModalHandler,
  cancelAdd,
  cancelEdit,
  handleProvinceChange,
  handleCityChange,
  validateFormData,
  buildRequestData,
  loadProvinceData,
} = useHouseForm();

const {
  showCheckinModal,
  showTenantDetailModal,
  checkinLoading,
  checkinData,
  checkinForm,
  tenantDetailData,
  showCheckinModalHandler,
  cancelCheckin,
  saveCheckin,
  showTenantDetailModalHandler,
  closeTenantDetail,
} = useTenantManagement();

// 视图模式状态管理
const viewMode = ref<'table' | 'card'>('card');

// 详情弹窗相关
const showInfoModel = ref(false);
const showData: any = reactive({});

// 水电和收款管理相关
const showUtilityModal = ref(false);
const showBatchUtilityModal = ref(false);
const showPaymentModal = ref(false);
const showIncomeExpenseModal = ref(false);
const selectedHouse = ref(null);

// 显示房屋详情
const showInfo = (data: any) => {
  // 复制数据到 showData
  Object.assign(showData, data);

  // 处理基本信息
  showData.basicInfo = [
    { label: '房屋名称：', value: data.name },
    { label: '房号：', value: data.roomNumber },
    { label: '所在地区：', value: `${data.provinceName || ''} ${data.cityName || ''} ${data.areaName || ''}`.trim() },
    { label: '面积：', value: data.area ? `${data.area}㎡` : null },
    { label: '楼层：', value: data.floor },
    { label: '户型：', value: data.layoutType },
  ];

  // 处理其他信息...
  // 这里可以继续添加更多的数据处理逻辑

  showInfoModel.value = true;
};

// 显示编辑弹窗
const showEdit = (data: any) => {
  showEditModalHandler(data);
};

// 保存新增
const saveAdd = async () => {
  if (!validateFormData(addForm)) {
    return;
  }

  const requestData = buildRequestData(addForm, false);
  const result = await createNewHouse(requestData);

  if (result) {
    showAddModal.value = false;
  }
};

// 保存编辑
const saveEdit = async () => {
  if (!validateFormData(editForm)) {
    return;
  }

  const requestData = buildRequestData(editForm, true);
  const result = await updateHouseInfo(editForm.id!, requestData);

  if (result) {
    showEditModal.value = false;
  }
};

// 显示租客入住登记
const handleShowCheckinModal = (house: any) => {
  showCheckinModalHandler(house);
};

// 保存租客入住登记
const saveCheckinHandler = async () => {
  const result = await saveCheckin(() => {
    fetchHouseList(); // 刷新列表
  });
  return result;
};

// 显示租客详情
const handleShowTenantDetailModal = (house: any) => {
  showTenantDetailModalHandler(house);
};

// 水电录入相关
const handleShowUtilityModal = (house: any) => {
  selectedHouse.value = house;
  showUtilityModal.value = true;
};

const handleShowBatchUtilityModal = () => {
  showBatchUtilityModal.value = true;
};

const handleUtilitySuccess = (data: any) => {
  console.log('水电录入成功:', data);
  Message.success('水电费用录入成功！');
  showUtilityModal.value = false;
  selectedHouse.value = null;
};

const handleBatchUtilitySuccess = (data: any) => {
  console.log('批量水电录入成功:', data);
  Message.success(`批量水电费用录入成功！共录入 ${data.length} 套房屋的费用信息`);
  showBatchUtilityModal.value = false;
};

// 收款管理相关
const handlePaymentManagement = (house: any) => {
  selectedHouse.value = house;
  showPaymentModal.value = true;
};

const handlePaymentSuccess = (data: any) => {
  console.log('收款管理操作成功:', data);
  Message.success('收款管理操作成功！');
  showPaymentModal.value = false;
  selectedHouse.value = null;
};

// 收支详情相关
const handleOpenIncomeExpenseModal = () => {
  showIncomeExpenseModal.value = true;
};

// 组件挂载时初始化数据
onMounted(() => {
  // 延迟一点时间再初始化，确保组件完全挂载
  setTimeout(() => {
    fetchHouseList();
    loadProvinceData(); // 加载省份数据
  }, 100);
});
</script>

<style scoped lang="scss">
// 页面主容器宽度优化
.house-list-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 1440px) {
    max-width: 1200px;
  }

  @media (max-width: 1200px) {
    max-width: 100%;
    padding: 0 16px;
  }

  @media (max-width: 768px) {
    padding: 0 12px;
  }
}

// 表格操作按钮区域样式
.table-operations {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;

  .arco-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(var(--color-primary-6), 0.2);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// 卡片视图样式
.card-view-container {
  margin-bottom: 20px;

  // 优化卡片网格布局
  :deep(.arco-row) {
    margin: 0 -8px; // 抵消列的间距

    .arco-col {
      padding: 0 8px; // 列间距
    }
  }
}

.card-pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding: 20px 0;
  border-top: 1px solid var(--color-border-2);
}

// 响应式布局
@media (max-width: 768px) {
  .table-operations {
    justify-content: center;
    margin-bottom: 12px;

    .arco-btn {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>