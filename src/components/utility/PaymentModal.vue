<template>
  <a-modal
    :visible="visible"
    :title="`收款管理 - ${houseData?.name || ''}`"
    title-align="start"
    width="1200px"
    :mask-closable="false"
    @update:visible="handleVisibleChange"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" :loading="loading" @click="handleSave">确认</a-button>
      </a-space>
    </template>

    <div class="payment-modal-container">
      <!-- 统计区域 -->
      <div class="statistics-section">
        <div class="statistics-header">
          <span class="statistics-title">收款统计概览</span>
          <span class="statistics-period">最近{{ statisticsData.totalPeriods }}个月</span>
        </div>
        <div class="statistics-grid">
          <!-- 总应收金额 -->
          <div class="stat-card">
            <div class="stat-icon receivable">
              <icon-calendar />
            </div>
            <div class="stat-content">
              <div class="stat-value">¥{{ statisticsData.totalReceivable.toFixed(2) }}</div>
              <div class="stat-label">总应收金额</div>
            </div>
          </div>

          <!-- 已收金额 -->
          <div class="stat-card">
            <div class="stat-icon received">
              <icon-check-circle />
            </div>
            <div class="stat-content">
              <div class="stat-value">¥{{ statisticsData.totalReceived.toFixed(2) }}</div>
              <div class="stat-label">已收金额</div>
            </div>
          </div>

          <!-- 待收金额 -->
          <div class="stat-card">
            <div class="stat-icon pending">
              <icon-clock-circle />
            </div>
            <div class="stat-content">
              <div class="stat-value">¥{{ statisticsData.totalPending.toFixed(2) }}</div>
              <div class="stat-label">待收金额</div>
            </div>
          </div>

          <!-- 收款率 -->
          <div class="stat-card">
            <div class="stat-icon rate">
              <icon-pie-chart />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statisticsData.collectionRate.toFixed(1) }}%</div>
              <div class="stat-label">收款完成率</div>
            </div>
          </div>

          <!-- 欠费周期数 -->
          <div class="stat-card">
            <div class="stat-icon overdue">
              <icon-exclamation-circle />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statisticsData.pendingPeriods }}</div>
              <div class="stat-label">欠费周期</div>
            </div>
          </div>
        </div>
      </div>

      <div class="payment-layout">
        <!-- 左侧费用周期列表 -->
        <div class="period-sidebar">
          <div class="sidebar-header">
            <span class="header-title">费用周期</span>
          </div>
          <div class="period-list">
            <div
              v-for="period in paymentPeriods"
              :key="period.id"
              :class="['period-item', { 'active': selectedPeriod?.id === period.id }]"
              @click="selectPeriod(period)"
            >
              <div class="period-month">{{ period.month }}</div>
              <div class="period-status">
                <a-tag
                  :color="period.status === '已缴' ? 'green' : period.status === '待缴' ? 'orange' : period.status === '逾期' ? 'red' : 'gray'"
                  size="small"
                >
                  {{ period.status }}
                </a-tag>
              </div>
              <div class="period-amount">¥{{ period.totalAmount.toFixed(2) }}</div>
            </div>
          </div>
        </div>

        <!-- 右侧收款管理内容区域 -->
        <div class="payment-content">
          <div class="content-header">
            <div class="header-left">
              <span class="current-period">{{ selectedPeriod?.month || '选择周期' }}</span>
              <span class="period-status-text">{{ selectedPeriod?.status || '未选择' }}</span>
            </div>
            <div class="header-right" v-if="selectedPeriod && (selectedPeriod.status === '已缴' || selectedPeriod.status === '逾期')">
              <a-button
                v-if="!isEditMode"
                type="outline"
                size="small"
                @click="toggleEditMode"
              >
                <template #icon>
                  <icon-edit />
                </template>
                编辑
              </a-button>
              <a-space v-else size="small">
                <a-button type="outline" size="small" @click="cancelEdit">取消</a-button>
                <a-button type="primary" size="small" @click="toggleEditMode">完成</a-button>
              </a-space>
            </div>
          </div>

          <!-- 租金 -->
          <div class="payment-item">
            <div class="item-left">
              <span class="item-name">租金</span>
              <span class="expected">¥{{ expectedPayments.rent.toFixed(2) }}</span>
            </div>
            <div class="item-right">
              <a-input-number
                v-if="selectedPeriod?.status === '待缴' || selectedPeriod?.status === '逾期' || isEditMode"
                v-model="actualPayments.rent"
                :precision="2"
                :min="0"
                placeholder="实际租金"
                size="small"
              />
              <span v-else class="actual-amount-with-label">
                <span class="amount-label">已收：</span>
                <span class="amount-value">¥{{ actualPayments.rent.toFixed(2) }}</span>
              </span>
            </div>
          </div>

        <!-- 水费 -->
        <div class="payment-item">
          <div class="item-left">
            <span class="item-name">水费</span>
            <span class="expected">¥{{ expectedPayments.water.toFixed(2) }}</span>
          </div>
          <div class="item-right">
            <a-input-number
              v-if="selectedPeriod?.status === '待缴' || selectedPeriod?.status === '逾期' || isEditMode"
              v-model="actualPayments.water"
              :precision="2"
              :min="0"
              placeholder="实际水费"
              size="small"
            />
            <span v-else class="actual-amount-with-label">
              <span class="amount-label">已收：</span>
              <span class="amount-value">¥{{ actualPayments.water.toFixed(2) }}</span>
            </span>
          </div>
        </div>

        <!-- 水费明细 -->
        <div class="utility-detail">
          <div class="detail-row">
            <span class="detail-label">水费用量：</span>
            <span class="detail-value">¥4.50/吨 × 27.9吨 = ¥125.30</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">表数信息：</span>
            <span class="detail-value">起数 125.8 → 止数 153.7</span>
          </div>
        </div>

        <!-- 电费 -->
        <div class="payment-item">
          <div class="item-left">
            <span class="item-name">电费</span>
            <span class="expected">¥{{ expectedPayments.electricity.toFixed(2) }}</span>
          </div>
          <div class="item-right">
            <a-input-number
              v-if="selectedPeriod?.status === '待缴' || selectedPeriod?.status === '逾期' || isEditMode"
              v-model="actualPayments.electricity"
              :precision="2"
              :min="0"
              placeholder="实际电费"
              size="small"
            />
            <span v-else class="actual-amount-with-label">
              <span class="amount-label">已收：</span>
              <span class="amount-value">¥{{ actualPayments.electricity.toFixed(2) }}</span>
            </span>
          </div>
        </div>

        <!-- 电费明细 -->
        <div class="utility-detail">
          <div class="detail-row">
            <span class="detail-label">电费用量：</span>
            <span class="detail-value">¥0.68/度 × 287度 = ¥195.20</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">表数信息：</span>
            <span class="detail-value">起数 1,248 → 止数 1,535</span>
          </div>
        </div>

        <!-- 分隔线 -->
        <a-divider style="margin: 16px 0;" />

        <!-- 合计 -->
        <div class="payment-item total">
          <div class="item-left">
            <span class="item-name">合计</span>
            <span class="expected">¥{{ totalExpected.toFixed(2) }}</span>
          </div>
          <div class="item-right">
            <span class="difference total-actual">¥{{ totalActual.toFixed(2) }}</span>
          </div>
        </div>

        <!-- 备注 -->
        <div class="notes-section">
          <div class="notes-label">备注信息：</div>
          <a-textarea
            v-if="selectedPeriod?.status === '待缴' || selectedPeriod?.status === '逾期' || isEditMode"
            v-model="actualPayments.notes"
            placeholder="请输入收费备注信息"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            size="small"
          />
          <div v-else class="notes-content">
            {{ actualPayments.notes || '暂无备注信息' }}
          </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

// Props定义
interface Props {
  visible: boolean
  house?: any
}

// Emits定义
interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success', data: any): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  house: null
})

const emit = defineEmits<Emits>()

// 状态数据
const loading = ref(false)
const houseData = ref(props.house)

// 编辑状态管理
const isEditMode = ref(false)

// 费用周期数据
const selectedPeriod = ref(null)
const paymentPeriods = ref([
  {
    id: 1,
    month: '2024年2月',
    status: '待缴',
    totalAmount: 2820.50,
    startDate: '2024-02-01',
    endDate: '2024-02-29',
    payments: {
      rent: 2500.00,
      water: 125.30,
      electricity: 195.20
    }
  },
  {
    id: 2,
    month: '2024年1月',
    status: '已缴',
    totalAmount: 2820.50,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    payments: {
      rent: 2500.00,
      water: 125.30,
      electricity: 195.20
    },
    actualPayments: {
      rent: 2500.00,
      water: 125.30,
      electricity: 195.20,
      notes: '1月份费用，按时缴纳'
    }
  },
  {
    id: 3,
    month: '2023年12月',
    status: '已缴',
    totalAmount: 2785.30,
    startDate: '2023-12-01',
    endDate: '2023-12-31',
    payments: {
      rent: 2500.00,
      water: 98.60,
      electricity: 186.70
    },
    actualPayments: {
      rent: 2500.00,
      water: 98.60,
      electricity: 186.70,
      notes: '11月份费用，按时缴纳'
    }
  },
  {
    id: 4,
    month: '2023年11月',
    status: '逾期',
    totalAmount: 2816.20,
    startDate: '2023-11-01',
    endDate: '2023-11-30',
    payments: {
      rent: 2500.00,
      water: 112.40,
      electricity: 203.80
    },
    actualPayments: {
      rent: 0,
      water: 0,
      electricity: 0,
      notes: '11月份费用，尚未缴纳'
    }
  },
  {
    id: 5,
    month: '2023年10月',
    status: '已缴',
    totalAmount: 2762.80,
    startDate: '2023-10-01',
    endDate: '2023-10-31',
    payments: {
      rent: 2500.00,
      water: 87.20,
      electricity: 175.60
    },
    actualPayments: {
      rent: 2500.00,
      water: 87.20,
      electricity: 175.60,
      notes: '9月份费用，按时缴纳'
    }
  }
])

// 实际收费金额数据
const actualPayments = ref({
  rent: 2500.00,
  water: 125.30,
  electricity: 195.20,
  notes: ''
})

// 应收金额（根据选中的周期动态计算）
const expectedPayments = computed(() => {
  if (!selectedPeriod.value) {
    return {
      rent: 2500.00,
      water: 125.30,
      electricity: 195.20
    }
  }
  return selectedPeriod.value.payments
})

// 计算差额
const paymentDifferences = computed(() => ({
  rent: actualPayments.value.rent - expectedPayments.value.rent,
  water: actualPayments.value.water - expectedPayments.value.water,
  electricity: actualPayments.value.electricity - expectedPayments.value.electricity
}))

// 计算总计
const totalExpected = computed(() =>
  expectedPayments.value.rent + expectedPayments.value.water + expectedPayments.value.electricity
)

const totalActual = computed(() =>
  actualPayments.value.rent + actualPayments.value.water + actualPayments.value.electricity
)

const totalDifference = computed(() => totalActual.value - totalExpected.value)

// 统计数据计算
const statisticsData = computed(() => {
  const totalPeriods = paymentPeriods.value.length
  const paidPeriods = paymentPeriods.value.filter(p => p.status === '已缴').length
  const pendingPeriods = paymentPeriods.value.filter(p => p.status === '待缴').length
  const overduePeriods = paymentPeriods.value.filter(p => p.status === '逾期').length

  const totalReceivable = paymentPeriods.value.reduce((sum, period) => sum + period.totalAmount, 0)
  const totalReceived = paymentPeriods.value
    .filter(p => p.status === '已缴')
    .reduce((sum, period) => sum + (period.actualPayments ?
      period.actualPayments.rent + period.actualPayments.water + period.actualPayments.electricity :
      period.totalAmount), 0)
  const totalPending = totalReceivable - totalReceived

  const collectionRate = totalReceivable > 0 ? (totalReceived / totalReceivable * 100) : 0

  return {
    totalReceivable,
    totalReceived,
    totalPending,
    collectionRate,
    totalPeriods,
    paidPeriods,
    pendingPeriods,
    overduePeriods
  }
})

// 收款记录表格列配置
const historyColumns = [
  {
    title: '月份',
    dataIndex: 'month',
    width: 100
  },
  {
    title: '租金',
    dataIndex: 'rent',
    width: 100
  },
  {
    title: '水费',
    dataIndex: 'water',
    width: 100
  },
  {
    title: '电费',
    dataIndex: 'electricity',
    width: 100
  },
  {
    title: '合计',
    dataIndex: 'total',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    slotName: 'status'
  },
  {
    title: '备注',
    dataIndex: 'notes'
  }
]

// 模拟收款记录数据
const historyData = [
  {
    month: '2024年1月',
    rent: '¥2,500.00',
    water: '¥125.30',
    electricity: '¥195.20',
    total: '¥2,820.50',
    status: '已缴',
    notes: '12月份费用，按时缴纳'
  },
  {
    month: '2023年12月',
    rent: '¥2,500.00',
    water: '¥98.60',
    electricity: '¥186.70',
    total: '¥2,785.30',
    status: '已缴',
    notes: '11月份费用，按时缴纳'
  },
  {
    month: '2023年11月',
    rent: '¥2,500.00',
    water: '¥112.40',
    electricity: '¥203.80',
    total: '¥2,816.20',
    status: '已缴',
    notes: '10月份费用，按时缴纳'
  },
  {
    month: '2023年10月',
    rent: '¥2,500.00',
    water: '¥87.20',
    electricity: '¥175.60',
    total: '¥2,762.80',
    status: '已缴',
    notes: '9月份费用，按时缴纳'
  }
]

// 选择费用周期
const selectPeriod = (period: any) => {
  selectedPeriod.value = period

  // 根据周期状态设置编辑模式
  if (period.status === '已缴') {
    isEditMode.value = false
    // 如果是已缴状态，使用已保存的实际收款数据
    actualPayments.value = period.actualPayments ? { ...period.actualPayments } : {
      rent: period.payments.rent,
      water: period.payments.water,
      electricity: period.payments.electricity,
      notes: ''
    }
  } else {
    // 如果是待缴或逾期状态，使用应收金额作为默认值，并开启编辑模式
    isEditMode.value = true
    actualPayments.value = {
      rent: period.payments.rent,
      water: period.payments.water,
      electricity: period.payments.electricity,
      notes: period.status === '逾期' ? '逾期未缴费' : ''
    }
  }
}

// 切换编辑模式
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
}

// 取消编辑
const cancelEdit = () => {
  if (selectedPeriod.value && (selectedPeriod.value.status === '已缴' || selectedPeriod.value.status === '逾期')) {
    // 恢复原始数据
    actualPayments.value = selectedPeriod.value.actualPayments ?
      { ...selectedPeriod.value.actualPayments } : {
        rent: selectedPeriod.value.payments.rent,
        water: selectedPeriod.value.payments.water,
        electricity: selectedPeriod.value.payments.electricity,
        notes: selectedPeriod.value.status === '逾期' ? '逾期未缴费' : ''
      }
    isEditMode.value = false
  }
}

// 监听弹窗显示状态
watch(() => props.visible, (newVal) => {
  if (newVal) {
    houseData.value = props.house
    // 默认选择第一个待缴的周期
    const pendingPeriod = paymentPeriods.value.find(p => p.status === '待缴')
    if (pendingPeriod) {
      selectPeriod(pendingPeriod)
    } else if (paymentPeriods.value.length > 0) {
      selectPeriod(paymentPeriods.value[0])
    }
  }
})

// 保存数据
const handleSave = async () => {
  if (!houseData.value) return

  loading.value = true
  try {
    // 构建保存数据
    const paymentData = {
      houseId: houseData.value.id,
      expectedPayments,
      actualPayments: actualPayments.value,
      differences: paymentDifferences.value,
      totals: {
        expected: totalExpected.value,
        actual: totalActual.value,
        difference: totalDifference.value
      }
    }

    // 这里应该调用API保存数据
    console.log('收款管理操作:', paymentData)

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    emit('success', paymentData)
    handleCancel()
  } catch (error) {
    console.error('收款管理操作失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理弹窗显示状态变更
const handleVisibleChange = (value: boolean) => {
  emit('update:visible', value)
}

// 取消操作
const handleCancel = () => {
  emit('update:visible', false)
  loading.value = false
  houseData.value = null

  // 重置实际收费金额数据
  actualPayments.value = {
    rent: 2500.00,
    water: 125.30,
    electricity: 195.20,
    notes: ''
  }
}
</script>

<style lang="less" scoped>
.payment-modal-container {
  // 统计区域样式
  .statistics-section {
    margin-bottom: 16px;
    padding: 16px;
    background: linear-gradient(135deg, #f6f8fa 0%, #e8f0fe 100%);
    border-radius: 8px;
    border: 1px solid #e0e0e0;

    .statistics-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .statistics-title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
      }

      .statistics-period {
        font-size: 14px;
        color: #666;
        font-weight: 500;
      }
    }

    .statistics-grid {
      display: flex;
      gap: 12px;
      justify-content: space-between;

      .stat-card {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px;
        background: white;
        border-radius: 6px;
        border: 1px solid #f0f0f0;
        transition: all 0.2s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: white;

          &.receivable {
            background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
          }

          &.received {
            background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
          }

          &.pending {
            background: linear-gradient(135deg, #faad14 0%, #d48806 100%);
          }

          &.rate {
            background: linear-gradient(135deg, #722ed1 0%, #531dab 100%);
          }

          &.overdue {
            background: linear-gradient(135deg, #f5222d 0%, #cf1322 100%);
          }
        }

        .stat-content {
          flex: 1;

          .stat-value {
            font-size: 18px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 2px;
            line-height: 1.2;
          }

          .stat-label {
            font-size: 11px;
            color: #666;
            font-weight: 500;
          }
        }
      }
    }
  }

  // 左右两列布局
  .payment-layout {
    display: flex;
    gap: 32px;
    min-height: 520px;

    // 左侧费用周期列表
    .period-sidebar {
      width: 240px;
      flex-shrink: 0;
      border-right: 1px solid #f0f0f0;
      padding-right: 24px;
      overflow-y: auto;

      .sidebar-header {
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f0f0f0;

        .header-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }
      }

      .period-list {
        .period-item {
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #f0f0f0;

          &:hover {
            background: #f8f9fa;
            border-color: #e0e0e0;
          }

          &.active {
            background: #e6f7ff;
            border-color: #1890ff;
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
          }

          .period-month {
            font-size: 14px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 6px;
          }

          .period-status {
            margin-bottom: 6px;
          }

          .period-amount {
            font-size: 13px;
            font-weight: 500;
            color: #666;
            text-align: right;
          }
        }
      }
    }

    // 右侧收款管理内容区域
    .payment-content {
      flex: 1;
      overflow: hidden;
      padding-left: 32px;
      max-width: 100%;
      box-sizing: border-box;

      .content-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f0f0f0;

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;

          .current-period {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
          }

          .period-status-text {
            font-size: 14px;
            color: #666;
            font-weight: 500;
          }
        }

        .header-right {
          display: flex;
          align-items: center;
        }
      }

      // 简化的收费项目样式
      .payment-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        &.total {
          padding: 16px;
          font-weight: 600;
          background: #fafafa;

          .item-left .item-name {
            font-size: 16px;
            font-weight: 700;
          }

          .item-left .expected {
            font-size: 16px;
            font-weight: 600;
          }

          .item-right .total-actual {
            font-size: 16px;
            font-weight: 700;
            color: #1890ff;
          }
        }

        .item-left {
          display: flex;
          align-items: center;
          gap: 16px;

          .item-name {
            font-size: 14px;
            font-weight: 500;
            color: #1a1a1a;
            min-width: 60px;
          }

          .expected {
            font-size: 14px;
            color: #666;
            font-weight: 500;
          }
        }

        .item-right {
          display: flex;
          align-items: center;
          gap: 20px;

          .arco-input-number {
            width: 200px;
          }

          .actual-amount {
            font-size: 16px;
            font-weight: 600;
            color: #1890ff;
            min-width: 120px;
            text-align: right;
          }

          .actual-amount-with-label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: #1890ff;
            font-weight: 600;
            min-width: 140px;
            text-align: right;

            .amount-label {
              font-size: 12px;
              color: #666;
              font-weight: 500;
            }

            .amount-value {
              font-size: 16px;
              font-weight: 600;
              color: #1890ff;
            }
          }
        }
      }

      // 水电用量明细样式
      .utility-detail {
        background: #f8f9fa;
        padding: 12px;
        border-radius: 6px;
        margin: 8px 0 16px 0;
        font-size: 13px;
        width: 100%;
        box-sizing: border-box;

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          width: 100%;

          &:last-child {
            margin-bottom: 0;
          }

          .detail-label {
            font-weight: 500;
            color: #666;
          }

          .detail-value {
            color: #333;
            font-weight: 500;
          }
        }
      }

      // 备注区域样式
      .notes-section {
        margin-top: 16px;

        .notes-label {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 6px;
        }

        .notes-content {
          padding: 10px 12px;
          background: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #f0f0f0;
          font-size: 14px;
          color: #333;
          line-height: 1.5;
          min-height: 48px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .payment-modal-container {
    .payment-header {
      padding: 12px;

      .house-info {
        .header-icon {
          font-size: 20px;
          margin-right: 8px;
        }

        .house-details {
          h3 {
            font-size: 16px;
          }

          p {
            font-size: 12px;
          }
        }
      }
    }

    .payment-content {
      .payment-actions {
        flex-direction: column;
        align-items: center;
        gap: 8px;

        .arco-btn {
          width: 100%;
        }
      }
    }

    .payment-detail {
      margin-left: 0;
      margin-bottom: 8px;

      .detail-item {
        font-size: 11px;
      }
    }

    .actual-payment-input {
      padding: 8px;

      .input-item {
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 12px;

        .input-label {
          width: auto;
          margin-bottom: 4px;
        }

        .input-content {
          width: 100%;
          flex-wrap: wrap;
          gap: 4px;

          .arco-input-number {
            flex: 1;
            min-width: 100px;
          }

          .expected-amount,
          .difference {
            font-size: 11px;
          }
        }
      }

      .input-total {
        flex-direction: column;
        align-items: flex-start;

        .total-label {
          width: auto;
          margin-bottom: 4px;
        }

        .total-content {
          width: 100%;
          flex-wrap: wrap;
          gap: 6px;

          span {
            font-size: 12px;
          }
        }
      }

      .notes-item {
        flex-direction: column;

        .notes-label {
          width: auto;
          margin-bottom: 4px;
          padding-top: 0;
        }
      }
    }
  }
}
</style>