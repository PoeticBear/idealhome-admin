<template>
  <a-modal
    :visible="visible"
    :title="modalTitle"
    title-align="start"
    width="90%"
    :mask-closable="false"
    @update:visible="$emit('update:visible', $event)"
  >
    <template #footer>
      <a-space>
        <a-button @click="$emit('cancel')">取消</a-button>
        <a-button type="primary" :loading="loading" @click="$emit('confirm')">保存</a-button>
      </a-space>
    </template>

    <a-form :model="formData" layout="vertical" size="medium">
      <a-row :gutter="16">
        <!-- 左列 -->
        <a-col :span="12">
          <a-space direction="vertical" size="small" fill>
            <!-- 基本信息 -->
            <a-card :bordered="false" class="info-section compact">
              <template #title>
                <icon-home /> 基本信息
              </template>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="房屋名称" field="name" :rules="[{ required: true, message: '请输入房屋名称' }]">
                    <a-input v-model="formData.name" placeholder="请输入房屋名称" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="房号" field="roomNumber">
                    <a-input v-model="formData.roomNumber" placeholder="请输入房号" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="面积(㎡)" field="area">
                    <a-input-number v-model="formData.area" placeholder="请输入面积" :min="0" style="width: 100%" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="楼层" field="floor">
                    <a-input v-model="formData.floor" placeholder="请输入楼层" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item label="户型" field="layoutType">
                <a-select v-model="formData.layoutType" placeholder="请选择户型">
                  <a-option v-for="item in houseTypeOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </a-option>
                </a-select>
              </a-form-item>
            </a-card>

            <!-- 位置信息 -->
            <a-card :bordered="false" class="info-section compact">
              <template #title>
                <icon-location /> 位置信息
              </template>
              <LocationSelector
                :province-value="formData.province"
                :city-value="formData.city"
                :district-value="formData.district"
                :province-list="provinceList"
                :city-list="cityList"
                :district-list="districtList"
                :loading="cityCodeLoading"
                @update:province-value="formData.province = $event"
                @update:city-value="formData.city = $event"
                @update:district-value="formData.district = $event"
                @province-change="$emit('provinceChange', $event)"
                @city-change="$emit('cityChange', $event)"
              />
              <a-form-item label="详细地址" field="addresInfo">
                <a-input v-model="formData.addresInfo" placeholder="请输入详细地址" />
              </a-form-item>
            </a-card>

            <!-- 设施配置 -->
            <a-card :bordered="false" class="info-section compact">
              <template #title>
                <icon-settings /> 设施配置
              </template>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="卫生间" field="toilet">
                    <a-select v-model="formData.toilet" placeholder="请选择">
                      <a-option :value="0">没有</a-option>
                      <a-option :value="1">独立</a-option>
                      <a-option :value="2">公用</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="厨房" field="kitchen">
                    <a-select v-model="formData.kitchen" placeholder="请选择">
                      <a-option :value="0">没有</a-option>
                      <a-option :value="1">独立</a-option>
                      <a-option :value="2">公用</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item label="阳台" field="balcony">
                    <a-select v-model="formData.balcony" placeholder="请选择">
                      <a-option :value="0">无</a-option>
                      <a-option :value="1">有</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="朝向" field="toward">
                    <a-select v-model="formData.toward" placeholder="请选择">
                      <a-option :value="1">东</a-option>
                      <a-option :value="2">西</a-option>
                      <a-option :value="3">南</a-option>
                      <a-option :value="4">北</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="状态" field="status">
                    <a-select v-model="formData.status" placeholder="请选择">
                      <a-option :value="1">待租</a-option>
                      <a-option :value="2">已租</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item label="采光情况" field="lighting">
                <a-textarea v-model="formData.lighting" placeholder="请输入采光情况" :max-length="200" show-word-limit />
              </a-form-item>
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
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="实际租金(元/月)" field="price">
                    <a-input-number v-model="formData.price" placeholder="请输入实际租金" :min="0" :precision="2" style="width: 100%" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="对外租金(元/月)" field="fakePrice">
                    <a-input-number v-model="formData.fakePrice" placeholder="请输入对外租金" :min="0" :precision="2" style="width: 100%" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="押金月数" field="depositNumber">
                    <a-input-number v-model="formData.depositNumber" placeholder="请输入押金月数" :min="0" :max="12" style="width: 100%" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="每次付月数" field="priceNumber">
                    <a-input-number v-model="formData.priceNumber" placeholder="请输入每次付月数" :min="1" :max="12" style="width: 100%" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="水费(元)" field="waterFee">
                    <a-input-number v-model="formData.waterFee" placeholder="请输入水费" :min="0" :precision="2" style="width: 100%" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="电费(元)" field="electricityFee">
                    <a-input-number v-model="formData.electricityFee" placeholder="请输入电费" :min="0" :precision="2" style="width: 100%" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="网费(元)" field="internetFee">
                    <a-input-number v-model="formData.internetFee" placeholder="请输入网费" :min="0" :precision="2" style="width: 100%" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="燃气费(元)" field="fuelFee">
                    <a-input-number v-model="formData.fuelFee" placeholder="请输入燃气费" :min="0" :precision="2" style="width: 100%" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <!-- 其他信息 -->
            <a-card :bordered="false" class="info-section compact">
              <template #title>
                <icon-info-circle /> 其他信息
              </template>
              <a-form-item label="备注信息" field="note">
                <a-textarea v-model="formData.note" placeholder="请输入备注信息" :max-length="500" show-word-limit />
              </a-form-item>
            </a-card>
          </a-space>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import LocationSelector from './LocationSelector.vue';
import { HOUSE_TYPE_OPTIONS } from '../../constants/house';

interface Props {
  visible: boolean;
  formType: 'add' | 'edit';
  formData: any;
  loading: boolean;
  provinceList: any[];
  cityList: any[];
  districtList: any[];
  cityCodeLoading: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  'update:visible': [value: boolean];
  confirm: [];
  cancel: [];
  provinceChange: [value: string | number];
  cityChange: [value: string | number];
}>();

// 计算属性
const modalTitle = computed(() => {
  return props.formType === 'add' ? '新增房屋信息' : `编辑房屋信息 - ${props.formData.name || ''}`;
});

const houseTypeOptions = HOUSE_TYPE_OPTIONS;
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

// 编辑表单样式
:deep(.arco-form) {
  .arco-form-item {
    margin-bottom: 16px;

    .arco-form-item-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-2);
      padding-bottom: 4px;
    }

    .arco-input,
    .arco-input-number,
    .arco-select,
    .arco-textarea {
      font-size: 14px;

      &:hover {
        border-color: var(--color-primary-3);
      }

      &:focus-within {
        border-color: var(--color-primary-5);
        box-shadow: 0 0 0 2px rgba(var(--color-primary-1), 0.1);
      }
    }

    .arco-input-number {
      width: 100%;
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
}
</style>