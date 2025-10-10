<template>
  <a-radio-group :model-value="viewMode" type="button" size="small" @update:model-value="$emit('update:viewMode', $event)">
    <a-radio value="table">
      <template #icon>
        <icon-list />
      </template>
      列表视图
    </a-radio>
    <a-radio value="card">
      <template #icon>
        <icon-grid />
      </template>
      卡片视图
    </a-radio>
  </a-radio-group>
</template>

<script lang="ts" setup>
interface Props {
  viewMode: 'table' | 'card';
}

defineProps<Props>();

defineEmits<{
  'update:viewMode': [value: 'table' | 'card'];
}>();
</script>

<style scoped lang="scss">
:deep(.arco-radio-group) {
  .arco-radio-button {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 500;

    &:hover {
      color: var(--color-primary-6);
    }

    &.arco-radio-button-checked {
      background-color: var(--color-primary-6);
      border-color: var(--color-primary-6);
      color: white;
    }
  }
}
</style>