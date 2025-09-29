<template>
  <div>
    <headForm :label-width="100">
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

    <!-- 统计数据区域 -->
    <div class="statistics-container">
      <a-row :gutter="16">
        <a-col :xs="12" :sm="6" :lg="6" :xl="6" :xxl="6">
          <a-card class="statistics-card">
            <a-statistic title="总房屋数" :value="statisticsData.totalHouses" :value-style="{ color: '#165DFF' }">
              <template #prefix>
                <icon-home />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :xs="12" :sm="6" :lg="6" :xl="6" :xxl="6">
          <a-card class="statistics-card">
            <a-statistic title="已出租" :value="statisticsData.rentedHouses" :value-style="{ color: '#00B42A' }">
              <template #prefix>
                <icon-check-circle />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :xs="12" :sm="6" :lg="6" :xl="6" :xxl="6">
          <a-card class="statistics-card">
            <a-statistic title="待出租" :value="statisticsData.availableHouses" :value-style="{ color: '#F53F3F' }">
              <template #prefix>
                <icon-exclamation-circle />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :xs="12" :sm="6" :lg="6" :xl="6" :xxl="6">
          <a-card class="statistics-card">
            <a-statistic title="出租率" :value="statisticsData.rentalRate" suffix="%" :value-style="{ color: '#FF7D00' }">
              <template #prefix>
                <icon-chart-pie />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>

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
      width="50%"
    >
      <a-space
        direction="vertical" size="medium" fill
      >
        <a-descriptions
          size="mini" bordered align="right"
          :data="showData.info" title="租赁信息" :column="2"
          layout="inline-horizontal"
        >
          <template #value="{data}">
            <template v-if="data.label==='朝向：'">
              <a-tag v-if="data.value===1" color="red">
                东
              </a-tag>
              <a-tag v-if="data.value===2" color="orangered">
                西
              </a-tag>
              <a-tag v-if="data.value===3" color="blue">
                南
              </a-tag>
              <a-tag v-if="data.value===4" color="gray">
                呗
              </a-tag>
            </template>
            <template v-else-if="data.label==='卫生间：'">
              <a-tag v-if="data.value===1" color="green">
                独立
              </a-tag>
              <a-tag v-else-if="data.value===2" color="orange">
                公用
              </a-tag>
              <a-tag v-else color="red">
                无
              </a-tag>
            </template>
            <template v-else-if="data.label==='厨房：'">
              <a-tag v-if="data.value===1" color="green">
                独立
              </a-tag>
              <a-tag v-else-if="data.value===2" color="orange">
                公用
              </a-tag>
              <a-tag v-else color="red">
                无
              </a-tag>
            </template>
            <template v-else-if="data.label==='阳台：'">
              <a-tag v-if="data.value===1" color="green">
                有
              </a-tag>
              <a-tag v-else color="red">
                无
              </a-tag>
            </template>
            <p v-else>
              {{ data.value }}
            </p>
          </template>
        </a-descriptions>
        <div v-if="showData.tenantsUsers?.length>0">
          <p class="list-title">
            租客
          </p>
          <a-list>
            <a-list-item v-for="(item,ind) in showData.tenantsUsers" :key="ind">
              <a-list-item-meta
                :title="`${item.name}（${item.phone}）`"
                :description="`入住日期：${item.joinTime}`"
              >
                <template #avatar>
                  <a-avatar :image-url="item.headImg">
                  </a-avatar>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </div>
        <a-image-preview-group infinite>
          <p class="list-title">
            房屋图片
          </p>
          <a-row :gutter="10" align="stretch">
            <a-col
              v-for="(item, ind) in showData.headImg" :key="ind" class="mb20"
              :xs="12" :sm="6" :lg="6"
              :xl="4" :xxl="4"
            >
              <a-image
                fit="cover" :src="item.url" width="100%"
                height="100%"
              />
            </a-col>
          </a-row>
        </a-image-preview-group>
      </a-space>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
import useStore from '@/stores/index';
import { storeToRefs } from 'pinia'
import {
  getHouseList,
  getHouseStatistics
} from '@/api/house';
const store = storeToRefs(useStore())

const tableColumns: object[] = reactive([
  {
    title: '名称',
    dataIndex: 'name',
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
])
const searchData = reactive({
  name: '',
  address: '',
  status: '',
  starTime: '',
  endTime: '',
  size: pagination.pageSize,
  index: pagination.current
})
let houseList = reactive([])
const tableLoading = ref(false);

// 统计数据
const statisticsData = reactive({
  totalHouses: 0,
  rentedHouses: 0,
  availableHouses: 0,
  rentalRate: 0
});

// 获取统计数据
const getStatisticsData = () => {
  getHouseStatistics()
    .then(({ status, data }) => {
      if (status === 1 && data) {
        statisticsData.totalHouses = Number(data.totalHouses) || 0;
        statisticsData.rentedHouses = Number(data.rentedHouses) || 0;
        statisticsData.availableHouses = Number(data.availableHouses) || 0;
        statisticsData.rentalRate = Number(data.rentalRate) || 0;
      }
    })
    .catch(() => {
      // 如果接口不存在，使用模拟数据
      statisticsData.totalHouses = 0;
      statisticsData.rentedHouses = 0;
      statisticsData.availableHouses = 0;
      statisticsData.rentalRate = 0;
    });
};
const getHouseListFun = () => {
  tableLoading.value = true;
  getHouseList(searchData)
    .then(({ status, data, count }) => {
      if (status === 1) {
        pagination.total = count || 0;
        houseList = (data || [])
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
};
getHouseListFun()
getStatisticsData()
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
}
const datePickerChange = (value: any) => {
  if (value) {
    searchData.starTime = value[0]
    searchData.endTime = value[1]
  } else {
    searchData.starTime = ''
    searchData.endTime = ''
  }
  searchList()
}
let showInfoModel = ref(false)
let showData:any = reactive({})
const showInfo = (data:any) => {
  showData.name = data.name
  showData.info = [
    {
      label: '价格：',
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
      label: '楼层：',
      value: data.floor,
    },
    {
      label: '朝向：',
      value: data.toward,
    },
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
    {
      label: '备注：',
      value: data.note,
    },
  ]
  // 处理图片数据：支持字符串、JSON字符串、数组等多种格式
  if (data.headImg) {
    try {
      if (typeof data.headImg === 'string') {
        // 尝试解析JSON字符串
        const parsed = JSON.parse(data.headImg)
        showData.headImg = Array.isArray(parsed) ? parsed : [parsed]
      } else if (Array.isArray(data.headImg)) {
        // 已经是数组
        showData.headImg = data.headImg
      } else {
        // 其他情况转为数组
        showData.headImg = [data.headImg]
      }
    } catch (e) {
      // JSON解析失败，当作单个图片路径处理
      if (typeof data.headImg === 'string') {
        showData.headImg = [{ url: data.headImg }]
      } else {
        showData.headImg = [{ url: String(data.headImg) }]
      }
    }
  } else {
    showData.headImg = []
  }
  showData.tenantsUsers = (data.tenantsUsers || []).map((item:any) => {
    item.joinTime = item.houseLinkTenant?.createdAt
    item.joinStatus = item.houseLinkTenant?.status
    return item
  })
  showInfoModel.value = true
}

</script>
<style scoped lang="scss">
.list-title{
  color: var(--color-text-1);
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5715;
}

.statistics-container {
  margin-bottom: 20px;

  .statistics-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    :deep(.arco-card-body) {
      padding: 16px;
    }

    :deep(.arco-statistic) {
      .arco-statistic-title {
        font-size: 14px;
        color: var(--color-text-3);
        margin-bottom: 8px;
      }

      .arco-statistic-content {
        .arco-statistic-value {
          font-size: 24px;
          font-weight: 600;
        }

        .arco-statistic-suffix {
          font-size: 16px;
          margin-left: 4px;
        }
      }
    }
  }
}
</style>