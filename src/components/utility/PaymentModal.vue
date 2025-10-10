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

              <!-- 实际收费金额输入区域 -->
              <div class="actual-payment-input">
                <a-divider style="margin: 16px 0 12px 0;">实际收费金额</a-divider>

                <div class="input-item">
                  <div class="input-label">租金：</div>
                  <div class="input-content">
                    <a-input-number
                      v-model="actualPayments.rent"
                      :precision="2"
                      :min="0"
                      placeholder="请输入实际租金"
                      size="small"
                      style="width: 120px;"
                    />
                    <span class="expected-amount">应收：¥{{ expectedPayments.rent.toFixed(2) }}</span>
                    <span
                      :class="['difference', paymentDifferences.rent > 0 ? 'positive' : paymentDifferences.rent < 0 ? 'negative' : '']"
                    >
                      {{ paymentDifferences.rent > 0 ? '+' : '' }}¥{{ Math.abs(paymentDifferences.rent).toFixed(2) }}
                    </span>
                  </div>
                </div>

                <div class="input-item">
                  <div class="input-label">水费：</div>
                  <div class="input-content">
                    <a-input-number
                      v-model="actualPayments.water"
                      :precision="2"
                      :min="0"
                      placeholder="请输入实际水费"
                      size="small"
                      style="width: 120px;"
                    />
                    <span class="expected-amount">应收：¥{{ expectedPayments.water.toFixed(2) }}</span>
                    <span
                      :class="['difference', paymentDifferences.water > 0 ? 'positive' : paymentDifferences.water < 0 ? 'negative' : '']"
                    >
                      {{ paymentDifferences.water > 0 ? '+' : '' }}¥{{ Math.abs(paymentDifferences.water).toFixed(2) }}
                    </span>
                  </div>
                </div>

                <div class="input-item">
                  <div class="input-label">电费：</div>
                  <div class="input-content">
                    <a-input-number
                      v-model="actualPayments.electricity"
                      :precision="2"
                      :min="0"
                      placeholder="请输入实际电费"
                      size="small"
                      style="width: 120px;"
                    />
                    <span class="expected-amount">应收：¥{{ expectedPayments.electricity.toFixed(2) }}</span>
                    <span
                      :class="['difference', paymentDifferences.electricity > 0 ? 'positive' : paymentDifferences.electricity < 0 ? 'negative' : '']"
                    >
                      {{ paymentDifferences.electricity > 0 ? '+' : '' }}¥{{ Math.abs(paymentDifferences.electricity).toFixed(2) }}
                    </span>
                  </div>
                </div>

                <div class="input-total">
                  <div class="total-label">合计：</div>
                  <div class="total-content">
                    <span class="actual-total">实收：¥{{ totalActual.toFixed(2) }}</span>
                    <span class="expected-total">应收：¥{{ totalExpected.toFixed(2) }}</span>
                    <span
                      :class="['total-difference', totalDifference > 0 ? 'positive' : totalDifference < 0 ? 'negative' : '']"
                    >
                      {{ totalDifference > 0 ? '+' : '' }}¥{{ Math.abs(totalDifference).toFixed(2) }}
                    </span>
                  </div>
                </div>

                <div class="notes-item">
                  <div class="notes-label">备注：</div>
                  <a-textarea
                    v-model="actualPayments.notes"
                    placeholder="请输入收费备注信息"
                    :auto-size="{ minRows: 2, maxRows: 4 }"
                    size="small"
                  />
                </div>
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

// 实际收费金额数据
const actualPayments = ref({
  rent: 2500.00,
  water: 125.30,
  electricity: 195.20,
  notes: ''
})

// 应收金额（固定值）
const expectedPayments = {
  rent: 2500.00,
  water: 125.30,
  electricity: 195.20
}

// 计算差额
const paymentDifferences = computed(() => ({
  rent: actualPayments.value.rent - expectedPayments.rent,
  water: actualPayments.value.water - expectedPayments.water,
  electricity: actualPayments.value.electricity - expectedPayments.electricity
}))

// 计算总计
const totalExpected = computed(() =>
  expectedPayments.rent + expectedPayments.water + expectedPayments.electricity
)

const totalActual = computed(() =>
  actualPayments.value.rent + actualPayments.value.water + actualPayments.value.electricity
)

const totalDifference = computed(() => totalActual.value - totalExpected.value)

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

    .actual-payment-input {
      margin-top: 16px;
      padding: 12px;
      background: #fafafa;
      border-radius: 6px;
      border: 1px solid #f0f0f0;

      .input-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .input-label {
          width: 60px;
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }

        .input-content {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;

          .expected-amount {
            font-size: 12px;
            color: #999;
          }

          .difference {
            font-size: 12px;
            font-weight: 500;

            &.positive {
              color: #f5222d;
            }

            &.negative {
              color: #52c41a;
            }
          }
        }
      }

      .input-total {
        display: flex;
        align-items: center;
        margin: 12px 0 8px 0;
        padding-top: 8px;
        border-top: 1px solid #e8e8e8;

        .total-label {
          width: 60px;
          font-size: 12px;
          color: #333;
          font-weight: 600;
        }

        .total-content {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;

          .actual-total {
            font-size: 14px;
            font-weight: 600;
            color: #1890ff;
          }

          .expected-total {
            font-size: 12px;
            color: #999;
          }

          .total-difference {
            font-size: 14px;
            font-weight: 600;

            &.positive {
              color: #f5222d;
            }

            &.negative {
              color: #52c41a;
            }
          }
        }
      }

      .notes-item {
        display: flex;
        margin-top: 8px;

        .notes-label {
          width: 60px;
          font-size: 12px;
          color: #666;
          font-weight: 500;
          padding-top: 4px;
        }

        .arco-textarea-wrapper {
          flex: 1;
        }
      }
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