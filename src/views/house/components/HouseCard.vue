<template>
  <a-card class="house-card" :hoverable="true" :class="`status-${house.status}`">
    <template #cover>
      <div class="card-cover">
        <!-- 状态徽章 -->
        <div class="status-badge">
          <component :is="getStatusIcon(house.status)" size="16" />
        </div>

        <!-- 状态文字标识 -->
        <div class="status-text-center">
          <component :is="getStatusIcon(house.status)" size="32" />
          <span>{{ getStatusInfo(house.status).label }}</span>
        </div>

        <!-- 悬浮操作按钮 -->
        <div class="card-actions">
          <a-button
            type="primary"
            shape="circle"
            size="mini"
            class="action-btn edit-btn"
            @click="$emit('edit', house)"
          >
            <icon-edit />
          </a-button>
          <a-button
            type="outline"
            shape="circle"
            size="mini"
            class="action-btn view-btn"
            @click="$emit('detail', house)"
          >
            <icon-eye />
          </a-button>
        </div>
      </div>
    </template>

    <div class="card-content">
      <!-- 房屋名称区域 -->
      <div class="title-section">
        <div class="house-title">{{ house.name }}</div>
      </div>

      <!-- 价格区域 -->
      <div class="price-section">
        <div class="price-value">{{ house.priceText }}</div>
      </div>

      <!-- 基本信息区域 -->
      <div class="basic-info-section">
        <div class="info-row">
          <div class="info-item">
            <icon-home class="info-icon" />
            <span>{{ house.layoutTypeText }}</span>
          </div>
          <div class="info-item">
            <icon-fullscreen class="info-icon" />
            <span>{{ house.areaText }}</span>
          </div>
        </div>
      </div>

      <!-- 底部信息区域 -->
      <div class="bottom-section">
        <!-- 地区信息 -->
        <div class="location-row">
          <div class="location-info">
            <icon-location class="info-icon" />
            <span>{{ house.location }}</span>
          </div>
        </div>

        <!-- 操作按钮区域 -->
        <div class="action-section">
          <!-- 租客入住登记按钮（仅待租状态显示） -->
          <div v-if="house.status === 1" class="action-group">
            <a-button
              type="primary"
              size="mini"
              class="action-btn-small checkin-btn"
              @click="$emit('checkin', house)"
            >
              <template #icon>
                <icon-user-add />
              </template>
              租客入住
            </a-button>
          </div>

          <!-- 查看租客按钮（仅已租状态显示） -->
          <div v-if="house.status === 2" class="action-group">
            <a-button
              type="outline"
              size="mini"
              class="action-btn-small"
              @click="$emit('viewTenant', house)"
            >
              <template #icon>
                <icon-user />
              </template>
              查看租客
            </a-button>
            <a-button
              type="outline"
              size="mini"
              class="action-btn-small"
              @click="$emit('payment', house)"
            >
              <template #icon>
                <icon-money-circle />
              </template>
              收款
            </a-button>
          </div>

          <!-- 水电录入按钮（所有状态显示） -->
          <div class="action-group">
            <a-button
              type="outline"
              size="mini"
              class="action-btn-small"
              @click="$emit('utility', house)"
            >
              <template #icon>
                <icon-thunderbolt />
              </template>
              水电录入
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { getStatusInfo } from '../utils/formatters';

interface Props {
  house: any;
}

defineProps<Props>();

defineEmits<{
  edit: [house: any];
  detail: [house: any];
  checkin: [house: any];
  viewTenant: [house: any];
  payment: [house: any];
  utility: [house: any];
}>();

// 获取状态图标
const getStatusIcon = (status: number) => {
  switch (status) {
    case 1: // 待租
      return 'icon-check-circle';
    case 2: // 已租
      return 'icon-user';
    default: // 其他状态
      return 'icon-minus-circle';
  }
};
</script>

<style scoped lang="scss">
.house-card {
  // 定义状态主题色变量
  --status-available-primary: #60a5fa; // 浅蓝色 - 未出租
  --status-available-secondary: #3b82f6;
  --status-rented-primary: #10b981; // 绿色 - 已出租
  --status-rented-secondary: #059669;
  --status-other-primary: #6b7280; // 灰色 - 其他状态
  --status-other-secondary: #4b5563;
  margin-bottom: 16px;
  width: 100%;
  height: 380px; // 增加固定高度，确保内容完整显示
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }

  // 状态背景色 - 使用 :deep() 穿透 Arco Design 样式
  &.status-1 {
    :deep(.arco-card-cover) {
      background: linear-gradient(135deg, var(--status-available-primary) 0%, var(--status-available-secondary) 100%) !important;
    }
    .card-cover {
      background: linear-gradient(135deg, var(--status-available-primary) 0%, var(--status-available-secondary) 100%);
    }
  }

  &.status-2 {
    :deep(.arco-card-cover) {
      background: linear-gradient(135deg, var(--status-rented-primary) 0%, var(--status-rented-secondary) 100%) !important;
    }
    .card-cover {
      background: linear-gradient(135deg, var(--status-rented-primary) 0%, var(--status-rented-secondary) 100%);
    }
  }

  &.status-3 {
    :deep(.arco-card-cover) {
      background: linear-gradient(135deg, var(--status-other-primary) 0%, var(--status-other-secondary) 100%) !important;
    }
    .card-cover {
      background: linear-gradient(135deg, var(--status-other-primary) 0%, var(--status-other-secondary) 100%);
    }
  }

  .card-cover {
    height: 120px; // 调整顶部区域高度
    overflow: hidden;
    flex-shrink: 0;
    position: relative;

    // 状态文字标识（居中显示）
    .status-text-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      span {
        font-size: 18px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.95);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      // 状态图标样式
      :deep(.arco-icon) {
        color: rgba(255, 255, 255, 0.95);
        filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
      }
    }

    // 状态徽章
    .status-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(8px);
      border: 2px solid rgba(255, 255, 255, 0.8);

      // 根据状态设置徽章颜色
      .house-card.status-1 & {
        background: rgba(255, 255, 255, 0.95);
        border-color: var(--status-available-primary);

        :deep(.arco-icon) {
          color: var(--status-available-primary);
        }
      }

      .house-card.status-2 & {
        background: rgba(255, 255, 255, 0.95);
        border-color: var(--status-rented-primary);

        :deep(.arco-icon) {
          color: var(--status-rented-primary);
        }
      }

      .house-card.status-3 & {
        background: rgba(255, 255, 255, 0.95);
        border-color: var(--status-other-primary);

        :deep(.arco-icon) {
          color: var(--status-other-primary);
        }
      }
    }

    // 悬浮操作按钮
    .card-actions {
      position: absolute;
      top: 8px;
      right: 8px;
      display: flex;
      gap: 6px;
      opacity: 0;
      transform: translateY(-8px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      .action-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;

        &:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        &:active {
          transform: scale(0.95);
        }

        &.edit-btn {
          background: rgba(22, 93, 255, 0.9);
          border-color: rgba(22, 93, 255, 0.3);
          color: white;

          &:hover {
            background: rgba(22, 93, 255, 1);
            border-color: rgba(22, 93, 255, 0.5);
          }
        }

        &.view-btn {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(0, 0, 0, 0.1);
          color: var(--color-text-1);

          &:hover {
            background: white;
            border-color: var(--color-primary-6);
            color: var(--color-primary-6);
          }
        }

        :deep(.arco-btn-icon) {
          font-size: 14px;
        }
      }
    }
  }

  &:hover .card-actions {
    opacity: 1;
    transform: translateY(0);
  }

  // 卡片内容区
  .card-content {
    flex: 1; // 使用剩余空间
    min-height: 0; // 允许内容收缩
    padding: 14px;
    display: flex;
    flex-direction: column;
    overflow: hidden; // 防止内容溢出
  }

  // 标题区域
  .title-section {
    height: 40px;
    display: flex;
    align-items: center;

    .house-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-text-1);
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }
  }

  // 价格区域
  .price-section {
    height: 44px;
    display: flex;
    align-items: center;

    .price-value {
      font-size: 22px;
      font-weight: 700;
      color: var(--color-primary-6);
      line-height: 1.2;
    }
  }

  // 基本信息区域
  .basic-info-section {
    height: 34px;

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;

      .info-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        color: var(--color-text-2);
        font-weight: 500;

        .info-icon {
          font-size: 16px;
          color: var(--color-text-3);
        }
      }
    }
  }

  // 底部区域
  .bottom-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 0; // 移除最小高度限制，允许自适应
    overflow: hidden; // 防止内容溢出

    // 地区信息行
    .location-row {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--color-border-2);

      .location-info {
        display: flex;
        align-items: center;
        gap: 3px;
        width: 100%;
        justify-content: center;

        .info-icon {
          font-size: 14px;
          color: var(--color-text-3);
          flex-shrink: 0;
        }

        span {
          font-size: 13px;
          color: var(--color-text-3);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
      }
    }

    // 操作区域
    .action-section {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      height: 56px;

      .action-group {
        display: flex;
        gap: 6px;
        align-items: center;
        width: 100%;
        justify-content: center;

        .action-btn-small {
          font-size: 13px;
          height: 28px;
          padding: 0 10px;
          border-radius: 4px;

          &.checkin-btn {
            background: var(--color-primary-6);
            border-color: var(--color-primary-6);
            color: white;

            &:hover {
              background: var(--color-primary-5);
              border-color: var(--color-primary-5);
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .house-card {
    height: 340px; // 移动端适当调整高度
    margin-bottom: 12px;

    .card-cover {
      height: 100px; // 调整顶部区域高度
      flex-shrink: 0;

      .card-actions {
        top: 6px;
        right: 6px;
        gap: 4px;

        .action-btn {
          width: 24px;
          height: 24px;

          :deep(.arco-btn-icon) {
            font-size: 12px;
          }
        }
      }

      .status-text-center {
        span {
          font-size: 16px;
        }

        :deep(.arco-icon) {
          font-size: 28px;
        }
      }
    }

    .card-content {
      flex: 1; // 使用剩余空间
      min-height: 0;
      padding: 12px;
    }

    .title-section {
      height: 36px;

      .house-title {
        font-size: 16px;
        font-weight: 600;
      }
    }

    .price-section {
      height: 38px;

      .price-value {
        font-size: 20px;
        font-weight: 700;
      }
    }

    .basic-info-section {
      height: 30px;

      .info-row {
        .info-item {
          font-size: 13px;

          .info-icon {
            font-size: 14px;
          }
        }
      }
    }

    .bottom-section {
      min-height: 106px;

      .location-row {
        .location-info {
          span {
            font-size: 12px;
          }
        }
      }

      .action-section {
        height: 50px;

        .action-group {
          .action-btn-small {
            font-size: 12px;
            height: 26px;
            padding: 0 8px;
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .house-card {
    height: 320px; // 增加高度以容纳内容

    .card-cover {
      height: 90px; // 进一步调整顶部区域高度
      flex-shrink: 0;

      .card-actions {
        .action-btn {
          width: 22px;
          height: 22px;

          :deep(.arco-btn-icon) {
            font-size: 11px;
          }
        }
      }

      .status-badge {
        width: 28px;
        height: 28px;

        :deep(.arco-icon) {
          font-size: 14px;
        }
      }

      .status-text-center {
        span {
          font-size: 14px;
        }

        :deep(.arco-icon) {
          font-size: 24px;
        }
      }
    }

    .card-content {
      flex: 1; // 使用剩余空间
      min-height: 0;
      padding: 10px;
    }

    .title-section {
      height: 34px;

      .house-title {
        font-size: 15px;
      }
    }

    .price-section {
      height: 36px;

      .price-value {
        font-size: 18px;
      }
    }

    .basic-info-section {
      height: 28px;

      .info-row {
        .info-item {
          font-size: 12px;

          .info-icon {
            font-size: 13px;
          }
        }
      }
    }

    .bottom-section {
      min-height: 102px;

      .location-row {
        .location-info {
          span {
            font-size: 11px;
          }
        }
      }

      .action-section {
        height: 46px;

        .action-group {
          .action-btn-small {
            font-size: 11px;
            height: 24px;
            padding: 0 6px;
          }
        }
      }
    }
  }
}
</style>