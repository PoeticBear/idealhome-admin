<template>
  <a-modal
    :visible="visible"
    :title="houseData.name"
    title-align="start"
    width="90%"
    @update:visible="$emit('update:visible', $event)"
  >
    <a-space direction="vertical" size="small" fill>
      <!-- 主要信息：左右两列布局 -->
      <a-row :gutter="16">
        <!-- 左列 -->
        <a-col :span="12">
          <a-space direction="vertical" size="small" fill>
            <!-- 基本信息 -->
            <a-card :bordered="false" class="info-section compact">
              <template #title>
                <icon-home /> 基本信息
              </template>
              <a-descriptions
                size="mini"
                :column="3"
                :data="houseData.basicInfo"
                layout="inline-horizontal"
              >
                <template #value="{ data }">
                  <template v-if="data.label === '户型：'">
                    <a-tag color="purple" size="small">
                      {{ getHouseTypeLabel(data.value) }}
                    </a-tag>
                  </template>
                  <span v-else class="compact-text">
                    {{ data.value || '-' }}
                  </span>
                </template>
              </a-descriptions>
            </a-card>

            <!-- 设施配置 -->
            <a-card :bordered="false" class="info-section compact">
              <template #title>
                <icon-settings /> 设施配置
              </template>
              <a-descriptions
                size="mini"
                :column="3"
                :data="houseData.facilityInfo"
                layout="inline-horizontal"
              >
                <template #value="{ data }">
                  <template v-if="data.label === '朝向：'">
                    <a-tag v-if="data.value === 1" color="red" size="small">东</a-tag>
                    <a-tag v-else-if="data.value === 2" color="orangered" size="small">西</a-tag>
                    <a-tag v-else-if="data.value === 3" color="blue" size="small">南</a-tag>
                    <a-tag v-else-if="data.value === 4" color="gray" size="small">北</a-tag>
                    <span v-else>-</span>
                  </template>
                  <template v-else-if="data.label === '卫生间：' || data.label === '厨房：'">
                    <a-tag v-if="data.value === 0" color="red" size="small">没有</a-tag>
                    <a-tag v-else-if="data.value === 1" color="green" size="small">独立</a-tag>
                    <a-tag v-else-if="data.value === 2" color="orange" size="small">公用</a-tag>
                    <span v-else>-</span>
                  </template>
                  <template v-else-if="data.label === '阳台：'">
                    <a-tag v-if="data.value === 1" color="green" size="small">有</a-tag>
                    <a-tag v-else color="red" size="small">无</a-tag>
                  </template>
                  <span v-else class="compact-text">
                    {{ data.value || '-' }}
                  </span>
                </template>
              </a-descriptions>
            </a-card>
          </a-space>
        </a-col>

        <!-- 右列 -->
        <a-col :span="12">
          <a-space direction="vertical" size="small" fill>
            <!-- 费用信息 -->
            <a-card :bordered="false" class="info-section compact">
              <template #title>
                <icon-safe /> 费用信息
              </template>
              <a-descriptions
                size="mini"
                :column="3"
                :data="houseData.costInfo"
                layout="inline-horizontal"
              >
                <template #value="{ data }">
                  <template v-if="data.label === '实际租金：' || data.label === '对外租金：'">
                    <span class="price-text compact">{{ data.value !== '-' ? `¥${data.value}/月` : '-' }}</span>
                  </template>
                  <template v-else-if="data.label === '押金月数：'">
                    <span class="compact-text">{{ data.value ? `${data.value}个月` : '-' }}</span>
                  </template>
                  <template v-else-if="data.label === '每次付月数：'">
                    <span class="compact-text">{{ data.value ? `每${data.value}个月付一次` : '-' }}</span>
                  </template>
                  <template v-else>
                    <span class="compact-text">{{ data.value !== '-' ? `¥${data.value}` : '-' }}</span>
                  </template>
                </template>
              </a-descriptions>
            </a-card>

            <!-- 位置信息 -->
            <a-card :bordered="false" class="info-section compact">
              <template #title>
                <icon-location /> 位置信息
              </template>
              <a-descriptions
                size="mini"
                :column="1"
                :data="houseData.locationInfo"
                layout="inline-horizontal"
              >
                <template #value="{ data }">
                  <span class="compact-text">
                    {{ data.value || '-' }}
                  </span>
                </template>
              </a-descriptions>
            </a-card>

            <!-- 其他信息 -->
            <a-card :bordered="false" class="info-section compact">
              <template #title>
                <icon-info-circle /> 其他信息
              </template>
              <a-descriptions
                size="mini"
                :column="1"
                :data="houseData.otherInfo"
                layout="inline-horizontal"
              >
                <template #value="{ data }">
                  <span class="compact-text">
                    {{ data.value || '-' }}
                  </span>
                </template>
              </a-descriptions>
            </a-card>

            <!-- 租客信息 -->
            <div v-if="houseData.tenantsUsers?.length > 0">
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-user /> 租客信息
                </template>
                <a-list :bordered="false" size="small">
                  <a-list-item v-for="(item, ind) in houseData.tenantsUsers" :key="ind">
                    <a-list-item-meta
                      :title="`${item.name}（${item.phone}）`"
                      :description="`入住日期：${item.joinTime}`"
                    >
                      <template #avatar>
                        <a-avatar :image-url="item.headImg" :size="32"></a-avatar>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </a-list>
              </a-card>
            </div>
          </a-space>
        </a-col>
      </a-row>

      <!-- 媒体资源区域：图片视频同行显示 -->
      <div v-if="houseData.headImg?.length > 0 || houseData.videoUrl?.length > 0">
        <a-card :bordered="false" class="info-section compact media-section">
          <template #title>
            <icon-image /> 媒体资源
          </template>
          <a-row :gutter="16">
            <!-- 房屋图片 -->
            <a-col v-if="houseData.headImg?.length > 0" :span="houseData.videoUrl?.length > 0 ? 16 : 24">
              <div class="media-subtitle">房屋图片</div>
              <a-image-preview-group infinite>
                <a-row :gutter="8">
                  <a-col
                    v-for="(item, ind) in houseData.headImg.slice(0, 8)"
                    :key="ind"
                    :span="6"
                  >
                    <a-image
                      fit="cover"
                      :src="item.url"
                      width="100%"
                      height="70px"
                      class="media-image"
                    />
                  </a-col>
                  <a-col v-if="houseData.headImg.length > 8" :span="6">
                    <div class="more-images">
                      +{{ houseData.headImg.length - 8 }}
                    </div>
                  </a-col>
                </a-row>
              </a-image-preview-group>
            </a-col>

            <!-- 房间视频 -->
            <a-col v-if="houseData.videoUrl?.length > 0" :span="houseData.headImg?.length > 0 ? 8 : 24">
              <div class="media-subtitle">房间视频</div>
              <a-row :gutter="8">
                <a-col
                  v-for="(item, ind) in houseData.videoUrl.slice(0, 2)"
                  :key="ind"
                  :span="12"
                >
                  <div class="video-container compact">
                    <video
                      :src="item.url"
                      controls
                      preload="metadata"
                      style="width: 100%; height: 70px; object-fit: cover;"
                    >
                      您的浏览器不支持视频播放
                    </video>
                  </div>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-card>
      </div>
    </a-space>
  </a-modal>
</template>

<script lang="ts" setup>
import { getHouseTypeLabel } from '../../utils/formatters';

interface Props {
  visible: boolean;
  houseData: any;
}

defineProps<Props>();

defineEmits<{
  'update:visible': [value: boolean];
}>();
</script>

<style scoped lang="scss">
// 紧凑型信息区域样式
.info-section {
  margin-bottom: 8px;

  &.compact {
    :deep(.arco-card-header) {
      border-bottom: 1px solid var(--color-border-2);
      padding: 8px 12px;
      min-height: auto;

      .arco-card-header-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-text-1);
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }

    :deep(.arco-card-body) {
      padding: 8px 12px;
    }
  }

  :deep(.arco-card-header) {
    border-bottom: 1px solid var(--color-border-2);
    padding: 12px 16px;

    .arco-card-header-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text-1);
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  :deep(.arco-card-body) {
    padding: 16px;
  }
}

// 紧凑文本样式
.compact-text {
  font-size: 13px;
  line-height: 1.4;
}

// 价格文本样式
.price-text {
  font-weight: 600;
  color: var(--color-primary-6);
  font-size: 14px;

  &.compact {
    font-size: 13px;
  }
}

// 视频容器样式
.video-container {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &.compact {
    border-radius: 4px;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  video {
    display: block;
    border-radius: 6px;

    .compact & {
      border-radius: 4px;
    }
  }
}

// 媒体区域样式
.media-section {
  .media-subtitle {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-2);
    margin-bottom: 6px;
  }

  .media-image {
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  }

  .more-images {
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-fill-2);
    border-radius: 4px;
    color: var(--color-text-3);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: var(--color-fill-3);
      color: var(--color-text-2);
    }
  }

  // 同行布局时的特殊样式
  :deep(.arco-row) {
    .arco-col {
      &:first-child {
        border-right: 1px solid var(--color-border-2);
        padding-right: 16px;
      }

      &:last-child {
        padding-left: 16px;
      }
    }
  }
}

// 弹窗样式优化
:deep(.arco-modal) {
  // 大屏幕弹窗宽度优化
  @media (min-width: 1600px) {
    width: 1400px !important;
  }

  @media (min-width: 1200px) and (max-width: 1599px) {
    width: 1100px !important;
  }

  .arco-modal-body {
    max-height: 85vh;
    overflow-y: auto;
    padding: 20px 24px;
  }

  .arco-modal-header {
    border-bottom: 1px solid var(--color-border-2);
    padding: 20px 24px;
  }

  .arco-modal-title {
    font-size: 18px;
    font-weight: 600;
  }

  .arco-modal-footer {
    padding: 16px 24px;
    border-top: 1px solid var(--color-border-2);
  }
}

// 描述列表样式优化
:deep(.arco-descriptions) {
  &.arco-descriptions-size-mini {
    .arco-descriptions-item {
      padding: 4px 8px;
    }

    .arco-descriptions-item-label {
      font-weight: 500;
      color: var(--color-text-2);
      background-color: var(--color-fill-1);
      font-size: 13px;
      padding: 4px 8px;
    }

    .arco-descriptions-item-value {
      padding: 4px 8px;
      font-size: 13px;

      p {
        margin: 0;
        color: var(--color-text-1);
      }
    }
  }

  .arco-descriptions-item {
    padding: 6px 10px;
  }

  .arco-descriptions-item-label {
    font-weight: 500;
    color: var(--color-text-2);
    background-color: var(--color-fill-1);
  }

  .arco-descriptions-item-value {
    p {
      margin: 0;
      color: var(--color-text-1);
    }
  }
}

// 标签样式优化
:deep(.arco-tag) {
  font-weight: 500;
  font-size: 12px;

  &.arco-tag-size-small {
    font-size: 11px;
    padding: 1px 6px;
    height: 20px;
    line-height: 18px;
  }
}

// 列表样式优化
:deep(.arco-list) {
  &.arco-list-size-small {
    .arco-list-item {
      padding: 8px 0;
      min-height: auto;
    }

    .arco-list-item-meta {
      .arco-list-item-meta-title {
        font-size: 13px;
        margin-bottom: 2px;
      }

      .arco-list-item-meta-description {
        font-size: 12px;
        color: var(--color-text-3);
      }
    }
  }
}

// 响应式优化
@media (max-width: 1200px) {
  :deep(.arco-modal) {
    width: 95% !important;

    .arco-modal-body {
      padding: 16px 20px;
    }

    .arco-modal-header {
      padding: 16px 20px;
    }

    .arco-modal-footer {
      padding: 12px 20px;
    }
  }
}

@media (max-width: 768px) {
  .info-section {
    margin-bottom: 6px;

    &.compact {
      :deep(.arco-card-header) {
        padding: 6px 8px;
      }

      :deep(.arco-card-body) {
        padding: 6px 8px;
      }
    }

    :deep(.arco-descriptions) {
      .arco-descriptions-item {
        padding: 4px 6px;
      }
    }
  }

  :deep(.arco-modal) {
    width: 98% !important;
    margin: 10px;

    .arco-modal-body {
      padding: 12px 16px;
    }

    .arco-modal-header {
      padding: 12px 16px;
    }
  }

  .media-section {
    .media-image {
      height: 50px !important;
    }

    .more-images {
      height: 50px !important;
      font-size: 12px;
    }

    // 移动端恢复垂直布局
    :deep(.arco-row) {
      .arco-col {
        &:first-child {
          border-right: none;
          padding-right: 0;
          margin-bottom: 8px;
        }

        &:last-child {
          padding-left: 0;
        }
      }
    }
  }
}
</style>