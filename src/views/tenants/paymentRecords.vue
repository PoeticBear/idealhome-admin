<template>
  <div>
    <headForm :label-width="100">
      <headFormItem label="租客姓名：">
        <a-input
          v-model="searchData.tenantName" placeholder="请输入..." allow-clear
          @change="searchList"
        />
      </headFormItem>
      <headFormItem label="缴费类型：">
        <a-select
          v-model="searchData.paymentType" placeholder="请选择 ..." :options="paymentTypeOptions"
          allow-clear
          @change="searchList"
        >
        </a-select>
      </headFormItem>
      <headFormItem label="缴费状态：">
        <a-select
          v-model="searchData.status" placeholder="请选择 ..." :options="paymentStatusOptions"
          allow-clear
          @change="searchList"
        >
        </a-select>
      </headFormItem>
      <headFormItem label="缴费月份：">
        <a-month-picker
          v-model="searchData.paymentMonth"
          placeholder="请选择月份"
          format="YYYY-MM"
          @change="searchList"
        />
      </headFormItem>
      <headFormItem type="button" @search="searchList">
      </headFormItem>
    </headForm>

    <!-- 统计信息 -->
    <a-row :gutter="16" class="statistics-row">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="总金额" :value="statistics.totalAmount" :precision="2"
            suffix="元"
          >
            <template #prefix>
              <icon-dollar-circle />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="已缴金额" :value="statistics.paidAmount" :precision="2"
            suffix="元"
          >
            <template #prefix>
              <icon-check-circle />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="未缴金额" :value="statistics.unpaidAmount" :precision="2"
            suffix="元"
          >
            <template #prefix>
              <icon-exclamation-circle />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="欠费金额" :value="statistics.overdueAmount" :precision="2"
            suffix="元"
          >
            <template #prefix>
              <icon-close-circle />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-table
      :columns="tableColumns" :loading="tableLoading"
      show-page-size :pagination="pagination"
      :data="paymentRecords" row-key="id" stripe
      @page-size-change="onPageSizeChange"
      @page-change="onPageChange"
    >
      <template #tenantName="{ record }">
        <a-row align="center">
          <a-avatar v-if="record.tenant?.headImg" class="mr10" :image-url="record.tenant.headImg" />
          <span>{{ record.tenant?.name || '未知' }}</span>
        </a-row>
      </template>
      <template #paymentType="{ record }">
        <a-tag :color="getPaymentTypeColor(record.paymentType)">
          {{ getPaymentTypeLabel(record.paymentType) }}
        </a-tag>
      </template>
      <template #status="{ record }">
        <a-tag :color="getPaymentStatusColor(record.status)">
          {{ getPaymentStatusLabel(record.status) }}
        </a-tag>
      </template>
      <template #amount="{ record }">
        <span class="amount-text">¥{{ formatAmount(record.amount) }}</span>
      </template>
      <template #operation="{ record }">
        <a-dropdown position="bottom">
          <a-button type="primary" size="mini">
            <template #icon>
              <icon-down />
            </template>
          </a-button>
          <template #content>
            <a-doption v-if="record.status === 0" @click="updatePaymentStatus(record, 1)">
              标记为已缴费
            </a-doption>
            <a-doption v-if="record.status === 0" @click="updatePaymentStatus(record, 2)">
              标记为欠费
            </a-doption>
            <a-doption v-if="record.status === 2" @click="updatePaymentStatus(record, 1)">
              标记为已缴费
            </a-doption>
            <a-doption @click="viewDetail(record)">
              查看详情
            </a-doption>
          </template>
        </a-dropdown>
      </template>
    </a-table>

    <!-- 缴费状态更新弹窗 -->
    <a-modal
      v-model:visible="updateModalVisible"
      :title="updateModalTitle"
      @ok="handleUpdateStatus"
      @cancel="cancelUpdateStatus"
    >
      <a-form :model="updateForm" layout="vertical">
        <a-form-item label="缴费状态">
          <a-select v-model="updateForm.status" :options="paymentStatusOptions" />
        </a-form-item>
        <a-form-item label="缴费日期">
          <a-date-picker
            v-model="updateForm.paymentDate"
            style="width: 100%"
            format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model="updateForm.remark" placeholder="请输入备注..." />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import {
  getPaymentRecords,
  getPaymentStatus,
  updatePaymentStatus as updatePaymentRecord,
  paymentTypeOptions,
  paymentStatusOptions,
  type PaymentRecord,
  type PaymentStatus,
  type PaymentStatistics,
  type PaymentRecordsParams
} from '@/api/tenantsPayment';

// 导入金额工具函数
import { formatAmount } from '@/utils/amountUtils';

const route = useRoute();

// 分页配置
const pagination = reactive({
  total: 0,
  pageSize: 10,
  showPageSize: true,
  showTotal: true,
  showMore: true,
  showJumper: true,
  current: 1,
});

// 搜索参数
const searchData = reactive<PaymentRecordsParams>({
  tenantId: undefined,
  tenantName: '',
  paymentType: undefined,
  status: undefined,
  paymentMonth: undefined,
  size: pagination.pageSize,
  index: pagination.current,
});

// 统计信息
const statistics = reactive<PaymentStatistics>({
  totalAmount: 0,
  paidAmount: 0,
  unpaidAmount: 0,
  overdueAmount: 0,
  totalRecords: 0,
  paidRecords: 0,
  unpaidRecords: 0,
  overdueRecords: 0,
});

// 表格数据
const paymentRecords = reactive<PaymentRecord[]>([]);
const tableLoading = ref(false);

// 更新弹窗相关
const updateModalVisible = ref(false);
const updateModalTitle = ref('更新缴费状态');
const updateForm = reactive({
  id: 0,
  status: 0 as PaymentStatus,
  paymentDate: '',
  remark: '',
});

// 表格列配置
const tableColumns = reactive([
  {
    title: '租客',
    dataIndex: 'tenantName',
    slotName: 'tenantName',
    width: 150,
  },
  {
    title: '房源',
    dataIndex: ['house', 'name'],
    width: 200,
  },
  {
    title: '缴费类型',
    dataIndex: 'paymentType',
    slotName: 'paymentType',
    width: 100,
  },
  {
    title: '缴费月份',
    dataIndex: 'paymentMonth',
    width: 100,
  },
  {
    title: '金额',
    dataIndex: 'amount',
    slotName: 'amount',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
    width: 100,
  },
  {
    title: '截止日期',
    dataIndex: 'dueDate',
    width: 120,
  },
  {
    title: '缴费日期',
    dataIndex: 'paymentDate',
    width: 120,
  },
  {
    title: '操作',
    slotName: 'operation',
    width: 120,
  },
]);

// 获取缴费记录
const getPaymentRecordsList = () => {
  tableLoading.value = true;
  getPaymentRecords(searchData)
    .then(({ status, data, count }) => {
      if (status === 1) {
        paymentRecords.length = 0;
        if (data && Array.isArray(data)) {
          paymentRecords.push(...data);
        }
        pagination.total = count || 0;
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
};

// 获取统计信息
const getPaymentStatistics = () => {
  getPaymentStatus({
    tenantId: searchData.tenantId,
    paymentMonth: searchData.paymentMonth,
  }).then(({ status, data }) => {
    if (status === 1) {
      Object.assign(statistics, data.statistics);
    }
  });
};

// 获取缴费类型标签
const getPaymentTypeLabel = (type: number) => {
  const option = paymentTypeOptions.find(item => item.value === type);
  return option?.label || '未知';
};

// 获取缴费类型颜色
const getPaymentTypeColor = (type: number) => {
  const colorMap = {
    1: 'blue',
    2: 'cyan',
    3: 'orange',
    4: 'green',
    5: 'red',
    6: 'purple',
  };
  return colorMap[type as keyof typeof colorMap] || 'gray';
};

// 获取缴费状态标签
const getPaymentStatusLabel = (status: number) => {
  const option = paymentStatusOptions.find(item => item.value === status);
  return option?.label || '未知';
};

// 获取缴费状态颜色
const getPaymentStatusColor = (status: number) => {
  const option = paymentStatusOptions.find(item => item.value === status);
  return option?.color || 'gray';
};

// 更新缴费状态
const updatePaymentStatus = (record: PaymentRecord, status: PaymentStatus) => {
  updateForm.id = record.id;
  updateForm.status = status;
  updateForm.paymentDate = status === 1 ? new Date().toISOString().split('T')[0] : '';
  updateForm.remark = record.remark || '';
  updateModalTitle.value = `更新缴费状态 - ${getPaymentStatusLabel(status)}`;
  updateModalVisible.value = true;
};

// 处理更新状态
const handleUpdateStatus = () => {
  updatePaymentRecord({
    id: updateForm.id,
    status: updateForm.status,
    paymentDate: updateForm.paymentDate,
  }).then(({ status, message }) => {
    if (status === 1) {
      Message.success(message as string || '更新成功');
      updateModalVisible.value = false;
      getPaymentRecordsList();
      getPaymentStatistics();
    }
  });
};

// 取消更新状态
const cancelUpdateStatus = () => {
  updateModalVisible.value = false;
};

// 查看详情
const viewDetail = (record: PaymentRecord) => {
  // TODO: 实现详情查看功能
  Message.info('详情功能开发中');
};

// 分页变化
const onPageChange = (index: number) => {
  pagination.current = index;
  searchData.index = index;
  getPaymentRecordsList();
};

// 每页大小变化
const onPageSizeChange = (size: number) => {
  pagination.pageSize = size;
  searchData.size = size;
  getPaymentRecordsList();
};

// 搜索
const searchList = () => {
  pagination.current = 1;
  searchData.index = 1;
  getPaymentRecordsList();
  getPaymentStatistics();
};

// 初始化
onMounted(() => {
  // 从路由参数获取租客信息
  const tenantId = route.query.tenantId ? Number(route.query.tenantId) : undefined;
  const tenantName = route.query.tenantName as string || '';

  if (tenantId) {
    searchData.tenantId = tenantId;
    searchData.tenantName = tenantName;
  }

  getPaymentRecordsList();
  getPaymentStatistics();
});
</script>

<style lang="scss" scoped>
.statistics-row {
  margin-bottom: 20px;
}

.amount-text {
  font-weight: 500;
  color: #165dff;
}

.mr10 {
  margin-right: 10px;
}
</style>