<template>
  <div>
    <!-- 搜索筛选区域已隐藏 -->
    <headForm :label-width="100" style="display: none;">
      <headFormItem label="房屋名称：">
        <a-input
          v-model="searchData.name" placeholder="请输入..." allow-clear
          @change="searchList"
        />
      </headFormItem>
      <headFormItem label="状态：">
        <a-select
          v-model="searchData.status" placeholder="请选择 ..." :options="statusOption"
          allow-clear
          @change="searchList"
        >
        </a-select>
      </headFormItem>
      <headFormItem label="地址：">
        <a-input
          v-model="searchData.address" placeholder="请输入..." allow-clear
          @change="searchList"
        />
      </headFormItem>
      <headFormItem label="创建时间：">
        <a-range-picker
          show-time
          @change="datePickerChange"
        />
      </headFormItem>
      <headFormItem type="button" @search="searchList">
      </headFormItem>
    </headForm>

    <a-table
      :columns="tableColumns" :loading="tableLoading" stripe
      show-page-size :pagination="pagination"
      :data="houseList" row-key="id"
      @page-size-change="onPageSizeChange"
      @page-change="onPageChange"
    >
      <template #status="{ record }">
        <a-tag :color="statusOption.find(item => item.value === record.status)?.color">
          {{ statusOption.find(item => item.value === record.status)?.label || '未知' }}
        </a-tag>
      </template>
      <template #city="{ record }">
        {{ `${record.provinceName}${record.cityName==="直辖市"?'':record.cityName}${record.areaName}` }}
      </template>
      <template #operation="{ record }">
        <a-button type="primary" size="mini" @click="showInfo(record)">
          详情
        </a-button>
      </template>
    </a-table>
    <a-modal
      v-model:visible="showInfoModel" :title="showData.name" title-align="start"
      width="90%"
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
                  size="mini" :column="3"
                  :data="showData.basicInfo"
                  layout="inline-horizontal"
                >
                  <template #value="{data}">
                    <template v-if="data.label==='户型：'">
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

              <!-- 位置信息 -->
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-location /> 位置信息
                </template>
                <a-descriptions
                  size="mini" :column="2"
                  :data="showData.locationInfo"
                  layout="inline-horizontal"
                >
                  <template #value="{data}">
                    <span class="compact-text">
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
                  size="mini" :column="3"
                  :data="showData.facilityInfo"
                  layout="inline-horizontal"
                >
                  <template #value="{data}">
                    <template v-if="data.label==='朝向：'">
                      <a-tag v-if="data.value===1" color="red" size="small">东</a-tag>
                      <a-tag v-else-if="data.value===2" color="orangered" size="small">西</a-tag>
                      <a-tag v-else-if="data.value===3" color="blue" size="small">南</a-tag>
                      <a-tag v-else-if="data.value===4" color="gray" size="small">北</a-tag>
                      <span v-else>-</span>
                    </template>
                    <template v-else-if="data.label==='卫生间：' || data.label==='厨房：'">
                      <a-tag v-if="data.value===0" color="red" size="small">没有</a-tag>
                      <a-tag v-else-if="data.value===1" color="green" size="small">独立</a-tag>
                      <a-tag v-else-if="data.value===2" color="orange" size="small">公用</a-tag>
                      <span v-else>-</span>
                    </template>
                    <template v-else-if="data.label==='阳台：'">
                      <a-tag v-if="data.value===1" color="green" size="small">有</a-tag>
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
                  <icon-money-circle /> 费用信息
                </template>
                <a-descriptions
                  size="mini" :column="3"
                  :data="showData.costInfo"
                  layout="inline-horizontal"
                >
                  <template #value="{data}">
                    <template v-if="data.label==='实际租金：' || data.label==='对外租金：'">
                      <span class="price-text compact">{{ data.value ? `¥${data.value}/月` : '-' }}</span>
                    </template>
                    <template v-else-if="data.label==='押金月数：'">
                      <span class="compact-text">{{ data.value ? `${data.value}个月` : '-' }}</span>
                    </template>
                    <template v-else-if="data.label==='每次付月数：'">
                      <span class="compact-text">{{ data.value ? `每${data.value}个月付一次` : '-' }}</span>
                    </template>
                    <template v-else>
                      <span class="compact-text">{{ data.value ? `¥${data.value}` : '-' }}</span>
                    </template>
                  </template>
                </a-descriptions>
              </a-card>

              <!-- 其他信息 -->
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-info-circle /> 其他信息
                </template>
                <a-descriptions
                  size="mini" :column="1"
                  :data="showData.otherInfo"
                  layout="inline-horizontal"
                >
                  <template #value="{data}">
                    <span class="compact-text">
                      {{ data.value || '-' }}
                    </span>
                  </template>
                </a-descriptions>
              </a-card>

              <!-- 租客信息 -->
              <div v-if="showData.tenantsUsers?.length>0">
                <a-card :bordered="false" class="info-section compact">
                  <template #title>
                    <icon-user /> 租客信息
                  </template>
                  <a-list :bordered="false" size="small">
                    <a-list-item v-for="(item,ind) in showData.tenantsUsers" :key="ind">
                      <a-list-item-meta
                        :title="`${item.name}（${item.phone}）`"
                        :description="`入住日期：${item.joinTime}`"
                      >
                        <template #avatar>
                          <a-avatar :image-url="item.headImg" :size="32">
                          </a-avatar>
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
        <div v-if="showData.headImg?.length>0 || showData.videoUrl?.length>0">
          <a-card :bordered="false" class="info-section compact media-section">
            <template #title>
              <icon-image /> 媒体资源
            </template>
            <a-row :gutter="16">
              <!-- 房屋图片 -->
              <a-col v-if="showData.headImg?.length>0" :span="showData.videoUrl?.length>0 ? 16 : 24">
                <div class="media-subtitle">房屋图片</div>
                <a-image-preview-group infinite>
                  <a-row :gutter="8">
                    <a-col
                      v-for="(item, ind) in showData.headImg.slice(0, 8)" :key="ind"
                      :span="6"
                    >
                      <a-image
                        fit="cover" :src="item.url"
                        width="100%" height="70px"
                        class="media-image"
                      />
                    </a-col>
                    <a-col v-if="showData.headImg.length > 8" :span="6">
                      <div class="more-images">
                        +{{ showData.headImg.length - 8 }}
                      </div>
                    </a-col>
                  </a-row>
                </a-image-preview-group>
              </a-col>

              <!-- 房间视频 -->
              <a-col v-if="showData.videoUrl?.length>0" :span="showData.headImg?.length>0 ? 8 : 24">
                <div class="media-subtitle">房间视频</div>
                <a-row :gutter="8">
                  <a-col
                    v-for="(item, ind) in showData.videoUrl.slice(0, 2)" :key="ind"
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
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
import useStore from '@/stores/index';
import { storeToRefs } from 'pinia'
import {
  getHouseList
} from '@/api/house';

const store = storeToRefs(useStore());

const tableColumns: object[] = reactive([
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '房号',
    align: 'center',
    dataIndex: 'roomNumber',
  },
  {
    title: '省市区',
    align: 'center',
    slotName: 'city',
  },
  {
    title: '详细地址',
    align: 'center',
    dataIndex: 'addresInfo',
  },
  {
    title: '状态',
    align: 'center',
    slotName: 'status',
    dataIndex: 'status'
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createdAt'
  },
  {
    title: '更新时间',
    align: 'center',
    dataIndex: 'updatedAt'
  },
  {
    title: '操作',
    align: 'center',
    slotName: 'operation',
  },
]);

const pagination = reactive({
  total: 0,
  pageSize: 10,
  showPageSize: !store.isMobile,
  showTotal: true,
  showMore: true,
  showJumper: true,
  simple: store.isMobile,
  current: 1,
});

const statusOption = reactive([
  {
    label: '全部',
    value: '',
    color: ''
  },
  {
    label: '待租',
    value: 1,
    color: 'red'
  },
  {
    label: '已租',
    value: 2,
    color: 'green'
  }
]);

const searchData = reactive({
  name: '',
  address: '',
  status: '',
  starTime: '',
  endTime: '',
  size: pagination.pageSize,
  index: pagination.current
});

const houseTypeOptions = [
  { label: '单间', value: 1 },
  { label: '一房一厅', value: 2 },
  { label: '两房一厅', value: 3 },
  { label: '三房一厅', value: 4 },
  { label: '四房一厅', value: 5 },
  { label: '四房两厅', value: 6 }
];

let houseList = reactive<any[]>([]);
const tableLoading = ref(false);

// 获取户型标签
const getHouseTypeLabel = (value: number) => {
  const option = houseTypeOptions.find(item => item.value === value);
  return option ? option.label : '未知';
};

// 获取卫生间/厨房配置标签
const getFacilityLabel = (value: number, type: 'toilet' | 'kitchen') => {
  if (value === 0) return '没有';
  if (value === 1) return '独立';
  if (value === 2) return '公用';
  return '未知';
};

// 获取朝向标签
const getTowardLabel = (value: number) => {
  const directionMap: { [key: number]: string } = {
    1: '东',
    2: '西',
    3: '南',
    4: '北'
  };
  return directionMap[value] || '未知';
};

// 获取阳台标签
const getBalconyLabel = (value: number) => {
  return value === 1 ? '有' : '无';
};


const getHouseListFun = () => {
  tableLoading.value = true;
  getHouseList(searchData)
    .then(({ status, data, count }) => {
      if (status === 1) {
        pagination.total = count || 0;
        houseList.splice(0, houseList.length, ...(data || []));
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
};

getHouseListFun();

const onPageChange = (index: number) => {
  pagination.current = index;
  searchData.index = index;
  getHouseListFun();
};

const onPageSizeChange = (size: number) => {
  pagination.pageSize = size;
  searchData.size = size;
  getHouseListFun();
};

const searchList = () => {
  pagination.current = 1;
  searchData.index = 1;
  getHouseListFun();
};

const datePickerChange = (value: any) => {
  if (value) {
    searchData.starTime = value[0];
    searchData.endTime = value[1];
  } else {
    searchData.starTime = '';
    searchData.endTime = '';
  }
  searchList();
};

let showInfoModel = ref(false);
let showData: any = reactive({});

const showInfo = (data: any) => {
  showData.name = data.name;

  // 基本信息
  showData.basicInfo = [
    {
      label: '房屋名称：',
      value: data.name,
    },
    {
      label: '房号：',
      value: data.roomNumber,
    },
    {
      label: '面积：',
      value: data.area ? `${data.area}㎡` : null,
    },
    {
      label: '楼层：',
      value: data.floor,
    },
    {
      label: '户型：',
      value: data.layoutType,
    },
  ];

  // 位置信息
  showData.locationInfo = [
    {
      label: '省份：',
      value: data.provinceName,
    },
    {
      label: '城市：',
      value: data.cityName === '直辖市' ? data.provinceName : data.cityName,
    },
    {
      label: '区域：',
      value: data.areaName,
    },
    {
      label: '详细地址：',
      value: data.addresInfo,
    },
  ];

  // 费用信息
  showData.costInfo = [
    {
      label: '实际租金：',
      value: data.price,
    },
    {
      label: '对外租金：',
      value: data.fakePrice,
    },
    {
      label: '押金月数：',
      value: data.depositNumber,
    },
    {
      label: '每次付月数：',
      value: data.priceNumber,
    },
    {
      label: '水费：',
      value: data.waterFee,
    },
    {
      label: '电费：',
      value: data.electricityFee,
    },
    {
      label: '网费：',
      value: data.internetFee,
    },
    {
      label: '燃气费：',
      value: data.fuelFee,
    },
  ];

  // 设施配置
  showData.facilityInfo = [
    {
      label: '卫生间：',
      value: data.toilet,
    },
    {
      label: '厨房：',
      value: data.kitchen,
    },
    {
      label: '阳台：',
      value: data.balcony,
    },
    {
      label: '朝向：',
      value: data.toward,
    },
    {
      label: '采光情况：',
      value: data.lighting,
    },
  ];

  // 其他信息
  showData.otherInfo = [
    {
      label: '备注信息：',
      value: data.note,
    },
    {
      label: '创建时间：',
      value: data.createdAt,
    },
    {
      label: '更新时间：',
      value: data.updatedAt,
    },
  ];

  // 处理图片数据：支持字符串、JSON字符串、数组等多种格式
  if (data.headImg) {
    try {
      if (typeof data.headImg === 'string') {
        // 尝试解析JSON字符串
        const parsed = JSON.parse(data.headImg);
        showData.headImg = Array.isArray(parsed) ? parsed : [parsed];
      } else if (Array.isArray(data.headImg)) {
        // 已经是数组
        showData.headImg = data.headImg;
      } else {
        // 其他情况转为数组
        showData.headImg = [data.headImg];
      }
    } catch (e) {
      // JSON解析失败，当作单个图片路径处理
      if (typeof data.headImg === 'string') {
        showData.headImg = [{ url: data.headImg }];
      } else {
        showData.headImg = [{ url: String(data.headImg) }];
      }
    }
  } else {
    showData.headImg = [];
  }

  // 处理视频数据：支持字符串、JSON字符串、数组等多种格式
  if (data.videoUrl) {
    try {
      if (typeof data.videoUrl === 'string') {
        // 尝试解析JSON字符串
        const parsed = JSON.parse(data.videoUrl);
        showData.videoUrl = Array.isArray(parsed) ? parsed : [parsed];
      } else if (Array.isArray(data.videoUrl)) {
        // 已经是数组
        showData.videoUrl = data.videoUrl;
      } else {
        // 其他情况转为数组
        showData.videoUrl = [data.videoUrl];
      }
    } catch (e) {
      // JSON解析失败，当作单个视频路径处理
      if (typeof data.videoUrl === 'string') {
        showData.videoUrl = [{ url: data.videoUrl }];
      } else {
        showData.videoUrl = [{ url: String(data.videoUrl) }];
      }
    }
  } else {
    showData.videoUrl = [];
  }

  showData.tenantsUsers = (data.tenantsUsers || []).map((item: any) => {
    item.joinTime = item.houseLinkTenant?.createdAt;
    item.joinStatus = item.houseLinkTenant?.status;
    return item;
  });

  showInfoModel.value = true;
};

// 打开视频
const openVideo = (url: string) => {
  window.open(url, '_blank');
};
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

  .video-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    padding: 4px;
    display: flex;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }

  &:hover .video-actions {
    opacity: 1;
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
    height: 80px;
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
}

// 弹窗样式优化
:deep(.arco-modal) {
  .arco-modal-body {
    max-height: 85vh;
    overflow-y: auto;
    padding: 16px 20px;
  }

  .arco-modal-header {
    border-bottom: 1px solid var(--color-border-2);
    padding: 16px 20px;
  }

  .arco-modal-title {
    font-size: 16px;
    font-weight: 600;
  }

  .arco-modal-footer {
    padding: 12px 20px;
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
      height: 60px !important;
    }

    .more-images {
      height: 60px !important;
      font-size: 12px;
    }
  }
}

</style>