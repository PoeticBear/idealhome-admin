<template>
  <a-row :gutter="16">
    <a-col :span="8">
      <a-form-item label="省份" :field="provinceField">
        <a-select
          :model-value="provinceValue"
          :placeholder="provincePlaceholder"
          :loading="loading"
          :disabled="disabled"
          @update:model-value="handleProvinceChange"
        >
          <a-option
            v-for="province in provinceList"
            :key="province.id"
            :value="province.id"
          >
            {{ province.name }}
          </a-option>
        </a-select>
      </a-form-item>
    </a-col>
    <a-col :span="8">
      <a-form-item label="城市" :field="cityField">
        <a-select
          :model-value="cityValue"
          :placeholder="cityPlaceholder"
          :disabled="!provinceValue || disabled"
          @update:model-value="handleCityChange"
        >
          <a-option
            v-for="city in cityList"
            :key="city.id"
            :value="city.id"
          >
            {{ city.name }}
          </a-option>
        </a-select>
      </a-form-item>
    </a-col>
    <a-col :span="8">
      <a-form-item label="区县" :field="districtField">
        <a-select
          :model-value="districtValue"
          :placeholder="districtPlaceholder"
          :disabled="!cityValue || disabled"
          @update:model-value="handleDistrictChange"
        >
          <a-option
            v-for="district in districtList"
            :key="district.id"
            :value="district.id"
          >
            {{ district.name }}
          </a-option>
        </a-select>
      </a-form-item>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { watch, onMounted } from 'vue';

interface Props {
  provinceValue?: string | number;
  cityValue?: string | number;
  districtValue?: string | number;
  provinceList?: any[];
  cityList?: any[];
  districtList?: any[];
  loading?: boolean;
  disabled?: boolean;
  provinceField?: string;
  cityField?: string;
  districtField?: string;
  provincePlaceholder?: string;
  cityPlaceholder?: string;
  districtPlaceholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  provinceValue: '',
  cityValue: '',
  districtValue: '',
  provinceList: () => [],
  cityList: () => [],
  districtList: () => [],
  loading: false,
  disabled: false,
  provinceField: 'province',
  cityField: 'city',
  districtField: 'district',
  provincePlaceholder: '请选择省份',
  cityPlaceholder: '请选择城市',
  districtPlaceholder: '请选择区县',
});

const emit = defineEmits<{
  'update:provinceValue': [value: string | number];
  'update:cityValue': [value: string | number];
  'update:districtValue': [value: string | number];
  'provinceChange': [value: string | number];
  'cityChange': [value: string | number];
  'districtChange': [value: string | number];
}>();

// 省份选择变化处理
const handleProvinceChange = (value: string | number) => {
  emit('update:provinceValue', value);
  emit('update:cityValue', '');
  emit('update:districtValue', '');
  emit('provinceChange', value);
};

// 城市选择变化处理
const handleCityChange = (value: string | number) => {
  emit('update:cityValue', value);
  emit('update:districtValue', '');
  emit('cityChange', value);
};

// 区县选择变化处理
const handleDistrictChange = (value: string | number) => {
  emit('update:districtValue', value);
  emit('districtChange', value);
};

// 监听数据变化，确保响应式更新
watch(() => props.provinceList, (newList) => {
  console.log('省份列表更新:', newList?.length || 0);
}, { deep: true });

watch(() => props.cityList, (newList) => {
  console.log('城市列表更新:', newList?.length || 0);
}, { deep: true });

watch(() => props.districtList, (newList) => {
  console.log('区县列表更新:', newList?.length || 0);
}, { deep: true });
</script>

<style scoped lang="scss">
:deep(.arco-select) {
  .arco-select-view-single {
    height: 32px;
    font-size: 14px;

    &:hover {
      border-color: var(--color-primary-3);
    }

    &.arco-select-view-focus {
      border-color: var(--color-primary-5);
      box-shadow: 0 0 0 2px rgba(var(--color-primary-1), 0.1);
    }
  }

  .arco-select-option {
    font-size: 14px;
    padding: 8px 12px;

    &:hover {
      background-color: var(--color-primary-1);
    }

    &.arco-select-option-selected {
      background-color: var(--color-primary-2);
      color: var(--color-primary-6);
      font-weight: 500;
    }
  }
}

:deep(.arco-form-item) {
  margin-bottom: 16px;

  .arco-form-item-label {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-2);
    padding-bottom: 4px;
  }

  &.arco-form-item-error {
    .arco-select-view-single {
      border-color: var(--color-danger-5);

      &.arco-select-view-focus {
        border-color: var(--color-danger-5);
        box-shadow: 0 0 0 2px rgba(var(--color-danger-1), 0.1);
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  :deep(.arco-row) {
    .arco-col {
      margin-bottom: 8px;

      &:not(:last-child) {
        margin-bottom: 16px;
      }
    }
  }

  :deep(.arco-select) {
    .arco-select-view-single {
      height: 36px;
      font-size: 16px;
    }
  }
}
</style>