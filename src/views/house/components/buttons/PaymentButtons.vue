<template>
  <div class="tenant-section">
    <a-button
      type="outline"
      size="small"
      class="tenant-btn"
      @click="$emit('viewTenant', house)"
    >
      <template #icon>
        <icon-user />
      </template>
      查看租客
    </a-button>
    <a-button
      type="outline"
      size="small"
      class="payment-btn"
      @click="$emit('payment', house)"
    >
      <template #icon>
        <icon-money-circle />
      </template>
      收款管理
    </a-button>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  house: any;
}

defineProps<Props>();

defineEmits<{
  viewTenant: [house: any];
  payment: [house: any];
}>();
</script>

<style scoped lang="scss">
.tenant-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-2);

  .tenant-btn, .payment-btn {
    width: 100%;
    height: 36px;
    font-weight: 600;
    font-size: 13px;
    border-radius: 6px;
    transition: all 0.3s ease;
    margin-bottom: 8px;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .payment-btn {
    margin-bottom: 0;
  }
}

// 移动端适配
@media (max-width: 768px) {
  .tenant-section {
    .tenant-btn, .payment-btn {
      height: 32px;
      font-size: 12px;
    }
  }
}
</style>