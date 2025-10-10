<template>
  <a-modal
    :visible="visible"
    title="批量水电录入"
    title-align="start"
    width="1800px"
    :mask-closable="false"
    @update:visible="handleVisibleChange"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="outline" @click="handleReset">重置</a-button>
        <a-button type="primary" :loading="loading" @click="handleSave">批量保存</a-button>
      </a-space>
    </template>

    <div class="batch-utility-modal-container">
      <!-- 房屋选择区域 -->
      <div class="house-selection-section">
        <a-card size="small" :bordered="false">
          <template #title>
            <div class="selection-title">
              <span>选择房屋</span>
              <a-tag color="blue" style="margin-left: 8px;">已选 {{ selectedHouses.length }} 套</a-tag>
            </div>
          </template>

          <div class="selection-content">
            <div class="house-selector">
              <a-select
                v-model="selectedHouseIds"
                placeholder="请选择要录入水电费用的房屋"
                multiple
                :filter-option="true"
                allow-search
                style="width: 400px;"
                @change="handleHouseSelectionChange"
              >
                <a-option v-for="house in availableHouses" :key="house.id" :value="house.id">
                  {{ house.name }}
                </a-option>
              </a-select>

              <a-button type="outline" @click="handleSelectAll" style="margin-left: 12px;">
                全选
              </a-button>
              <a-button type="outline" @click="handleClearSelection" style="margin-left: 8px;">
                清空
              </a-button>
            </div>

            <!-- 已选房屋标签 -->
            <div v-if="selectedHouses.length > 0" class="selected-houses-tags">
              <a-tag
                v-for="house in selectedHouses"
                :key="house.id"
                closable
                color="blue"
                style="margin: 4px 4px 0 0;"
                @close="handleRemoveHouse(house.id)"
              >
                {{ house.name }}
              </a-tag>
            </div>
          </div>
        </a-card>
      </div>

      <!-- 批量操作工具栏 -->
      <div v-if="selectedHouses.length > 0" class="batch-tools-section">
        <a-card size="small" :bordered="false">
          <template #title>批量操作</template>

          <div class="batch-tools">
            <a-space size="large" wrap>
              <!-- 用量时段批量设置 -->
              <div class="tool-group">
                <span class="tool-label">用量时段：</span>
                <a-range-picker
                  v-model="batchDateRange"
                  size="small"
                  @change="handleBatchDateChange"
                />
                <a-radio-group
                  v-model="batchQuickPeriod"
                  size="mini"
                  @change="handleBatchQuickPeriodChange"
                >
                  <a-radio value="current">本月</a-radio>
                  <a-radio value="last">上月</a-radio>
                  <a-radio value="beforeLast">前两月</a-radio>
                  <a-radio value="custom">自定义</a-radio>
                </a-radio-group>
              </div>

              <!-- 列级批量操作 -->
              <div class="tool-group">
                <span class="tool-label">列操作：</span>
                <a-select
                  v-model="batchTools.targetUtilityType"
                  placeholder="选择费用项目"
                  size="small"
                  style="width: 120px;"
                >
                  <a-option value="water">水费</a-option>
                  <a-option value="electricity">电费</a-option>
                  <a-option value="gas">气费</a-option>
                  <a-option value="hotWater">热水费</a-option>
                </a-select>

                <a-select
                  v-model="batchTools.targetField"
                  placeholder="选择字段"
                  size="small"
                  style="width: 100px;"
                >
                  <a-option value="unitPrice">单价</a-option>
                  <a-option value="startReading">起数</a-option>
                  <a-option value="endReading">止数</a-option>
                  <a-option value="totalPrice">总价</a-option>
                                  </a-select>

                <a-input-number
                  v-model="batchTools.targetValue"
                  :precision="batchTools.targetField === 'unitPrice' || batchTools.targetField === 'totalPrice' ? 2 : 0"
                  :min="0"
                  placeholder="批量值"
                  size="small"
                  style="width: 120px;"
                />

                <a-button
                  type="primary"
                  size="small"
                  @click="handleBatchColumnFill"
                  :disabled="!batchTools.targetUtilityType || !batchTools.targetField"
                >
                  应用到所有
                </a-button>
              </div>

              <!-- 通用批量操作 -->
              <div class="tool-group">
                <a-button size="small" @click="handleBatchClear">清空所有数据</a-button>
                <a-button size="small" @click="handleBatchFillSample">填充示例数据</a-button>
                <a-button size="small" @click="handleBatchCopyFirst">复制第一行到其他</a-button>
              </div>
            </a-space>
          </div>
        </a-card>
      </div>

      <!-- 自定义双表头表格 -->
      <div v-if="selectedHouses.length > 0" class="utility-table-section">
        <!-- 自定义表头 -->
        <div class="custom-table-header">
          <table class="header-table">
            <thead>
              <tr class="first-header-row">
                <th rowspan="2" class="house-name-header">房屋名称</th>
                <th v-for="type in utilityTypes" :key="type.key" :colspan="5" class="utility-header">
                  {{ type.name }}
                </th>
                <th rowspan="2" class="actions-header">操作</th>
              </tr>
              <tr class="second-header-row">
                <template v-for="type in utilityTypes" :key="`sub-${type.key}`">
                  <th>单价</th>
                  <th>起数</th>
                  <th>止数</th>
                  <th>总价</th>
                  <th>用量时段</th>
                </template>
              </tr>
            </thead>
          </table>
        </div>

        <!-- 表格主体 -->
        <div class="table-body-container">
          <a-table
            :columns="bodyColumns"
            :data="tableData"
            :pagination="false"
            :scroll="{ y: 400 }"
            size="small"
            bordered
            :show-header="false"
          >
            <!-- 房屋名称列 -->
            <template #houseName="{ record }">
              <div class="house-name-cell">
                <span class="house-name">{{ record.houseName }}</span>
                <a-tag
                  :color="getStatusColor(record.status)"
                  size="small"
                  style="margin-left: 8px;"
                >
                  {{ getStatusText(record.status) }}
                </a-tag>
              </div>
            </template>

            <!-- 水费相关字段 -->
            <!-- 水费单价列 -->
            <template #waterUnitPrice="{ record }">
              <a-input-number
                v-model="batchData[record.houseId].water.unitPrice"
                :precision="2"
                :min="0"
                placeholder="0.00"
                size="small"
                style="width: 100%"
                @change="calculateTotalPrice(record.houseId, 'water')"
              />
            </template>

            <!-- 水费起数列 -->
            <template #waterStartReading="{ record }">
              <a-input-number
                v-model="batchData[record.houseId].water.startReading"
                :precision="2"
                :min="0"
                placeholder="0.00"
                size="small"
                style="width: 100%"
                @change="calculateTotalPrice(record.houseId, 'water')"
              />
            </template>

            <!-- 水费止数列 -->
            <template #waterEndReading="{ record }">
              <a-input-number
                v-model="batchData[record.houseId].water.endReading"
                :precision="2"
                :min="0"
                placeholder="0.00"
                size="small"
                style="width: 100%"
                @change="calculateTotalPrice(record.houseId, 'water')"
              />
            </template>

            <!-- 水费总价列 -->
            <template #waterTotalPrice="{ record }">
              <a-input-number
                v-model="batchData[record.houseId].water.totalPrice"
                :precision="2"
                :min="0"
                placeholder="0.00"
                size="small"
                style="width: 100%"
              />
            </template>

            <!-- 水费用量时段列 -->
            <template #waterDateRange="{ record }">
              <div class="date-range-cell">
                <a-range-picker
                  v-model="batchData[record.houseId].water.dateRange"
                  size="small"
                  style="width: 100%; margin-bottom: 4px;"
                  @change="handleDateRangeChange(record.houseId, 'water')"
                />
                <a-radio-group
                  v-model="batchData[record.houseId].water.quickPeriod"
                  size="mini"
                  @change="handleQuickPeriodChange(record.houseId, 'water')"
                >
                  <a-radio value="current">本月</a-radio>
                  <a-radio value="last">上月</a-radio>
                  <a-radio value="beforeLast">前两月</a-radio>
                  <a-radio value="custom">自定义</a-radio>
                </a-radio-group>
              </div>
            </template>

            <!-- 电费相关字段 -->
            <!-- 电费单价列 -->
            <template #electricityUnitPrice="{ record }">
              <a-input-number
                v-model="batchData[record.houseId].electricity.unitPrice"
                :precision="2"
                :min="0"
                placeholder="0.00"
                size="small"
                style="width: 100%"
                @change="calculateTotalPrice(record.houseId, 'electricity')"
              />
            </template>

            <!-- 电费起数列 -->
            <template #electricityStartReading="{ record }">
              <a-input-number
                v-model="batchData[record.houseId].electricity.startReading"
                :precision="2"
                :min="0"
                placeholder="0.00"
                size="small"
                style="width: 100%"
                @change="calculateTotalPrice(record.houseId, 'electricity')"
              />
            </template>

            <!-- 电费止数列 -->
            <template #electricityEndReading="{ record }">
              <a-input-number
                v-model="batchData[record.houseId].electricity.endReading"
                :precision="2"
                :min="0"
                placeholder="0.00"
                size="small"
                style="width: 100%"
                @change="calculateTotalPrice(record.houseId, 'electricity')"
              />
            </template>

            <!-- 电费总价列 -->
            <template #electricityTotalPrice="{ record }">
              <a-input-number
                v-model="batchData[record.houseId].electricity.totalPrice"
                :precision="2"
                :min="0"
                placeholder="0.00"
                size="small"
                style="width: 100%"
              />
            </template>

            <!-- 电费用量时段列 -->
            <template #electricityDateRange="{ record }">
              <div class="date-range-cell">
                <a-range-picker
                  v-model="batchData[record.houseId].electricity.dateRange"
                  size="small"
                  style="width: 100%; margin-bottom: 4px;"
                  @change="handleDateRangeChange(record.houseId, 'electricity')"
                />
                <a-radio-group
                  v-model="batchData[record.houseId].electricity.quickPeriod"
                  size="mini"
                  @change="handleQuickPeriodChange(record.houseId, 'electricity')"
                >
                  <a-radio value="current">本月</a-radio>
                  <a-radio value="last">上月</a-radio>
                  <a-radio value="beforeLast">前两月</a-radio>
                  <a-radio value="custom">自定义</a-radio>
                </a-radio-group>
              </div>
            </template>

            <!-- 气费相关字段 -->
            <!-- 气费单价列 -->
            <template #gasUnitPrice="{ record }">
              <a-input-number
                v-model="batchData[record.houseId].gas.unitPrice"
                :precision="2"
                :min="0"
                placeholder="0.00"
                size="small"
                style="width: 100%"
                @change="calculateTotalPrice(record.houseId, 'gas')"
              />
            </template>

            <!-- 气费起数列 -->
            <template #gasStartReading="{ record }">
              <a-input-number
                v-model="batchData[record.houseId].gas.startReading"
                :precision="2"
                :min="0"
                placeholder="0.00"
                size="small"
                style="width: 100%"
                @change="calculateTotalPrice(record.houseId, 'gas')"
              />
            </template>

            <!-- 气费止数列 -->
            <template #gasEndReading="{ record }">
              <a-input-number
                v-model="batchData[record.houseId].gas.endReading"
                :precision="2"
                :min="0"
                placeholder="0.00"
                size="small"
                style="width: 100%"
                @change="calculateTotalPrice(record.houseId, 'gas')"
              />
            </template>

            <!-- 气费总价列 -->
            <template #gasTotalPrice="{ record }">
              <a-input-number
                v-model="batchData[record.houseId].gas.totalPrice"
                :precision="2"
                :min="0"
                placeholder="0.00"
                size="small"
                style="width: 100%"
              />
            </template>

            <!-- 气费用量时段列 -->
            <template #gasDateRange="{ record }">
              <div class="date-range-cell">
                <a-range-picker
                  v-model="batchData[record.houseId].gas.dateRange"
                  size="small"
                  style="width: 100%; margin-bottom: 4px;"
                  @change="handleDateRangeChange(record.houseId, 'gas')"
                />
                <a-radio-group
                  v-model="batchData[record.houseId].gas.quickPeriod"
                  size="mini"
                  @change="handleQuickPeriodChange(record.houseId, 'gas')"
                >
                  <a-radio value="current">本月</a-radio>
                  <a-radio value="last">上月</a-radio>
                  <a-radio value="beforeLast">前两月</a-radio>
                  <a-radio value="custom">自定义</a-radio>
                </a-radio-group>
              </div>
            </template>

            <!-- 热水费相关字段 -->
            <!-- 热水费单价列 -->
            <template #hotWaterUnitPrice="{ record }">
              <a-input-number
                v-model="batchData[record.houseId].hotWater.unitPrice"
                :precision="2"
                :min="0"
                placeholder="0.00"
                size="small"
                style="width: 100%"
                @change="calculateTotalPrice(record.houseId, 'hotWater')"
              />
            </template>

            <!-- 热水费起数列 -->
            <template #hotWaterStartReading="{ record }">
              <a-input-number
                v-model="batchData[record.houseId].hotWater.startReading"
                :precision="2"
                :min="0"
                placeholder="0.00"
                size="small"
                style="width: 100%"
                @change="calculateTotalPrice(record.houseId, 'hotWater')"
              />
            </template>

            <!-- 热水费止数列 -->
            <template #hotWaterEndReading="{ record }">
              <a-input-number
                v-model="batchData[record.houseId].hotWater.endReading"
                :precision="2"
                :min="0"
                placeholder="0.00"
                size="small"
                style="width: 100%"
                @change="calculateTotalPrice(record.houseId, 'hotWater')"
              />
            </template>

            <!-- 热水费总价列 -->
            <template #hotWaterTotalPrice="{ record }">
              <a-input-number
                v-model="batchData[record.houseId].hotWater.totalPrice"
                :precision="2"
                :min="0"
                placeholder="0.00"
                size="small"
                style="width: 100%"
              />
            </template>

            <!-- 热水费用量时段列 -->
            <template #hotWaterDateRange="{ record }">
              <div class="date-range-cell">
                <a-range-picker
                  v-model="batchData[record.houseId].hotWater.dateRange"
                  size="small"
                  style="width: 100%; margin-bottom: 4px;"
                  @change="handleDateRangeChange(record.houseId, 'hotWater')"
                />
                <a-radio-group
                  v-model="batchData[record.houseId].hotWater.quickPeriod"
                  size="mini"
                  @change="handleQuickPeriodChange(record.houseId, 'hotWater')"
                >
                  <a-radio value="current">本月</a-radio>
                  <a-radio value="last">上月</a-radio>
                  <a-radio value="beforeLast">前两月</a-radio>
                  <a-radio value="custom">自定义</a-radio>
                </a-radio-group>
              </div>
            </template>

            <!-- 操作列 -->
            <template #actions="{ record }">
              <a-space>
                <a-button
                  type="text"
                  size="small"
                  @click="handleCopyToOther(record.houseId)"
                >
                  复制
                </a-button>
                <a-button
                  type="text"
                  size="small"
                  @click="handleClearHouse(record.houseId)"
                >
                  清空
                </a-button>
              </a-space>
            </template>
          </a-table>
        </div>
      </div>

      <!-- 费用汇总 -->
      <div v-if="selectedHouses.length > 0" class="utility-summary">
        <a-card size="small" :bordered="false">
          <div class="summary-content">
            <div class="summary-item">
              <span class="label">水费总计：</span>
              <span class="value water">¥{{ formatAmount(summaryTotals.water) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">电费总计：</span>
              <span class="value electricity">¥{{ formatAmount(summaryTotals.electricity) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">气费总计：</span>
              <span class="value gas">¥{{ formatAmount(summaryTotals.gas) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">热水费总计：</span>
              <span class="value hot-water">¥{{ formatAmount(summaryTotals.hotWater) }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-item total">
              <span class="label">全部总计：</span>
              <span class="value">¥{{ formatAmount(summaryTotals.grandTotal) }}</span>
            </div>
          </div>
        </a-card>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { Message } from '@arco-design/web-vue'

// Props定义
interface Props {
  visible: boolean
  houses?: any[]
}

// Emits定义
interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success', data: any): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  houses: () => []
})

const emit = defineEmits<Emits>()

// 状态数据
const loading = ref(false)
const selectedHouseIds = ref<string[]>([])
const expandedRowKeys = ref<string[]>([])

// 批量操作数据
const batchDateRange = ref<any[]>([])
const batchQuickPeriod = ref('current')

// 可用房屋列表（模拟数据，实际应该从props传入或API获取）
const availableHouses = computed(() => {
  return props.houses || [
    { id: '1', name: '示例房屋001' },
    { id: '2', name: '示例房屋002' },
    { id: '3', name: '示例房屋003' },
    { id: '4', name: '示例房屋004' },
    { id: '5', name: '示例房屋005' }
  ]
})

// 已选房屋
const selectedHouses = computed(() => {
  return availableHouses.value.filter(house => selectedHouseIds.value.includes(house.id))
})

// 费用项目配置
const utilityTypes = [
  { key: 'water', name: '水费', unit: '元/吨' },
  { key: 'electricity', name: '电费', unit: '元/度' },
  { key: 'gas', name: '气费', unit: '元/立方米' },
  { key: 'hotWater', name: '热水费', unit: '元/吨' }
]

// 批量录入数据结构
const batchData = reactive<Record<string, any>>({})

// 初始化房屋数据
const initializeHouseData = (houseId: string) => {
  if (!batchData[houseId]) {
    const today = new Date()
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    batchData[houseId] = {}
    utilityTypes.forEach(type => {
      batchData[houseId][type.key] = {
        unitPrice: null,
        startReading: null,
        endReading: null,
        totalPrice: null,
        dateRange: batchDateRange.value.length > 0 ? [...batchDateRange.value] : [currentMonthStart, currentMonthEnd],
        quickPeriod: batchQuickPeriod.value
      }
    })
  }
}

// 批量操作工具栏数据
const batchTools = ref({
  targetUtilityType: 'water', // 目标费用项目
  targetField: 'unitPrice', // 目标字段
  targetValue: null
})

// 创建表格主体列配置函数
const createBodyColumns = () => {
  const columns = [
    // 房屋名称列
    {
      title: '房屋名称',
      dataIndex: 'houseName',
      width: 150,
      fixed: 'left',
      slotName: 'houseName'
    }
  ]

  // 为每个费用项目添加各个字段列（跳过费用项目标题行）
  utilityTypes.forEach(type => {
    // 添加该费用项目的各个字段列
    columns.push(
      {
        title: '单价',
        dataIndex: `${type.key}UnitPrice`,
        width: 120,
        slotName: `${type.key}UnitPrice`,
        align: 'center'
      },
      {
        title: '起数',
        dataIndex: `${type.key}StartReading`,
        width: 120,
        slotName: `${type.key}StartReading`,
        align: 'center'
      },
      {
        title: '止数',
        dataIndex: `${type.key}EndReading`,
        width: 120,
        slotName: `${type.key}EndReading`,
        align: 'center'
      },
      {
        title: '总价',
        dataIndex: `${type.key}TotalPrice`,
        width: 120,
        slotName: `${type.key}TotalPrice`,
        align: 'center'
      },
        {
        title: '用量时段',
        dataIndex: `${type.key}DateRange`,
        width: 180,
        slotName: `${type.key}DateRange`,
        align: 'center'
      }
    )
  })

  // 操作列
  columns.push({
    title: '操作',
    dataIndex: 'actions',
    width: 120,
    slotName: 'actions',
    fixed: 'right'
  })

  return columns
}

// 表格主体列配置
const bodyColumns = computed(() => createBodyColumns())

// 表格数据 - 扁平化结构，每行代表一个房屋
const tableData = computed(() => {
  const data: any[] = []

  selectedHouses.value.forEach(house => {
    initializeHouseData(house.id)

    // 为每个房屋创建一行数据
    const houseRow: any = {
      key: house.id,
      houseId: house.id,
      houseName: house.name,
      status: getHouseStatus(house.id)
    }

    // 为每个费用项目添加对应的数据字段
    utilityTypes.forEach(type => {
      const utilityData = batchData[house.id][type.key]

      // 单价
      houseRow[`${type.key}UnitPrice`] = utilityData.unitPrice
      // 起数
      houseRow[`${type.key}StartReading`] = utilityData.startReading
      // 止数
      houseRow[`${type.key}EndReading`] = utilityData.endReading
      // 总价
      houseRow[`${type.key}TotalPrice`] = utilityData.totalPrice
            // 用量时段
      houseRow[`${type.key}DateRange`] = utilityData.dateRange
      // 快速时段
      houseRow[`${type.key}QuickPeriod`] = utilityData.quickPeriod
    })

    data.push(houseRow)
  })

  return data
})

// 计算房屋总费用
const calculateHouseTotal = (houseId: string) => {
  if (!batchData[houseId]) return 0

  let total = 0
  utilityTypes.forEach(type => {
    const price = batchData[houseId][type.key].totalPrice
    if (price !== null) {
      total += price
    }
  })

  return total
}

// 获取房屋状态
const getHouseStatus = (houseId: string) => {
  if (!batchData[houseId]) return 'pending'

  let completedCount = 0
  utilityTypes.forEach(type => {
    const item = batchData[houseId][type.key]
    if (item.unitPrice !== null && item.startReading !== null && item.endReading !== null) {
      completedCount++
    }
  })

  if (completedCount === 0) return 'pending'
  if (completedCount === utilityTypes.length) return 'completed'
  return 'partial'
}

// 获取状态颜色
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'green'
    case 'partial': return 'orange'
    default: return 'gray'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'completed': return '已完成'
    case 'partial': return '部分完成'
    default: return '未开始'
  }
}

// 计算费用汇总
const summaryTotals = computed(() => {
  const totals = {
    water: 0,
    electricity: 0,
    gas: 0,
    hotWater: 0,
    grandTotal: 0
  }

  selectedHouses.value.forEach(house => {
    if (batchData[house.id]) {
      utilityTypes.forEach(type => {
        const price = batchData[house.id][type.key].totalPrice
        if (price !== null) {
          totals[type.key as keyof typeof totals] += price
          totals.grandTotal += price
        }
      })
    }
  })

  return totals
})

// 获取行样式类名
const getRowClassName = (record: any) => {
  if (record.type === 'house') {
    return 'house-row'
  }
  return 'utility-row'
}

// 事件处理函数
const handleVisibleChange = (value: boolean) => {
  emit('update:visible', value)
}

const handleCancel = () => {
  emit('update:visible', false)
  resetForm()
}

const handleReset = () => {
  resetForm()
}

const handleSave = async () => {
  loading.value = true
  try {
    // 构建提交数据
    const submitData = selectedHouses.value.map(house => ({
      houseId: house.id,
      houseName: house.name,
      utilities: { ...batchData[house.id] }
    }))

    console.log('批量水电录入数据:', submitData)

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))

    emit('success', submitData)
    handleCancel()
  } catch (error) {
    console.error('批量保存失败:', error)
  } finally {
    loading.value = false
  }
}

const handleHouseSelectionChange = (houseIds: string[]) => {
  selectedHouseIds.value = houseIds
  // 自动展开新选中的房屋
  houseIds.forEach(houseId => {
    if (!expandedRowKeys.value.includes(houseId)) {
      expandedRowKeys.value.push(houseId)
    }
  })
}

const handleSelectAll = () => {
  selectedHouseIds.value = availableHouses.value.map(house => house.id)
  handleHouseSelectionChange(selectedHouseIds.value)
}

const handleClearSelection = () => {
  selectedHouseIds.value = []
  expandedRowKeys.value = []
}

const handleRemoveHouse = (houseId: string) => {
  const index = selectedHouseIds.value.indexOf(houseId)
  if (index > -1) {
    selectedHouseIds.value.splice(index, 1)
  }

  const expandedIndex = expandedRowKeys.value.indexOf(houseId)
  if (expandedIndex > -1) {
    expandedRowKeys.value.splice(expandedIndex, 1)
  }
}

const handleExpandedRowKeysChange = (keys: string[]) => {
  expandedRowKeys.value = keys
}

const handleBatchDateChange = (dateRange: any[]) => {
  batchDateRange.value = dateRange

  // 应用到所有已选房屋
  selectedHouses.value.forEach(house => {
    utilityTypes.forEach(type => {
      if (batchData[house.id] && batchData[house.id][type.key]) {
        batchData[house.id][type.key].dateRange = [...dateRange]
        batchData[house.id][type.key].quickPeriod = 'custom'
      }
    })
  })
}

const handleBatchQuickPeriodChange = (period: string) => {
  batchQuickPeriod.value = period

  const today = new Date()
  let startDate: Date
  let endDate: Date

  switch (period) {
    case 'current':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      break
    case 'last':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      endDate = new Date(today.getFullYear(), today.getMonth(), 0)
      break
    case 'beforeLast':
      startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1)
      endDate = new Date(today.getFullYear(), today.getMonth() - 1, 0)
      break
    default:
      return
  }

  const dateRange = [startDate, endDate]
  batchDateRange.value = dateRange

  // 应用到所有已选房屋
  selectedHouses.value.forEach(house => {
    utilityTypes.forEach(type => {
      if (batchData[house.id] && batchData[house.id][type.key]) {
        batchData[house.id][type.key].dateRange = [...dateRange]
        batchData[house.id][type.key].quickPeriod = period
      }
    })
  })
}

const handleBatchClear = () => {
  selectedHouses.value.forEach(house => {
    if (batchData[house.id]) {
      utilityTypes.forEach(type => {
        batchData[house.id][type.key].unitPrice = null
        batchData[house.id][type.key].startReading = null
        batchData[house.id][type.key].endReading = null
        batchData[house.id][type.key].totalPrice = null
              })
    }
  })
}

const handleBatchFillSample = () => {
  selectedHouses.value.forEach((house, index) => {
    if (batchData[house.id]) {
      utilityTypes.forEach((type, typeIndex) => {
        const basePrice = (index + 1) * (typeIndex + 1) * 2.5
        const baseUsage = 50 + (index * 10) + (typeIndex * 20)

        batchData[house.id][type.key].unitPrice = basePrice
        batchData[house.id][type.key].startReading = baseUsage
        batchData[house.id][type.key].endReading = baseUsage + 20 + (index * 5)
        calculateTotalPrice(house.id, type.key)
      })
    }
  })
}

// 列级批量填充
const handleBatchColumnFill = () => {
  if (!batchTools.targetUtilityType || !batchTools.targetField) return

  selectedHouses.value.forEach(house => {
    if (batchData[house.id] && batchData[house.id][batchTools.targetUtilityType]) {
      const targetField = batchTools.targetField
      batchData[house.id][batchTools.targetUtilityType][targetField] = batchTools.targetValue

      // 如果设置了单价或起数止数，自动计算总价
      if (targetField === 'unitPrice' || targetField === 'startReading' || targetField === 'endReading') {
        calculateTotalPrice(house.id, batchTools.targetUtilityType)
      }
    }
  })

  // 清空批量工具值
  batchTools.targetValue = null
  Message.success(`已将${batchTools.targetUtilityType}的${getFieldName(batchTools.targetField)}批量应用到所有房屋`)
}

// 复制第一行到其他行
const handleBatchCopyFirst = () => {
  if (selectedHouses.value.length < 2) return

  const firstHouse = selectedHouses.value[0]
  if (!batchData[firstHouse.id]) return

  selectedHouses.value.slice(1).forEach(house => {
    if (batchData[house.id]) {
      utilityTypes.forEach(type => {
        const source = batchData[firstHouse.id][type.key]
        const target = batchData[house.id][type.key]

        target.unitPrice = source.unitPrice
        target.startReading = source.startReading
        target.endReading = source.endReading
        target.totalPrice = source.totalPrice
                target.dateRange = [...source.dateRange]
        target.quickPeriod = source.quickPeriod

        // 如果有起数和止数，重新计算总价
        if (source.startReading !== null && source.endReading !== null) {
          const usage = source.endReading - source.startReading
          if (usage > 0 && source.unitPrice !== null) {
            target.totalPrice = parseFloat((usage * source.unitPrice).toFixed(2))
          }
        }
      })
    }
  })

  Message.success('已将第一行数据复制到其他所有房屋')
}

// 获取字段名称
const getFieldName = (field: string) => {
  const fieldNames: Record<string, string> = {
    unitPrice: '单价',
    startReading: '起数',
    endReading: '止数',
    totalPrice: '总价'
  }
  return fieldNames[field] || field
}

const handleDateRangeChange = (houseId: string, itemType: string) => {
  if (batchData[houseId] && batchData[houseId][itemType]) {
    batchData[houseId][itemType].quickPeriod = 'custom'
  }
}

const handleQuickPeriodChange = (houseId: string, itemType: string) => {
  // 可以在这里处理单个房屋的快速时段变更
}

const handleCopyToOther = (sourceHouseId: string) => {
  const sourceHouse = selectedHouses.value.find(h => h.id === sourceHouseId)
  if (!sourceHouse || !batchData[sourceHouseId]) return

  selectedHouses.value.forEach(house => {
    if (house.id !== sourceHouseId && batchData[house.id]) {
      utilityTypes.forEach(type => {
        const source = batchData[sourceHouseId][type.key]
        const target = batchData[house.id][type.key]

        target.unitPrice = source.unitPrice
        target.startReading = source.startReading
        target.endReading = source.endReading
        target.totalPrice = source.totalPrice
                target.dateRange = [...source.dateRange]
        target.quickPeriod = source.quickPeriod
      })
    }
  })
}

const handleClearHouse = (houseId: string) => {
  if (batchData[houseId]) {
    utilityTypes.forEach(type => {
      batchData[houseId][type.key].unitPrice = null
      batchData[houseId][type.key].startReading = null
      batchData[houseId][type.key].endReading = null
      batchData[houseId][type.key].totalPrice = null
      batchData[houseId][type.key].notes = ''
    })
  }
}

const calculateTotalPrice = (houseId: string, itemType: string) => {
  if (!batchData[houseId] || !batchData[houseId][itemType]) return

  const item = batchData[houseId][itemType]
  if (item.unitPrice !== null && item.startReading !== null && item.endReading !== null) {
    const usage = item.endReading - item.startReading
    if (usage > 0) {
      item.totalPrice = parseFloat((usage * item.unitPrice).toFixed(2))
    } else {
      item.totalPrice = null
    }
  }
}

const formatAmount = (value: number) => {
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const resetForm = () => {
  selectedHouseIds.value = []
  expandedRowKeys.value = []
  batchDateRange.value = []
  batchQuickPeriod.value = 'current'
  Object.keys(batchData).forEach(key => delete batchData[key])
}

// 监听弹窗显示状态
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // 初始化批量数据
    const today = new Date()
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    batchDateRange.value = [currentMonthStart, currentMonthEnd]
    batchQuickPeriod.value = 'current'
  }
})
</script>

<style lang="less" scoped>
.batch-utility-modal-container {
  .house-selection-section {
    margin-bottom: 16px;

    .selection-title {
      display: flex;
      align-items: center;
    }

    .selection-content {
      .house-selector {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }

      .selected-houses-tags {
        display: flex;
        flex-wrap: wrap;
      }
    }
  }

  .batch-tools-section {
    margin-bottom: 16px;

    .batch-tools {
      .tool-group {
        display: flex;
        align-items: center;

        .tool-label {
          margin-right: 8px;
          font-weight: 500;
          color: #666;
        }
      }
    }
  }

  .utility-table-section {
    margin-bottom: 16px;

    // 自定义双表头样式
    .custom-table-header {
      position: relative;
      z-index: 10;
      margin-bottom: -1px;
      background: #fafafa;
      border: 1px solid #e8e8e8;
      border-bottom: none;
      border-radius: 6px 6px 0 0;
      overflow: hidden;
    }

    .custom-table-header .header-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    .custom-table-header th {
      padding: 12px 8px;
      text-align: center;
      font-weight: 600;
      background: #fafafa;
      border: 1px solid #e8e8e8;
      color: #1a1a1a;
      position: relative;
    }

    .custom-table-header .first-header-row th {
      background: #f0f2f5;
      font-size: 14px;
      font-weight: 700;
    }

    .custom-table-header .second-header-row th {
      background: #fafafa;
      font-size: 13px;
      font-weight: 600;
    }

    .custom-table-header .house-name-header {
      width: 150px;
      min-width: 150px;
    }

    .custom-table-header .utility-header {
      width: 540px; // 5列 × 平均宽度 (4×120 + 180)
      min-width: 540px;
    }

    .custom-table-header .actions-header {
      width: 120px;
      min-width: 120px;
    }

    .custom-table-header .second-header-row th {
      width: 120px; // 平均分配每个字段列（除用量时段外）
      min-width: 120px;
    }

    .table-body-container {
      // 确保表格主体与自定义表头对齐
      :deep(.arco-table) {
        margin-top: 0;
      }

      // 隐藏原有表头
      :deep(.arco-table-thead) {
        display: none;
      }

      // 确保第一行没有上边框
      :deep(.arco-table-tbody .arco-table-tr:first-child .arco-table-td) {
        border-top: none;
      }

      // 设置列宽与自定义表头一致
      :deep(.arco-table-col) {
        &:nth-child(1) { min-width: 150px; width: 150px; } // 房屋名称
        // 水费字段
        &:nth-child(2) { min-width: 120px; width: 120px; } // 水费单价
        &:nth-child(3) { min-width: 120px; width: 120px; } // 水费起数
        &:nth-child(4) { min-width: 120px; width: 120px; } // 水费止数
        &:nth-child(5) { min-width: 120px; width: 120px; } // 水费总价
        &:nth-child(6) { min-width: 180px; width: 180px; } // 水费用量时段
        // 电费字段
        &:nth-child(7) { min-width: 120px; width: 120px; } // 电费单价
        &:nth-child(8) { min-width: 120px; width: 120px; } // 电费起数
        &:nth-child(9) { min-width: 120px; width: 120px; } // 电费止数
        &:nth-child(10) { min-width: 120px; width: 120px; } // 电费总价
        &:nth-child(11) { min-width: 180px; width: 180px; } // 电费用量时段
        // 气费字段
        &:nth-child(12) { min-width: 120px; width: 120px; } // 气费单价
        &:nth-child(13) { min-width: 120px; width: 120px; } // 气费起数
        &:nth-child(14) { min-width: 120px; width: 120px; } // 气费止数
        &:nth-child(15) { min-width: 120px; width: 120px; } // 气费总价
        &:nth-child(16) { min-width: 180px; width: 180px; } // 气费用量时段
        // 热水费字段
        &:nth-child(17) { min-width: 120px; width: 120px; } // 热水费单价
        &:nth-child(18) { min-width: 120px; width: 120px; } // 热水费起数
        &:nth-child(19) { min-width: 120px; width: 120px; } // 热水费止数
        &:nth-child(20) { min-width: 120px; width: 120px; } // 热水费总价
        &:nth-child(21) { min-width: 180px; width: 180px; } // 热水费用量时段
        // 操作列
        &:nth-child(22) { min-width: 120px; width: 120px; } // 操作
      }
    }

    :deep(.arco-table) {
      .arco-table-th {
        background-color: #fafafa;
        font-weight: 600;
      }

      .arco-table-td {
        padding: 8px 12px;
      }

      .house-row {
        background-color: #f5f5f5;
        font-weight: 500;

        .arco-table-td {
          border-top: 2px solid #e8e8e8;
          border-bottom: 2px solid #e8e8e8;
        }
      }

      .utility-row {
        .arco-table-td {
          border-bottom: 1px solid #f0f0f0;
        }
      }
    }

    .item-name-cell {
      display: flex;
      align-items: center;

      .item-icon {
        margin-right: 8px;
        font-size: 16px;

        &.water { color: #1890ff; }
        &.electricity { color: #faad14; }
        &.gas { color: #f5222d; }
        &.hot-water { color: #eb2f96; }
      }

      .item-text {
        margin-right: 8px;
      }

      .house-status {
        margin-left: auto;
      }
    }

    .total-price {
      font-weight: 600;
      color: #1890ff;
    }

    .date-range-cell {
      .arco-radio-group {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;

        .arco-radio {
          margin-right: 0;
        }
      }
    }

    // 改进表格单元格样式
    :deep(.arco-table-td) {
      vertical-align: top;

      .house-name-cell {
        display: flex;
        align-items: center;

        .house-name {
          font-weight: 500;
          color: #1a1a1a;
        }
      }
    }

    // 添加表格边框
    :deep(.arco-table) {
      border: 1px solid #e8e8e8;
      border-radius: 6px;
    }
  }

  .utility-summary {
    .summary-content {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 16px;

      .summary-item {
        display: flex;
        align-items: center;
        min-width: 140px;

        .label {
          font-weight: 500;
          color: #666;
        }

        .value {
          font-weight: 600;
          font-size: 16px;

          &.water { color: #1890ff; }
          &.electricity { color: #faad14; }
          &.gas { color: #f5222d; }
          &.hot-water { color: #eb2f96; }
        }

        &.total {
          .label {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
          }

          .value {
            font-size: 18px;
            color: #1890ff;
          }
        }
      }

      .summary-divider {
        width: 1px;
        height: 24px;
        background: #e8e8e8;
        margin: 0 8px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .batch-utility-modal-container {
    .house-selection-section {
      .selection-content {
        .house-selector {
          flex-direction: column;
          align-items: stretch;

          .a-select {
            width: 100%;
            margin-bottom: 8px;
          }
        }
      }
    }

    .batch-tools-section {
      .batch-tools {
        .tool-group {
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 12px;
        }
      }
    }

    .utility-summary {
      .summary-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;

        .summary-divider {
          width: 100%;
          height: 1px;
          margin: 8px 0;
        }
      }
    }
  }
}
</style>