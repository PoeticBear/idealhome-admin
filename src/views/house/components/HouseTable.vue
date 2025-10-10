<template>
  <a-table
    :columns="tableColumns"
    :loading="loading"
    stripe
    show-page-size
    :pagination="pagination"
    :data="houseList"
    row-key="id"
    @page-size-change="$emit('pageSizeChange', $event)"
    @page-change="$emit('pageChange', $event)"
  >
    <template #status="{ record }">
      <a-tag :color="getStatusInfo(record.status).color">
        {{ getStatusInfo(record.status).label }}
      </a-tag>
    </template>

    <template #operation="{ record }">
      <HouseActions
        :house="record"
        @edit="$emit('edit', $event)"
        @detail="$emit('detail', $event)"
      />
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { getStatusInfo } from '../utils/formatters';
import HouseActions from './HouseActions.vue';

interface Props {
  houseList: any[];
  loading: boolean;
  pagination: any;
}

const props = defineProps<Props>();

defineEmits<{
  pageSizeChange: [size: number];
  pageChange: [page: number];
  edit: [house: any];
  detail: [house: any];
}>();

// 表格列配置
const tableColumns = computed(() => [
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '所在地区',
    align: 'center',
    dataIndex: 'location',
  },
  {
    title: '户型',
    align: 'center',
    dataIndex: 'layoutTypeText',
  },
  {
    title: '面积',
    align: 'center',
    dataIndex: 'areaText',
  },
  {
    title: '租金',
    align: 'center',
    dataIndex: 'priceText',
  },
  {
    title: '状态',
    align: 'center',
    slotName: 'status',
    dataIndex: 'status'
  },
  {
    title: '操作',
    align: 'center',
    slotName: 'operation',
  },
]);
</script>

<style scoped lang="scss">
:deep(.arco-table) {
  .arco-table-th {
    background-color: var(--color-fill-1);
    font-weight: 600;
    color: var(--color-text-1);
  }

  .arco-table-td {
    &:hover {
      background-color: var(--color-fill-1);
    }
  }

  .arco-table-tr {
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
  }

  .arco-tag {
    font-weight: 500;
    font-size: 12px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  :deep(.arco-table) {
    font-size: 12px;

    .arco-table-th {
      padding: 8px 4px;
    }

    .arco-table-td {
      padding: 8px 4px;
    }
  }
}
</style>