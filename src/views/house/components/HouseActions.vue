<template>
  <a-space size="mini">
    <a-button type="outline" size="mini" @click="$emit('edit', house)">
      编辑
    </a-button>
    <a-button type="primary" size="mini" @click="$emit('detail', house)">
      详情
    </a-button>
  </a-space>
</template>

<script lang="ts" setup>
interface Props {
  house: any;
}

defineProps<Props>();

defineEmits<{
  edit: [house: any];
  detail: [house: any];
}>();
</script>

<style scoped lang="scss">
:deep(.arco-btn) {
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>