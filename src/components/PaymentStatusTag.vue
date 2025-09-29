<template>
  <a-tag :color="getStatusColor(status)">
    <template #icon>
      <component :is="getStatusIcon(status)" />
    </template>
    {{ getStatusLabel(status) }}
  </a-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  status: number;
  showIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showIcon: true,
});

// 状态标签配置
const statusConfig = [
  { value: 0, label: '未缴费', color: 'gray', icon: 'clock-circle' },
  { value: 1, label: '已缴费', color: 'green', icon: 'check-circle' },
  { value: 2, label: '欠费', color: 'red', icon: 'exclamation-circle' },
  { value: 3, label: '部分缴费', color: 'orange', icon: 'question-circle' },
];

// 获取状态标签
const getStatusLabel = (status: number) => {
  const config = statusConfig.find(item => item.value === status);
  return config?.label || '未知';
};

// 获取状态颜色
const getStatusColor = (status: number) => {
  const config = statusConfig.find(item => item.value === status);
  return config?.color || 'gray';
};

// 获取状态图标
const getStatusIcon = (status: number) => {
  const config = statusConfig.find(item => item.value === status);
  return config?.icon || 'question-circle';
};
</script>

<style lang="scss" scoped>
// 可以添加自定义样式
</style>