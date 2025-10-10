<template>
  <a-modal
    :visible="visible"
    :title="`收款管理 - ${houseData?.name || ''}`"
    title-align="start"
    width="800px"
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
      <!-- 房屋信息头部 -->
      <div class="payment-header">
        <div class="house-info">
          <icon-money-circle class="header-icon" />
          <div class="house-details">
            <h3>{{ houseData?.name || '' }}</h3>
            <p>管理该房屋的收款记录和相关费用</p>
          </div>
        </div>
      </div>

      <!-- 收款管理内容区域 -->
      <div class="payment-content">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-card size="small" title="本月应收" :bordered="false">
              <div class="payment-item">
                <span class="label">租金：</span>
                <span class="amount">¥2,500.00</span>
              </div>
              <div class="payment-item">
                <span class="label">水费：</span>
                <span class="amount water">¥125.30</span>
              </div>
              <!-- 水费明细 -->
              <div class="payment-detail water-detail">
                <div class="detail-item">
                  <span class="detail-label">单价：</span>
                  <span class="detail-value">¥4.50/吨</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">起数：</span>
                  <span class="detail-value">125.8</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">止数：</span>
                  <span class="detail-value">153.7</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">用量：</span>
                  <span class="detail-value">27.9吨</span>
                </div>
              </div>
              <div class="payment-item">
                <span class="label">电费：</span>
                <span class="amount electricity">¥195.20</span>
              </div>
              <!-- 电费明细 -->
              <div class="payment-detail electricity-detail">
                <div class="detail-item">
                  <span class="detail-label">单价：</span>
                  <span class="detail-value">¥0.68/度</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">起数：</span>
                  <span class="detail-value">1,248</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">止数：</span>
                  <span class="detail-value">1,535</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">用量：</span>
                  <span class="detail-value">287度</span>
                </div>
              </div>
              <div class="payment-item total">
                <span class="label">合计：</span>
                <span class="amount total-amount">¥2,820.50</span>
              </div>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card size="small" title="收款状态" :bordered="false">
              <div class="payment-status">
                <a-tag color="orange" size="medium">待收款</a-tag>
                <p class="status-desc">租客本月费用尚未缴纳</p>
              </div>
              <div class="payment-actions">
                <a-button type="primary" size="small" style="margin-right: 8px;">
                  标记已收款
                </a-button>
                <a-button size="small">
                  发送提醒
                </a-button>
              </div>
            </a-card>
          </a-col>
        </a-row>

        <!-- 收款记录 -->
        <div class="payment-history">
          <a-card size="small" title="最近收款记录" :bordered="false">
            <a-table
              :columns="historyColumns"
              :data="historyData"
              :pagination="false"
              size="small"
            >
              <template #status="{ record }">
                <a-tag :color="record.status === '已缴' ? 'green' : 'orange'">
                  {{ record.status }}
                </a-tag>
              </template>
            </a-table>
          </a-card>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

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

// 监听弹窗显示状态
watch(() => props.visible, (newVal) => {
  if (newVal) {
    houseData.value = props.house
  }
})

// 保存数据
const handleSave = async () => {
  if (!houseData.value) return

  loading.value = true
  try {
    // 这里应该调用API保存数据
    console.log('收款管理操作:', { houseId: houseData.value.id })

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    emit('success', { houseId: houseData.value.id })
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
}
</script>

<style lang="less" scoped>
.payment-modal-container {
  .payment-header {
    margin-bottom: 20px;
    padding: 16px;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
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

  .payment-content {
    .payment-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .label {
        color: #666;
        font-weight: 500;
      }

      .amount {
        font-weight: 600;
        color: #1890ff;

        &.water {
          color: #1890ff;
        }

        &.electricity {
          color: #faad14;
        }
      }

      &.total {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #f0f0f0;

        .label {
          font-weight: 600;
          color: #1a1a1a;
        }

        .total-amount {
          font-size: 16px;
          color: #f5222d;
        }
      }
    }

    .payment-detail {
      margin-left: 45px;
      margin-bottom: 12px;
      padding: 8px 12px;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 3px solid;

      &.water-detail {
        border-left-color: #1890ff;
        background: #f0f9ff;
      }

      &.electricity-detail {
        border-left-color: #faad14;
        background: #fffbe6;
      }

      .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
        font-size: 12px;

        &:last-child {
          margin-bottom: 0;
        }

        .detail-label {
          color: #666;
          font-weight: 400;
        }

        .detail-value {
          color: #333;
          font-weight: 500;
        }
      }
    }

    .payment-status {
      text-align: center;
      margin-bottom: 16px;

      .status-desc {
        margin: 8px 0 0 0;
        color: #666;
        font-size: 12px;
      }
    }

    .payment-actions {
      display: flex;
      justify-content: center;
    }

    .payment-history {
      margin-top: 20px;
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
  }
}
</style>