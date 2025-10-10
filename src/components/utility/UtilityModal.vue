<template>
  
  <a-modal
    :visible="visible"
    :title="`水电录入 - ${houseData?.name || ''}`"
    title-align="start"
    width="1200px"
    :mask-closable="false"
    @update:visible="handleVisibleChange"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" :loading="loading" @click="handleSave">保存</a-button>
      </a-space>
    </template>

    <div class="utility-modal-container">
      <!-- 房屋信息头部 -->
      <div class="utility-header">
        <div class="house-info">
          <icon-home class="header-icon" />
          <div class="house-details">
            <h3>{{ houseData?.name || '' }}</h3>
            <p>请录入各项费用的详细信息</p>
          </div>
        </div>
      </div>

      <!-- 缴费项目表格 -->
      <div class="utility-bills-container">
        <a-table
          :columns="tableColumns"
          :data="tableData"
          :pagination="false"
          :scroll="{ x: 1080 }"
          size="small"
          bordered
        >
          <!-- 单价列 -->
          <template #unitPrice="{ record }">
            <a-input-number
              v-model="form[record.key].unitPrice"
              :precision="2"
              :min="0"
              placeholder="0.00"
              size="small"
              style="width: 100%"
              @change="calculateTotalPrice(record.key)"
            />
          </template>

          <!-- 起数列 -->
          <template #startReading="{ record }">
            <a-input-number
              v-model="form[record.key].startReading"
              :precision="2"
              :min="0"
              placeholder="0.00"
              size="small"
              style="width: 100%"
              @change="calculateTotalPrice(record.key)"
            />
          </template>

          <!-- 止数列 -->
          <template #endReading="{ record }">
            <a-input-number
              v-model="form[record.key].endReading"
              :precision="2"
              :min="0"
              placeholder="0.00"
              size="small"
              style="width: 100%"
              @change="calculateTotalPrice(record.key)"
            />
          </template>

          <!-- 总价列 -->
          <template #totalPrice="{ record }">
            <a-input-number
              v-model="form[record.key].totalPrice"
              :precision="2"
              :min="0"
              placeholder="0.00"
              size="small"
              style="width: 100%"
            />
          </template>

          <!-- 备注列 -->
          <template #notes="{ record }">
            <a-input
              v-model="form[record.key].notes"
              placeholder="请输入备注"
              size="small"
              style="width: 100%"
            />
          </template>

          <!-- 用量时段列 -->
          <template #dateRange="{ record }">
            <div class="date-range-cell">
              <a-range-picker
                v-model="form[record.key].dateRange"
                size="small"
                style="width: 100%; margin-bottom: 4px;"
                @change="onDateRangeChange(record.key)"
              />
              <a-radio-group
                v-model="form[record.key].quickPeriod"
                size="mini"
                @change="onQuickPeriodChange(record.key)"
              >
                <a-radio value="current">本月</a-radio>
                <a-radio value="last">上月</a-radio>
                <a-radio value="beforeLast">前两月</a-radio>
                <a-radio value="custom">自定义</a-radio>
              </a-radio-group>
            </div>
          </template>
        </a-table>
      </div>

      <!-- 费用汇总 -->
      <div class="utility-summary">
        <a-card size="small" :bordered="false">
          <div class="summary-content">
            <div class="summary-item">
              <span class="label">水费：</span>
              <span class="value water">¥{{ formatAmount(form.water.totalPrice || 0) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">电费：</span>
              <span class="value electricity">¥{{ formatAmount(form.electricity.totalPrice || 0) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">气费：</span>
              <span class="value gas">¥{{ formatAmount(form.gas.totalPrice || 0) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">热水费：</span>
              <span class="value hot-water">¥{{ formatAmount(form.hotWater.totalPrice || 0) }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-item total">
              <span class="label">总计：</span>
              <span class="value">¥{{ formatAmount(calculateGrandTotal()) }}</span>
            </div>
          </div>
        </a-card>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'

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

// 表单数据结构
const form = reactive({
  water: {
    unitPrice: null,
    startReading: null,
    endReading: null,
    totalPrice: null,
    dateRange: [],
    quickPeriod: 'current',
    notes: ''
  },
  electricity: {
    unitPrice: null,
    startReading: null,
    endReading: null,
    totalPrice: null,
    dateRange: [],
    quickPeriod: 'current',
    notes: ''
  },
  gas: {
    unitPrice: null,
    startReading: null,
    endReading: null,
    totalPrice: null,
    dateRange: [],
    quickPeriod: 'current',
    notes: ''
  },
  hotWater: {
    unitPrice: null,
    startReading: null,
    endReading: null,
    totalPrice: null,
    dateRange: [],
    quickPeriod: 'current',
    notes: ''
  }
})

// 计算属性
const houseData = ref(props.house)

// 表格数据配置
const utilityTypes = [
  { key: 'water', name: '水费', unit: '元/吨' },
  { key: 'electricity', name: '电费', unit: '元/度' },
  { key: 'gas', name: '气费', unit: '元/立方米' },
  { key: 'hotWater', name: '热水费', unit: '元/吨' }
]

// 表格列配置
const tableColumns = [
  {
    title: '费用项目',
    dataIndex: 'name',
    width: 120,
    fixed: 'left'
  },
  {
    title: '单价',
    dataIndex: 'unitPrice',
    width: 120,
    slotName: 'unitPrice'
  },
  {
    title: '起数',
    dataIndex: 'startReading',
    width: 120,
    slotName: 'startReading'
  },
  {
    title: '止数',
    dataIndex: 'endReading',
    width: 120,
    slotName: 'endReading'
  },
  {
    title: '总价',
    dataIndex: 'totalPrice',
    width: 120,
    slotName: 'totalPrice'
  },
  {
    title: '备注',
    dataIndex: 'notes',
    width: 200,
    slotName: 'notes'
  },
  {
    title: '用量时段',
    dataIndex: 'dateRange',
    width: 280,
    slotName: 'dateRange'
  }
]

// 表格数据
const tableData = computed(() => {
  return utilityTypes.map(type => ({
    key: type.key,
    name: type.name,
    unit: type.unit,
    unitPrice: form[type.key].unitPrice,
    startReading: form[type.key].startReading,
    endReading: form[type.key].endReading,
    totalPrice: form[type.key].totalPrice,
    notes: form[type.key].notes,
    dateRange: form[type.key].dateRange,
    quickPeriod: form[type.key].quickPeriod
  }))
})

// 监听弹窗显示状态，初始化表单
watch(() => props.visible, (newVal) => {
  console.log('UtilityModal: visible属性变化:', newVal);
  console.log('UtilityModal: 接收到的房屋数据:', props.house);
  if (newVal) {
    houseData.value = props.house
    initializeForm()
    console.log('UtilityModal: 弹窗应该显示，已初始化表单');
  }
})

// 初始化表单
const initializeForm = () => {
  console.log('initializeForm: 开始初始化表单，form:', form);

  // 安全检查
  if (!form) {
    console.error('initializeForm: form 对象未定义');
    return;
  }

  const today = new Date()
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const utilityTypes = ['water', 'electricity', 'gas', 'hotWater']
  console.log('initializeForm: utilityTypes:', utilityTypes);

  utilityTypes.forEach(type => {
    console.log(`initializeForm: 初始化 ${type}`);
    if (form[type]) {
      form[type].unitPrice = null
      form[type].startReading = null
      form[type].endReading = null
      form[type].totalPrice = null
      form[type].notes = ''
      form[type].dateRange = [currentMonthStart, currentMonthEnd]
      form[type].quickPeriod = 'current'
    } else {
      console.error(`initializeForm: form[${type}] 未定义`);
    }
  })

  console.log('initializeForm: 表单初始化完成');
}

// 重置表单
const resetForm = () => {
  console.log('resetForm: 开始重置表单，form:', form);

  // 安全检查
  if (!form) {
    console.error('resetForm: form 对象未定义');
    return;
  }

  const utilityTypes = ['water', 'electricity', 'gas', 'hotWater']

  utilityTypes.forEach(type => {
    if (form[type]) {
      Object.keys(form[type]).forEach(key => {
        if (key === 'dateRange') {
          form[type][key] = []
        } else if (key === 'quickPeriod') {
          form[type][key] = 'current'
        } else if (key === 'notes') {
          form[type][key] = ''
        } else {
          form[type][key] = null
        }
      })
      console.log(`resetForm: ${type} 已重置`);
    } else {
      console.error(`resetForm: form[${type}] 未定义`);
    }
  })

  console.log('resetForm: 表单重置完成');
}

// 计算总价
const calculateTotalPrice = (type: string) => {
  const formItem = form[type]
  if (formItem.unitPrice !== null && formItem.startReading !== null && formItem.endReading !== null) {
    const usage = formItem.endReading - formItem.startReading
    if (usage > 0) {
      formItem.totalPrice = parseFloat((usage * formItem.unitPrice).toFixed(2))
    } else {
      formItem.totalPrice = null
    }
  }
}

// 日期范围变更
const onDateRangeChange = (type: string) => {
  form[type].quickPeriod = 'custom'
}

// 快速时段选择
const onQuickPeriodChange = (type: string) => {
  const period = form[type].quickPeriod
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

  form[type].dateRange = [startDate, endDate]
}

// 计算总计
const calculateGrandTotal = () => {
  console.log('calculateGrandTotal: 开始计算总计，form:', form);

  // 安全检查
  if (!form) {
    console.error('calculateGrandTotal: form 对象未定义');
    return 0;
  }

  let total = 0
  const utilityTypes = ['water', 'electricity', 'gas', 'hotWater']

  utilityTypes.forEach(type => {
    console.log(`calculateGrandTotal: 处理 ${type}`);
    if (form[type] && form[type].totalPrice !== null) {
      total += form[type].totalPrice
      console.log(`calculateGrandTotal: ${type} 总价: ${form[type].totalPrice}, 累计: ${total}`);
    } else {
      console.log(`calculateGrandTotal: ${type} 无数据或总价为 null`);
    }
  })

  console.log('calculateGrandTotal: 最终总计:', total);
  return total
}

// 格式化金额
const formatAmount = (value: number) => {
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 保存数据
const handleSave = async () => {
  if (!houseData.value) return

  loading.value = true
  try {
    // 构建提交数据
    const submitData = {
      houseId: houseData.value.id,
      water: { ...form.water },
      electricity: { ...form.electricity },
      gas: { ...form.gas },
      hotWater: { ...form.hotWater }
    }

    // 这里应该调用API保存数据
    console.log('水电录入数据:', submitData)

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    emit('success', submitData)
    handleCancel()
  } catch (error) {
    console.error('保存水电录入失败:', error)
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
  resetForm()
  houseData.value = null
}
</script>

<style lang="less" scoped>
.utility-modal-container {
  .utility-header {
    margin-bottom: 20px;
    padding: 16px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 8px;

    .house-info {
      display: flex;
      align-items: center;

      .header-icon {
        font-size: 24px;
        color: #1890ff;
        margin-right: 12px;
      }

      .house-details {
        h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
        }

        p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }
      }
    }
  }

  .utility-bills-container {
    margin-bottom: 20px;

    .arco-table {
      .arco-table-th {
        background-color: #fafafa;
        font-weight: 600;
      }

      .arco-table-td {
        padding: 8px 12px;
      }
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
        min-width: 120px;

        .label {
          font-weight: 500;
          color: #666;
        }

        .value {
          font-weight: 600;
          font-size: 16px;

          &.water {
            color: #1890ff;
          }

          &.electricity {
            color: #faad14;
          }

          &.gas {
            color: #f5222d;
          }

          &.hot-water {
            color: #eb2f96;
          }
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
  .utility-modal-container {
    .utility-header {
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

    .utility-bills-container {
      .date-range-cell {
        .arco-radio-group {
          flex-direction: column;
          align-items: flex-start;
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