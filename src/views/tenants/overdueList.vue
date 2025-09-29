<template>
  <div>
    <headForm :label-width="100">
      <headFormItem label="房源：">
        <a-select
          v-model="searchData.houseId" placeholder="请选择房源..." :options="houseOptions"
          allow-clear
          @change="searchList"
        >
        </a-select>
      </headFormItem>
      <headFormItem label="欠费天数：">
        <a-select
          v-model="searchData.overdueDays" placeholder="请选择..." :options="overdueDaysOptions"
          allow-clear
          @change="searchList"
        >
        </a-select>
      </headFormItem>
      <headFormItem type="button" @search="searchList">
      </headFormItem>
    </headForm>

    <!-- 统计信息 -->
    <a-row :gutter="16" class="statistics-row">
      <a-col :span="6">
        <a-card>
          <a-statistic title="欠费租客数" :value="statistics.totalOverdueTenants">
            <template #prefix>
              <icon-user />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="欠费总金额" :value="statistics.totalOverdueAmount" :precision="2"
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
            title="平均欠费天数" :value="statistics.averageOverdueDays" :precision="1"
            suffix="天"
          >
            <template #prefix>
              <icon-calendar />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="最长欠费天数" :value="statistics.maxOverdueDays" suffix="天">
            <template #prefix>
              <icon-exclamation />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-table
      :columns="tableColumns" :loading="tableLoading"
      show-page-size :pagination="pagination"
      :data="overdueRecords" row-key="id" stripe
      @page-size-change="onPageSizeChange"
      @page-change="onPageChange"
    >
      <template #tenantName="{ record }">
        <a-row align="center">
          <a-avatar v-if="record.tenant?.headImg" class="mr10" :image-url="record.tenant.headImg" />
          <span>{{ record.tenant?.name || '未知' }}</span>
        </a-row>
      </template>
      <template #houseInfo="{ record }">
        <div>
          <div>{{ record.house?.name || '未知房源' }}</div>
          <div v-if="record.house" class="house-address">
            {{ record.house.provinceName }}{{ record.house.cityName }}{{ record.house.areaName }}{{ record.house.addresInfo }}
          </div>
        </div>
      </template>
      <template #paymentType="{ record }">
        <a-tag :color="getPaymentTypeColor(record.paymentType)">
          {{ getPaymentTypeLabel(record.paymentType) }}
        </a-tag>
      </template>
      <template #overdueDays="{ record }">
        <a-tag :color="getOverdueDaysColor(record.overdueDays)">
          {{ record.overdueDays }}天
        </a-tag>
      </template>
      <template #amount="{ record }">
        <span class="amount-text overdue">¥{{ formatAmount(record.amount) }}</span>
      </template>
      <template #operation="{ record }">
        <a-space>
          <a-button type="primary" size="mini" @click="sendReminder(record)">
            发送催缴
          </a-button>
          <a-button type="outline" size="mini" @click="markAsPaid(record)">
            标记缴费
          </a-button>
          <a-dropdown>
            <a-button type="outline" size="mini">
              <template #icon>
                <icon-more />
              </template>
            </a-button>
            <template #content>
              <a-doption @click="viewDetail(record)">
                查看详情
              </a-doption>
              <a-doption @click="viewPaymentHistory(record)">
                缴费历史
              </a-doption>
            </template>
          </a-dropdown>
        </a-space>
      </template>
    </a-table>

    <!-- 催缴弹窗 -->
    <a-modal
      v-model:visible="reminderModalVisible"
      title="发送催缴通知"
      @ok="handleSendReminder"
      @cancel="cancelReminder"
    >
      <a-form :model="reminderForm" layout="vertical">
        <a-form-item label="催缴对象">
          <div>
            <div>{{ reminderForm.tenantName }}</div>
            <div class="tenant-info">
              {{ reminderForm.houseName }}
            </div>
          </div>
        </a-form-item>
        <a-form-item label="催缴内容">
          <a-textarea
            v-model="reminderForm.content"
            :rows="4"
            placeholder="请输入催缴内容..."
          />
        </a-form-item>
        <a-form-item label="发送方式">
          <a-checkbox-group v-model="reminderForm.sendMethods">
            <a-checkbox value="sms">
              短信
            </a-checkbox>
            <a-checkbox value="app">
              APP推送
            </a-checkbox>
            <a-checkbox value="email">
              邮件
            </a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 标记缴费弹窗 -->
    <a-modal
      v-model:visible="paymentModalVisible"
      title="标记缴费"
      @ok="handleMarkAsPaid"
      @cancel="cancelPayment"
    >
      <a-form :model="paymentForm" layout="vertical">
        <a-form-item label="缴费金额">
          <a-input-number
            v-model="paymentForm.amount"
            :min="0"
            :precision="2"
            placeholder="请输入缴费金额"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="缴费日期">
          <a-date-picker
            v-model="paymentForm.paymentDate"
            style="width: 100%"
            format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item label="缴费方式">
          <a-select v-model="paymentForm.paymentMethod" placeholder="请选择缴费方式">
            <a-option value="cash">
              现金
            </a-option>
            <a-option value="bank">
              银行转账
            </a-option>
            <a-option value="wechat">
              微信支付
            </a-option>
            <a-option value="alipay">
              支付宝
            </a-option>
            <a-option value="other">
              其他
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model="paymentForm.remark" placeholder="请输入备注..." />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue';
import { Message } from '@arco-design/web-vue';
import {
  getOverdueTenants,
  updatePaymentStatus,
  paymentTypeOptions,
  paymentStatusOptions,
  type PaymentRecord,
  type PaymentStatus,
  type OverdueParams
} from '@/api/tenantsPayment';

// 导入金额工具函数
import { formatAmount, parseAmount } from '@/utils/amountUtils';

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
const searchData = reactive<OverdueParams>({
  houseId: undefined,
  overdueDays: undefined,
  size: pagination.pageSize,
  index: pagination.current,
});

// 统计信息
const statistics = reactive({
  totalOverdueTenants: 0,
  totalOverdueAmount: 0,
  averageOverdueDays: 0,
  maxOverdueDays: 0,
});

// 表格数据
const overdueRecords = reactive<PaymentRecord[]>([]);
const tableLoading = ref(false);

// 房源选项（示例数据，实际应从API获取）
const houseOptions = reactive([
  { label: '沙嘴村两室一厅', value: 1 },
  { label: '沙嘴村单间公寓', value: 2 },
  { label: '城中村一室一厅', value: 3 },
]);

// 欠费天数选项
const overdueDaysOptions = reactive([
  { label: '全部', value: '' },
  { label: '1-7天', value: '1-7' },
  { label: '8-30天', value: '8-30' },
  { label: '31-90天', value: '31-90' },
  { label: '90天以上', value: '90+' },
]);

// 催缴弹窗相关
const reminderModalVisible = ref(false);
const reminderForm = reactive({
  tenantId: 0,
  tenantName: '',
  houseName: '',
  content: '',
  sendMethods: ['sms'],
});

// 缴费弹窗相关
const paymentModalVisible = ref(false);
const paymentForm = reactive({
  id: 0,
  amount: 0,
  paymentDate: '',
  paymentMethod: '',
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
    title: '房源信息',
    dataIndex: 'houseInfo',
    slotName: 'houseInfo',
    width: 250,
  },
  {
    title: '欠费类型',
    dataIndex: 'paymentType',
    slotName: 'paymentType',
    width: 100,
  },
  {
    title: '欠费月份',
    dataIndex: 'paymentMonth',
    width: 100,
  },
  {
    title: '欠费金额',
    dataIndex: 'amount',
    slotName: 'amount',
    width: 120,
  },
  {
    title: '欠费天数',
    dataIndex: 'overdueDays',
    slotName: 'overdueDays',
    width: 100,
  },
  {
    title: '截止日期',
    dataIndex: 'dueDate',
    width: 120,
  },
  {
    title: '操作',
    slotName: 'operation',
    width: 200,
  },
]);

// 获取欠费记录
const getOverdueRecordsList = () => {
  tableLoading.value = true;
  getOverdueTenants(searchData)
    .then(({ status, data, count }) => {
      if (status === 1) {
        overdueRecords.length = 0;
        if (data && Array.isArray(data)) {
          overdueRecords.push(...data);
        }
        pagination.total = count || 0;
        calculateStatistics();
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
};

// 计算统计信息
const calculateStatistics = () => {
  const totalTenants = overdueRecords.length;
  const totalAmount = overdueRecords.reduce((sum, record) => sum + parseAmount(record.amount), 0);
  const overdueDays = overdueRecords.map(record => record.overdueDays || 0);
  const averageDays = overdueDays.length > 0 ? overdueDays.reduce((sum, days) => sum + days, 0) / overdueDays.length : 0;
  const maxDays = overdueDays.length > 0 ? Math.max(...overdueDays) : 0;

  statistics.totalOverdueTenants = totalTenants;
  statistics.totalOverdueAmount = totalAmount;
  statistics.averageOverdueDays = averageDays;
  statistics.maxOverdueDays = maxDays;
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

// 获取欠费天数颜色
const getOverdueDaysColor = (days: number) => {
  if (days <= 7) return 'orange';
  if (days <= 30) return 'red';
  return 'darkred';
};

// 发送催缴
const sendReminder = (record: PaymentRecord) => {
  reminderForm.tenantId = record.tenantId;
  reminderForm.tenantName = record.tenant?.name || '';
  reminderForm.houseName = record.house?.name || '';
  reminderForm.content = `您的${record.paymentMonth}月${getPaymentTypeLabel(record.paymentType)}￥${formatAmount(record.amount)}已逾期${record.overdueDays}天，请尽快缴费。如有疑问请联系房东。`;
  reminderModalVisible.value = true;
};

// 处理发送催缴
const handleSendReminder = () => {
  // TODO: 实际调用发送催缴的API
  Message.success('催缴通知发送成功');
  reminderModalVisible.value = false;
};

// 取消催缴
const cancelReminder = () => {
  reminderModalVisible.value = false;
};

// 标记缴费
const markAsPaid = (record: PaymentRecord) => {
  paymentForm.id = record.id;
  paymentForm.amount = parseAmount(record.amount);
  paymentForm.paymentDate = new Date().toISOString().split('T')[0];
  paymentForm.paymentMethod = '';
  paymentForm.remark = '';
  paymentModalVisible.value = true;
};

// 处理标记缴费
const handleMarkAsPaid = () => {
  updatePaymentStatus({
    id: paymentForm.id,
    status: 1, // 已缴费
    paymentDate: paymentForm.paymentDate,
  }).then(({ status, message }) => {
    if (status === 1) {
      Message.success(message as string || '标记缴费成功');
      paymentModalVisible.value = false;
      getOverdueRecordsList();
    }
  });
};

// 取消标记缴费
const cancelPayment = () => {
  paymentModalVisible.value = false;
};

// 查看详情
const viewDetail = (record: PaymentRecord) => {
  // TODO: 实现详情查看功能
  Message.info('详情功能开发中');
};

// 查看缴费历史
const viewPaymentHistory = (record: PaymentRecord) => {
  // TODO: 跳转到缴费记录页面
  Message.info('缴费历史功能开发中');
};

// 分页变化
const onPageChange = (index: number) => {
  pagination.current = index;
  searchData.index = index;
  getOverdueRecordsList();
};

// 每页大小变化
const onPageSizeChange = (size: number) => {
  pagination.pageSize = size;
  searchData.size = size;
  getOverdueRecordsList();
};

// 搜索
const searchList = () => {
  pagination.current = 1;
  searchData.index = 1;
  getOverdueRecordsList();
};

// 初始化
onMounted(() => {
  getOverdueRecordsList();
});
</script>

<style lang="scss" scoped>
.statistics-row {
  margin-bottom: 20px;
}

.house-address {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.amount-text {
  font-weight: 500;

  &.overdue {
    color: #f53f3f;
  }
}

.tenant-info {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.mr10 {
  margin-right: 10px;
}
</style>