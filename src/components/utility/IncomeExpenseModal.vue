<template>
  <a-modal
    :visible="visible"
    title="收支详情"
    title-align="start"
    width="90%"
    :mask-closable="false"
    @update:visible="handleVisibleChange"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-space>
        <a-button @click="handleCancel">关闭</a-button>
      </a-space>
    </template>

    <div class="income-expense-modal-container">
      <!-- 统计概览 -->
      <div class="statistics-overview">
        <div class="stat-item">
          <span class="stat-label">总应收：</span>
          <span class="stat-value total">{{ formatAmount(totalAmount) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">已收：</span>
          <span class="stat-value paid">{{ formatAmount(paidAmount) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">未收：</span>
          <span class="stat-value unpaid">{{ formatAmount(unpaidAmount) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">收费率：</span>
          <span class="stat-value rate">{{ formatPercentage(paymentRate) }}</span>
        </div>
      </div>

      <!-- 租金缴纳情况表格 -->
      <div class="payment-table-container">
        <a-table
          :columns="tableColumns"
          :data="paymentData"
          :loading="loading"
          :pagination="{
            total: paymentData.length,
            pageSize: 15,
            showTotal: true,
            showPageSize: true,
            showJumper: true
          }"
          size="small"
          stripe
          :scroll="{ x: 1640 }"
          row-key="id"
        >
          <template #paymentStatus="{ record }">
            <a-tag
              :color="getStatusColor(record.paymentStatus)"
              size="small"
            >
              <template #icon>
                <icon-check-circle v-if="record.paymentStatus === 'paid'" />
                <icon-close-circle v-else-if="record.paymentStatus === 'unpaid'" />
                <icon-exclamation-circle v-else />
              </template>
              {{ getStatusText(record.paymentStatus) }}
            </a-tag>
          </template>

          <template #totalAmount="{ record }">
            <span class="amount-text">{{ formatAmount(record.totalAmount) }}</span>
          </template>

          <template #tenantInfo="{ record }">
            <div class="tenant-info">
              <div class="tenant-name">{{ record.tenantName || '-' }}</div>
              <div class="tenant-phone">{{ record.tenantPhone || '-' }}</div>
            </div>
          </template>
        </a-table>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// 数据类型定义
interface PaymentRecord {
  id: string
  buildingRoom: string    // 楼栋-房号
  tenantName: string      // 租客姓名
  tenantPhone: string     // 联系电话
  baseRent: number        // 基础租金
  waterFee: number        // 水费
  electricityFee: number  // 电费
  otherFees: number       // 其他费用
  totalAmount: number     // 总应收
  paymentStatus: 'paid' | 'unpaid' | 'partial' // 缴费状态
  paymentDate?: string    // 缴费日期
  dueDate: string         // 应收时间
  billingPeriod: string   // 费用周期
}

// Props定义
interface Props {
  visible: boolean
}

// Emits定义
interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})

const emit = defineEmits<Emits>()

// 响应式数据
const loading = ref(false)
const paymentData = ref<PaymentRecord[]>([])

// 表格列配置
const tableColumns = [
  {
    title: '楼栋-房号',
    dataIndex: 'buildingRoom',
    width: 120,
    sortable: true
  },
  {
    title: '租客信息',
    slotName: 'tenantInfo',
    width: 150
  },
  {
    title: '基础租金',
    dataIndex: 'baseRent',
    width: 110,
    sortable: true,
    render: ({ record }: { record: PaymentRecord }) => formatAmount(record.baseRent)
  },
  {
    title: '水费',
    dataIndex: 'waterFee',
    width: 90,
    render: ({ record }: { record: PaymentRecord }) => formatAmount(record.waterFee)
  },
  {
    title: '电费',
    dataIndex: 'electricityFee',
    width: 90,
    render: ({ record }: { record: PaymentRecord }) => formatAmount(record.electricityFee)
  },
  {
    title: '其他费用',
    dataIndex: 'otherFees',
    width: 110,
    render: ({ record }: { record: PaymentRecord }) => formatAmount(record.otherFees)
  },
  {
    title: '总应收',
    slotName: 'totalAmount',
    dataIndex: 'totalAmount',
    width: 110,
    sortable: true
  },
  {
    title: '应收时间',
    dataIndex: 'dueDate',
    width: 120,
    sortable: true
  },
  {
    title: '费用周期',
    dataIndex: 'billingPeriod',
    width: 120,
    sortable: true
  },
  {
    title: '缴费状态',
    slotName: 'paymentStatus',
    dataIndex: 'paymentStatus',
    width: 100,
    filters: [
      { text: '已收', value: 'paid' },
      { text: '未收', value: 'unpaid' },
      { text: '部分', value: 'partial' }
    ]
  },
  {
    title: '缴费日期',
    dataIndex: 'paymentDate',
    width: 120
  }
]

// 计算统计信息
const totalAmount = computed(() =>
  paymentData.value.reduce((sum, item) => sum + item.totalAmount, 0)
)

const paidAmount = computed(() =>
  paymentData.value
    .filter(item => item.paymentStatus === 'paid')
    .reduce((sum, item) => sum + item.totalAmount, 0)
)

const unpaidAmount = computed(() =>
  paymentData.value
    .filter(item => item.paymentStatus === 'unpaid')
    .reduce((sum, item) => sum + item.totalAmount, 0)
)

const paymentRate = computed(() => {
  if (totalAmount.value === 0) return 0
  return Math.round((paidAmount.value / totalAmount.value) * 100)
})

// 费用计算逻辑
const calculateBaseRent = (area: number, buildingType: any, floor: number) => {
  const basePrice = buildingType.basePrice
  const floorPremium = floor > 10 ? 200 : floor > 5 ? 100 : 0
  return Math.round((area * basePrice) + floorPremium)
}

const calculateWaterFee = (area: number, tenantType: string, season: string) => {
  const baseFee = 25
  const areaFee = Math.round(area * 0.8)
  const tenantMultiplier = tenantType === 'family' ? 1.5 : 1.0
  const seasonMultiplier = season === 'summer' ? 1.3 : 1.0
  return Math.round(baseFee + areaFee * tenantMultiplier * seasonMultiplier)
}

const calculateElectricityFee = (area: number, tenantType: string, season: string) => {
  const baseFee = 40
  const areaFee = Math.round(area * 1.2)
  const tenantMultiplier = tenantType === 'family' ? 1.4 : tenantType === 'office' ? 1.8 : 1.0
  const seasonMultiplier = season === 'summer' ? 1.6 : season === 'winter' ? 1.3 : 1.0
  return Math.round(baseFee + areaFee * tenantMultiplier * seasonMultiplier)
}

const calculateOtherFees = (area: number, hasKitchen: boolean, buildingQuality: string) => {
  const internetFee = buildingQuality === 'high' ? 100 : buildingQuality === 'medium' ? 80 : 60
  const gasFee = hasKitchen ? Math.round(30 + Math.random() * 20) : 0
  const propertyFee = Math.round(area * (buildingQuality === 'high' ? 2.5 : buildingQuality === 'medium' ? 2.0 : 1.5))
  const managementFee = 30
  return internetFee + gasFee + propertyFee + managementFee
}

// 生成模拟房屋数据
const generateMockHouses = () => {
  const buildings = [
    {
      name: 'A栋',
      basePrice: 45,
      location: '市中心',
      quality: 'high',
      floors: 20,
      roomsPerFloor: 4
    },
    {
      name: 'B栋',
      basePrice: 38,
      location: '普通地段',
      quality: 'medium',
      floors: 15,
      roomsPerFloor: 6
    },
    {
      name: 'C栋',
      basePrice: 32,
      location: '郊区',
      quality: 'low',
      floors: 12,
      roomsPerFloor: 8
    },
    {
      name: 'D栋',
      basePrice: 42,
      location: '商业区',
      quality: 'high',
      floors: 18,
      roomsPerFloor: 4
    }
  ]

  const houses = []
  let id = 1

  // 只生成8条数据
  const targetCount = 8
  while (houses.length < targetCount) {
    buildings.forEach(building => {
      if (houses.length >= targetCount) return

      const floor = Math.floor(Math.random() * Math.min(building.floors, 10)) + 1
      const room = Math.floor(Math.random() * Math.min(building.roomsPerFloor, 6)) + 1
      const area = Math.floor(Math.random() * 60) + 40 // 40-100平米
      const roomNumber = `${floor.toString().padStart(2, '0')}${room.toString().padStart(2, '0')}`

      houses.push({
        id: `${id++}`,
        name: building.name,
        roomNumber,
        area,
        floor,
        buildingType: building,
        status: 2 // 直接设置为已出租状态
      })
    })
  }

  console.log(`生成了 ${houses.length} 条房屋数据，其中已出租 ${houses.filter(h => h.status === 2).length} 条`)
  return houses
}

// 生成租客信息
const generateTenantInfo = (index: number) => {
  const tenantNames = [
    '张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十',
    '陈一', '林二', '黄三', '刘四', '杨五', '徐六', '朱七', '马八',
    '胡九', '郭十', '何一', '高二', '罗三', '梁四', '宋五', '唐六'
  ]
  const phones = [
    '138****1234', '139****5678', '136****9012', '137****3456', '135****7890',
    '136****2345', '137****6789', '138****0123', '139****4567', '135****8901',
    '186****2345', '187****6789', '188****0123', '189****4567', '185****8901'
  ]

  const tenantTypes = ['single', 'family', 'couple', 'office', 'student']
  const tenantType = tenantTypes[index % tenantTypes.length]

  return {
    name: tenantNames[index % tenantNames.length],
    phone: phones[index % phones.length],
    type: tenantType,
    paymentReliability: Math.random() // 0-1之间，表示缴费可靠性
  }
}

// 生成模拟数据
const generateMockData = () => {
  // 直接生成丰富的模拟数据
  const mockHouses = generateMockHouses()
  const rentedHouses = mockHouses.filter(house => house.status === 2)
  console.log(`准备处理 ${rentedHouses.length} 条已出租房屋数据`)
  const result = processHouseData(rentedHouses)
  console.log(`最终生成了 ${result.length} 条缴费记录`)
  return result
}

// 处理房屋数据为缴费记录
const processHouseData = (houses: any[]) => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  const currentMonthIndex = currentDate.getMonth()

  // 判断季节
  const getSeason = (month: number) => {
    if (month >= 3 && month <= 5) return 'spring'
    if (month >= 6 && month <= 8) return 'summer'
    if (month >= 9 && month <= 11) return 'autumn'
    return 'winter'
  }
  const season = getSeason(currentMonthIndex)

  return houses.map((house, index) => {
    // 生成租客信息
    const tenantInfo = generateTenantInfo(index)

    // 使用面积信息，如果没有则随机生成
    const area = house.area || Math.floor(Math.random() * 60) + 40
    const buildingType = house.buildingType || { basePrice: 38, quality: 'medium' }
    const floor = house.floor || Math.floor(Math.random() * 10) + 1
    const hasKitchen = true // 假设都有厨房

    // 使用新的费用计算逻辑
    const baseRent = house.price || calculateBaseRent(area, buildingType, floor)
    const waterFee = calculateWaterFee(area, tenantInfo.type, season)
    const electricityFee = calculateElectricityFee(area, tenantInfo.type, season)
    const otherFees = calculateOtherFees(area, hasKitchen, buildingType.quality)
    const totalAmount = baseRent + waterFee + electricityFee + otherFees

    // 生成应收时间（每月1号）
    const dueDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`

    // 生成费用周期
    const billingPeriod = `${currentYear}年${currentMonth}月`

    // 基于租客缴费可靠性生成缴费状态
    const reliabilityScore = tenantInfo.paymentReliability
    let paymentStatus: 'paid' | 'unpaid' | 'partial'
    let paymentDate: string | undefined

    if (reliabilityScore > 0.7) {
      // 高可靠性：90%概率已收
      paymentStatus = Math.random() < 0.9 ? 'paid' : 'unpaid'
    } else if (reliabilityScore > 0.4) {
      // 中等可靠性：60%概率已收，20%部分缴费
      const rand = Math.random()
      if (rand < 0.6) paymentStatus = 'paid'
      else if (rand < 0.8) paymentStatus = 'partial'
      else paymentStatus = 'unpaid'
    } else {
      // 低可靠性：30%概率已收，50%未收，20%部分缴费
      const rand = Math.random()
      if (rand < 0.3) paymentStatus = 'paid'
      else if (rand < 0.5) paymentStatus = 'partial'
      else paymentStatus = 'unpaid'
    }

    // 生成缴费日期
    if (paymentStatus === 'paid') {
      // 已收状态：根据租客类型生成不同的缴费时间
      let paymentDayOffset: number
      switch (tenantInfo.type) {
        case 'office':
          paymentDayOffset = Math.floor(Math.random() * 5) + 1 // 1-5天（企业缴费早）
          break
        case 'family':
          paymentDayOffset = Math.floor(Math.random() * 10) + 3 // 3-12天
          break
        default:
          paymentDayOffset = Math.floor(Math.random() * 15) + 1 // 1-15天
      }
      const paymentDateObj = new Date(currentYear, currentMonthIndex, paymentDayOffset)
      paymentDate = paymentDateObj.toISOString().split('T')[0]
    } else if (paymentStatus === 'partial') {
      // 部分缴费：缴费时间较晚
      const paymentDayOffset = Math.floor(Math.random() * 10) + 16 // 16-25天
      const paymentDateObj = new Date(currentYear, currentMonthIndex, paymentDayOffset)
      paymentDate = paymentDateObj.toISOString().split('T')[0]
    }

    // 处理房屋名称
    const buildingName = house.buildingType?.name || house.name || '未知楼栋'
    const roomNumber = house.roomNumber || (index + 1).toString().padStart(3, '0')

    return {
      id: house.id,
      buildingRoom: `${buildingName}-${roomNumber}`,
      tenantName: tenantInfo.name,
      tenantPhone: tenantInfo.phone,
      baseRent,
      waterFee,
      electricityFee,
      otherFees,
      totalAmount,
      paymentStatus,
      paymentDate,
      dueDate,
      billingPeriod,
      // 额外信息用于调试和扩展
      tenantType: tenantInfo.type,
      area,
      reliabilityScore
    }
  })
}

// 获取状态颜色
const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'green'
    case 'unpaid': return 'orange'
    case 'partial': return 'gold'
    default: return 'gray'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'paid': return '已收'
    case 'unpaid': return '未收'
    case 'partial': return '部分'
    default: return '未知'
  }
}

// 格式化金额显示
const formatAmount = (amount: number) => {
  return `¥${Math.round(amount).toLocaleString()}`
}

// 格式化百分比显示
const formatPercentage = (rate: number) => {
  return `${Math.round(rate)}%`
}

// 监听弹窗显示状态，加载数据
watch(() => props.visible, (newVal) => {
  if (newVal) {
    loading.value = true
    // 模拟加载延迟
    setTimeout(() => {
      paymentData.value = generateMockData()
      loading.value = false
    }, 500)
  }
})

// 处理弹窗显示状态变更
const handleVisibleChange = (value: boolean) => {
  emit('update:visible', value)
}

// 取消操作
const handleCancel = () => {
  emit('update:visible', false)
}
</script>

<style lang="less" scoped>
.income-expense-modal-container {
  .statistics-overview {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 16px;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-radius: 8px;
    border: 1px solid #e3f2fd;

    .stat-item {
      text-align: center;

      .stat-label {
        display: block;
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
      }

      .stat-value {
        display: block;
        font-size: 18px;
        font-weight: 600;

        &.total {
          color: #1890ff;
        }

        &.paid {
          color: #52c41a;
        }

        &.unpaid {
          color: #faad14;
        }

        &.rate {
          color: #722ed1;
        }
      }
    }
  }

  .payment-table-container {
    .tenant-info {
      .tenant-name {
        font-weight: 500;
        color: #333;
        margin-bottom: 2px;
      }

      .tenant-phone {
        font-size: 12px;
        color: #999;
      }
    }

    .amount-text {
      font-weight: 600;
      color: #1890ff;
    }

    :deep(.arco-table-th) {
      background-color: #fafafa;
      font-weight: 600;
    }

    :deep(.arco-table-cell) {
      padding: 8px 12px;
    }

    :deep(.arco-tag) {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .income-expense-modal-container {
    .statistics-overview {
      .stat-value {
        font-size: 16px;
      }
    }
  }
}

@media (max-width: 768px) {
  .income-expense-modal-container {
    .statistics-overview {
      flex-direction: column;
      gap: 12px;

      .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .stat-label {
          margin-bottom: 0;
        }

        .stat-value {
          font-size: 16px;
        }
      }
    }

    .payment-table-container {
      :deep(.arco-table-cell) {
        padding: 6px 8px;
        font-size: 12px;
      }

      .tenant-info {
        .tenant-name {
          font-size: 12px;
        }

        .tenant-phone {
          font-size: 11px;
        }
      }

      .amount-text {
        font-size: 12px;
      }
    }
  }
}

@media (max-width: 480px) {
  .income-expense-modal-container {
    .statistics-overview {
      padding: 12px;

      .stat-item {
        .stat-value {
          font-size: 14px;
        }
      }
    }
  }
}
</style>