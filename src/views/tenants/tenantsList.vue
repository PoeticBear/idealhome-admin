<template>
  <div>
    <headForm :label-width="100">
      <headFormItem label="用户名：">
        <a-input
          v-model="searchData.name" placeholder="请输入..." allow-clear
          @change="searchList"
        />
      </headFormItem>
      <headFormItem label="手机号：">
        <a-input
          v-model="searchData.phone" placeholder="请输入..." allow-clear
          @change="searchList"
        />
      </headFormItem>
      <headFormItem label="状态：">
        <a-select
          v-model="searchData.status" placeholder="请选择 ..." :options="statusOption"
          allow-clear
          @change="searchList"
        >
        </a-select>
      </headFormItem>
      <headFormItem label="缴费状态：">
        <a-select
          v-model="searchData.paymentStatus" placeholder="请选择 ..." :options="paymentStatusOption"
          allow-clear
          @change="searchList"
        >
        </a-select>
      </headFormItem>
      <headFormItem label="创建时间：">
        <a-range-picker
          show-time
          @change="datePickerChange"
        />
      </headFormItem>
      <headFormItem type="button" @search="searchList">
      </headFormItem>
    </headForm>
    <a-table
      :columns="tableColumns" :loading="tableLoading"
      show-page-size :pagination="pagination"
      :data="userList" row-key="id" stripe
      @page-size-change="onPageSizeChange"
      @page-change="onPageChange"
    >
      <template #name="{ record }">
        <a-row align="center">
          <a-avatar v-if="record.headImg" class="mr10" :image-url="record.headImg" />
          <span>{{ record.name }}</span>
        </a-row>
      </template>
      <template #sourceType="{ record }">
        <a-tag v-if="record.sourceType === 1" color="green">
          微信
        </a-tag>
        <a-tag v-else>
          未知
        </a-tag>
      </template>
      <template #paymentStatus="{ record }">
        <a-tag :color="paymentStatusOption.find(item => item.value === record.paymentStatus)?.color">
          {{ paymentStatusOption.find(item => item.value === record.paymentStatus)?.label || '未知' }}
        </a-tag>
      </template>
      <template #status="{ record }">
        <a-tag :color="statusOption.find(item => item.value === record.status)?.color">
          {{ statusOption.find(item => item.value === record.status)?.label || '未知' }}
        </a-tag>
      </template>
      <template #operation="{ record }">
        <a-dropdown position="bottom">
          <a-button type="primary" size="mini">
            <template #icon>
              <icon-down />
            </template>
          </a-button>
          <template #content>
            <a-doption @click="viewPaymentRecords(record)">
              查看缴费记录
            </a-doption>
            <a-doption v-if="record.status === 1" @click="editUser(record, 2)">
              停用
            </a-doption>
            <a-doption v-if="record.status === 2" @click="editUser(record, 1)">
              启用
            </a-doption>
            <a-doption @click="editUser(record, 3)">
              删除
            </a-doption>
          </template>
        </a-dropdown>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { tenantsListUser, updateLandlordUserStatus } from '@/api/tenantsUser';
import { getPaymentStatus } from '@/api/tenantsPayment';
import { formatAmount } from '@/utils/amountUtils';
import useStore from '@/stores/index';
import { storeToRefs } from 'pinia'
import { Modal, Message } from '@arco-design/web-vue';
import router from '@/router';

const store = storeToRefs(useStore())

const pagination = reactive({
  total: 0,
  pageSize: 10,
  showPageSize: !store.isMobile,
  showTotal: true,
  showMore: true,
  showJumper: true,
  simple: store.isMobile,
  current: 1,
});

const tableColumns: object[] = reactive([
  {
    title: '用户名',
    dataIndex: 'name',
    slotName: 'name'
  },
  {
    title: '手机号',
    align: 'center',
    dataIndex: 'phone'
  },
  {
    title: '来源',
    align: 'center',
    dataIndex: 'sourceType',
    slotName: 'sourceType'
  },
  {
    title: '缴费状态',
    align: 'center',
    slotName: 'paymentStatus',
    dataIndex: 'paymentStatus'
  },
  {
    title: '状态',
    align: 'center',
    slotName: 'status',
    dataIndex: 'status'
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createdAt'
  },
  {
    title: '更新时间',
    align: 'center',
    dataIndex: 'updatedAt'
  },
  {
    title: '操作',
    align: 'center',
    slotName: 'operation',
  },
]);

const statusOption = reactive([
  {
    label: '全部',
    value: '',
    color: ''
  },
  {
    label: '正常',
    value: 1,
    color: 'green'
  },
  {
    label: '停用',
    value: 2,
    color: 'red'
  }
])

const paymentStatusOption = reactive([
  {
    label: '全部',
    value: '',
    color: ''
  },
  {
    label: '未缴费',
    value: 0,
    color: 'gray'
  },
  {
    label: '已缴费',
    value: 1,
    color: 'green'
  },
  {
    label: '欠费',
    value: 2,
    color: 'red'
  },
  {
    label: '部分缴费',
    value: 3,
    color: 'orange'
  }
])

const searchData = reactive({
  name: '',
  phone: '',
  status: '',
  paymentStatus: '',
  starTime: '',
  endTime: '',
  size: pagination.pageSize,
  index: pagination.current
});
let userList = reactive([]);
const tableLoading = ref(false);
const gettenantsListUser = () => {
  tableLoading.value = true;
  tenantsListUser(searchData)
    .then(({ status, data, count }) => {
      if (status === 1) {
        pagination.total = count || 0;
        userList = (data || [])
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
};
gettenantsListUser();

const onPageChange = (index: number) => {
  pagination.current = index;
  searchData.index = index;
  gettenantsListUser();
};
const onPageSizeChange = (size: number) => {
  pagination.pageSize = size;
  searchData.size = size;
  gettenantsListUser();
};
const searchList = () => {
  pagination.current = 1;
  searchData.index = 1;
  gettenantsListUser();
};

const datePickerChange = (value: any) => {
  if (value) {
    searchData.starTime = value[0]
    searchData.endTime = value[1]
  } else {
    searchData.starTime = ''
    searchData.endTime = ''
  }
  searchList()
}

const editUser = (data: any, status: number) => {
  const operationType = status === 1 ? '启用' : status === 2 ? '停用' : status === 3 ? '删除' : ''
  Modal.info({
    title: '提示',
    content: `是否${operationType}该租客？`,
    titleAlign: 'start',
    draggable: true,
    hideCancel: false,
    onOk: () => {
      updateLandlordUserStatus({
        id: data.id,
        status
      }).then(({
        status: apiStatus
      }) => {
        if (apiStatus === 1) {
          Message.success(operationType + '成功！')
          gettenantsListUser()
        }
      })
    },
  });
}

const viewPaymentRecords = (record: any) => {
  // 跳转到缴费记录页面，并传递租客ID
  router.push(`/tenants/paymentRecords?tenantId=${record.id}&tenantName=${record.name}`)
}
</script>

<style lang="scss">

</style>
