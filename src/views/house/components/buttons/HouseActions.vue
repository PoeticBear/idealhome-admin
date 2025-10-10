<template>
  <div class="checkin-section" v-if="house.status === 1">
    <a-button
      type="primary"
      size="small"
      class="checkin-btn"
      @click="$emit('checkin', house)"
    >
      <template #icon>
        <icon-user-add />
      </template>
      租客入住登记
    </a-button>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  house: any;
}

defineProps<Props>();

defineEmits<{
  checkin: [house: any];
}>();
</script>

<style scoped lang="scss">
.checkin-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-2);

  .checkin-btn {
    width: 100%;
    height: 36px;
    font-weight: 600;
    font-size: 13px;
    border-radius: 6px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(var(--color-primary-6), 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .checkin-section {
    .checkin-btn {
      height: 32px;
      font-size: 12px;
    }
  }
}
</style>