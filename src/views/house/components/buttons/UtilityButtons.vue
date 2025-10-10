<template>
  <div class="utility-section">
    <a-button
      type="outline"
      size="small"
      class="utility-btn"
      @click="$emit('utility', house)"
    >
      <template #icon>
        <icon-thunderbolt />
      </template>
      录入水电
    </a-button>
    <a-button
      type="primary"
      size="small"
      class="batch-utility-btn"
      @click="$emit('batchUtility')"
    >
      <template #icon>
        <icon-thunderbolt />
      </template>
      批量录入
    </a-button>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  house: any;
}

defineProps<Props>();

defineEmits<{
  utility: [house: any];
  batchUtility: [];
}>();
</script>

<style scoped lang="scss">
.utility-section {
  display: flex;
  gap: 8px;

  .utility-btn, .batch-utility-btn {
    height: 32px;
    font-size: 13px;
    border-radius: 6px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .utility-btn {
    flex: 1;
  }

  .batch-utility-btn {
    flex: 1;
  }
}

// 响应式设计
@media (max-width: 480px) {
  .utility-section {
    display: flex;
    gap: 8px;

    .utility-btn, .batch-utility-btn {
      height: 30px;
      font-size: 11px;
    }
  }
}
</style>