<template>
  <a-card class="house-card" :hoverable="true">
    <template #cover>
      <div class="card-cover">
        <div class="house-image-placeholder">
          <icon-home size="36" />
          <span class="placeholder-text">暂无图片</span>
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
        <!-- 地区和状态 -->
        <div class="location-status-row">
          <div class="location-info">
            <icon-location class="info-icon" />
            <span>{{ house.location }}</span>
          </div>
          <a-tag
            :color="getStatusInfo(house.status).color"
            size="small"
            class="status-tag"
          >
            {{ getStatusInfo(house.status).label }}
          </a-tag>
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
          <div class="action-group utility-actions">
            <a-button
              type="text"
              size="mini"
              class="utility-btn"
              @click="$emit('utility', house)"
            >
              <icon-thunderbolt />
            </a-button>
            <a-button
              type="text"
              size="mini"
              class="utility-btn"
              @click="$emit('batchUtility')"
            >
              <icon-thunderbolt />
              <span>批量</span>
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
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
  batchUtility: [];
}>();
</script>

<style scoped lang="scss">
.house-card {
  margin-bottom: 16px;
  width: 100%;
  height: 360px; // 增加固定高度
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }

  .card-cover {
    height: 130px; // 增加顶部区域高度
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;

    .house-image-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: rgba(255, 255, 255, 0.8);

      .placeholder-text {
        margin-top: 4px;
        font-size: 12px;
        font-weight: 400;
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
    height: 230px; // 增加内容区域高度
    padding: 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
    min-height: 112px;

    // 地区和状态行
    .location-status-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--color-border-2);

      .location-info {
        display: flex;
        align-items: center;
        gap: 3px;
        flex: 1;
        min-width: 0;
        margin-right: 8px;

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
        }
      }

      .status-tag {
        flex-shrink: 0;
        font-weight: 600;
        font-size: 12px;
        padding: 2px 8px;
        height: auto;
        line-height: 1.4;
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

        &.utility-actions {
          .utility-btn {
            height: 28px;
            padding: 0 8px;
            font-size: 13px;
            color: var(--color-text-3);
            background: transparent;
            border: none;
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 2px;

            &:hover {
              background: var(--color-fill-2);
              color: var(--color-primary-6);
            }

            span {
              font-size: 12px;
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
    height: 320px; // 移动端适当调整高度
    margin-bottom: 12px;

    .card-cover {
      height: 110px;

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

      .house-image-placeholder {
        .placeholder-text {
          font-size: 10px;
        }
      }
    }

    .card-content {
      height: 210px;
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

      .location-status-row {
        .location-info {
          span {
            font-size: 12px;
          }
        }

        .status-tag {
          font-size: 11px;
          padding: 2px 6px;
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

          &.utility-actions {
            .utility-btn {
              height: 26px;
              padding: 0 6px;
              font-size: 12px;

              span {
                font-size: 11px;
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .house-card {
    height: 300px;

    .card-cover {
      height: 100px;

      .card-actions {
        .action-btn {
          width: 22px;
          height: 22px;

          :deep(.arco-btn-icon) {
            font-size: 11px;
          }
        }
      }
    }

    .card-content {
      height: 200px;
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

      .location-status-row {
        .location-info {
          span {
            font-size: 11px;
          }
        }

        .status-tag {
          font-size: 10px;
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

          &.utility-actions {
            .utility-btn {
              height: 24px;
              font-size: 11px;

              span {
                font-size: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>