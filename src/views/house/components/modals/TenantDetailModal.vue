<template>
  <a-modal
    :visible="visible"
    title=""
    title-align="start"
    width="900px"
    :mask-closable="false"
    class="tenant-detail-modal"
    @update:visible="$emit('update:visible', $event)"
  >
    <template #footer>
      <a-space>
        <a-button @click="$emit('close')">关闭</a-button>
      </a-space>
    </template>

    <div class="tenant-detail-container">
      <!-- 主要内容区域 -->
      <div class="main-content">
        <!-- 左侧：租客信息区域 -->
        <div class="tenant-section">
          <div class="section-header">
            <icon-user theme="filled" size="20" />
            <h3>租客信息</h3>
          </div>

          <div class="tenant-profile">
            <div class="tenant-info">
              <div class="info-row primary">
                <span class="label">姓名</span>
                <span class="value name">{{ tenantDetailData.tenantName || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="label">电话</span>
                <span class="value">{{ tenantDetailData.phoneNumber || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="label">身份证</span>
                <span class="value">{{ tenantDetailData.idCardNumber || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="label">入住时间</span>
                <span class="value">{{ tenantDetailData.joinTime || '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：租赁信息区域 -->
        <div class="lease-section">
          <div class="section-header">
            <icon-file-text theme="filled" size="20" />
            <h3>租赁信息</h3>
          </div>

          <!-- 合同期限卡片 -->
          <div class="contract-period-card">
            <div class="period-header">
              <icon-calendar theme="filled" size="18" />
              <span class="period-title">合同期限</span>
            </div>
            <div class="period-content">
              <div class="period-item">
                <span class="period-label">开始日期</span>
                <span class="period-value">{{ tenantDetailData.leaseStartDate || '-' }}</span>
              </div>
              <div class="period-arrow">
                <icon-arrow-right />
              </div>
              <div class="period-item">
                <span class="period-label">结束日期</span>
                <span class="period-value">{{ tenantDetailData.leaseEndDate || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- 费用信息网格 -->
          <div class="fees-grid">
            <div class="fee-card primary">
              <div class="fee-icon">
                <icon-dollar-circle theme="filled" />
              </div>
              <div class="fee-content">
                <div class="fee-label">月租金</div>
                <div class="fee-value">¥{{ formatAmount(tenantDetailData.rentPrice) }}</div>
                <div class="fee-unit">每月</div>
              </div>
            </div>

            <div class="fee-card">
              <div class="fee-icon">
                <icon-safe theme="filled" />
              </div>
              <div class="fee-content">
                <div class="fee-label">房屋押金</div>
                <div class="fee-value">¥{{ formatAmount(tenantDetailData.houseDeposit) }}</div>
                <div class="fee-unit">一次性</div>
              </div>
            </div>

            <div class="fee-card">
              <div class="fee-icon">
                <icon-home theme="filled" />
              </div>
              <div class="fee-content">
                <div class="fee-label">物业费</div>
                <div class="fee-value">¥{{ formatAmount(tenantDetailData.propertyFee) }}</div>
                <div class="fee-unit">每月</div>
              </div>
            </div>

            <div class="fee-card">
              <div class="fee-icon">
                <icon-wifi theme="filled" />
              </div>
              <div class="fee-content">
                <div class="fee-label">网络费</div>
                <div class="fee-value">¥{{ formatAmount(tenantDetailData.internetFee) }}</div>
                <div class="fee-unit">每月</div>
              </div>
            </div>
          </div>

          <!-- 其他信息 -->
          <div class="additional-info">
            <div class="info-card">
              <div class="info-header">
                <icon-info-circle />
                <span>其他信息</span>
              </div>
              <div class="info-details">
                <div class="detail-row">
                  <span class="detail-label">月结日</span>
                  <span class="detail-value">{{ getPaymentDayLabel(tenantDetailData.monthlyPaymentDay) }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">其他押金</span>
                  <span class="detail-value">¥{{ formatAmount(tenantDetailData.otherDeposit) }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">水表底数</span>
                  <span class="detail-value">{{ tenantDetailData.waterMeterReading || '-' }} 吨</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">电表底数</span>
                  <span class="detail-value">{{ tenantDetailData.electricityMeterReading || '-' }} 度</span>
                </div>
              </div>
            </div>

            <div class="remark-card">
              <div class="remark-header">
                <icon-file-text />
                <span>备注信息</span>
              </div>
              <div class="remark-content">
                {{ tenantDetailData.remark || '暂无备注' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部统计信息 -->
      <div class="summary-section">
        <div class="summary-item">
          <span class="summary-label">月度总费用</span>
          <span class="summary-value primary">¥{{ formatAmount(calculateMonthlyTotalFee()) }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">入住时长</span>
          <span class="summary-value">{{ calculateTenantStayDuration() }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">合同剩余天数</span>
          <span class="summary-value">{{ calculateContractRemainingDays() }}天</span>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { formatAmount } from '../../utils/formatters';
import { getPaymentDayLabel } from '../../utils/formatters';
import { calculateMonthlyTotal, calculateStayDuration, calculateRemainingDays } from '../../utils/calculators';

interface Props {
  visible: boolean;
  tenantDetailData: any;
}

const props = defineProps<Props>();

defineEmits<{
  'update:visible': [value: boolean];
  close: [];
}>();

// 计算方法
const calculateMonthlyTotalFee = () => {
  return calculateMonthlyTotal(
    props.tenantDetailData.rentPrice,
    props.tenantDetailData.propertyFee,
    props.tenantDetailData.internetFee
  );
};

const calculateTenantStayDuration = () => {
  return calculateStayDuration(props.tenantDetailData.joinTime);
};

const calculateContractRemainingDays = () => {
  return calculateRemainingDays(props.tenantDetailData.leaseEndDate);
};
</script>

<style scoped lang="scss">
// 租客详情弹窗样式
.tenant-detail-modal {
  :deep(.arco-modal) {
    .arco-modal-body {
      padding: 0;
    }

    .arco-modal-header {
      display: none;
    }

    .arco-modal-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--color-border-2);
      background: var(--color-bg-2);
    }
  }
}

.tenant-detail-container {
  .main-content {
    display: flex;
    gap: 24px;
    padding: 24px;

    .tenant-section {
      flex: 0 0 300px;

      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 2px solid var(--color-primary-6);

        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--color-text-1);
        }
      }

      .tenant-profile {
        .tenant-info {
          .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid var(--color-border-2);

            &:last-child {
              border-bottom: none;
            }

            &.primary {
              .label {
                font-weight: 600;
                color: var(--color-text-1);
              }

              .value.name {
                font-size: 16px;
                font-weight: 700;
                color: var(--color-primary-6);
              }
            }

            .label {
              font-size: 14px;
              color: var(--color-text-2);
              font-weight: 500;
            }

            .value {
              font-size: 14px;
              color: var(--color-text-1);
              font-weight: 500;
            }
          }
        }
      }
    }

    .lease-section {
      flex: 1;

      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 2px solid var(--color-primary-6);

        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--color-text-1);
        }
      }

      .contract-period-card {
        background: linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2));
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 4px 12px rgba(var(--color-primary-6), 0.1);

        .period-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;

          .period-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--color-text-1);
          }
        }

        .period-content {
          display: flex;
          align-items: center;
          gap: 16px;

          .period-item {
            flex: 1;
            text-align: center;

            .period-label {
              display: block;
              font-size: 12px;
              color: var(--color-text-3);
              margin-bottom: 4px;
            }

            .period-value {
              display: block;
              font-size: 14px;
              font-weight: 600;
              color: var(--color-text-1);
            }
          }

          .period-arrow {
            color: var(--color-primary-6);
            font-size: 16px;
          }
        }
      }

      .fees-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-bottom: 20px;

        .fee-card {
          background: var(--color-bg-2);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid var(--color-border-2);
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
          }

          &.primary {
            background: linear-gradient(135deg, var(--color-primary-1), var(--color-primary-2));
            border-color: var(--color-primary-3);

            .fee-value {
              color: var(--color-primary-6);
              font-size: 18px;
            }
          }

          .fee-icon {
            margin-bottom: 8px;
            color: var(--color-primary-6);
            font-size: 20px;
          }

          .fee-content {
            .fee-label {
              font-size: 12px;
              color: var(--color-text-3);
              margin-bottom: 4px;
            }

            .fee-value {
              font-size: 16px;
              font-weight: 700;
              color: var(--color-text-1);
              margin-bottom: 2px;
            }

            .fee-unit {
              font-size: 11px;
              color: var(--color-text-3);
            }
          }
        }
      }

      .additional-info {
        display: flex;
        gap: 16px;

        .info-card, .remark-card {
          flex: 1;
          background: var(--color-bg-2);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid var(--color-border-2);

          .info-header, .remark-header {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 12px;
            font-size: 14px;
            font-weight: 600;
            color: var(--color-text-1);
          }

          .info-details {
            .detail-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 6px 0;

              .detail-label {
                font-size: 12px;
                color: var(--color-text-3);
              }

              .detail-value {
                font-size: 13px;
                color: var(--color-text-1);
                font-weight: 500;
              }
            }
          }

          .remark-content {
            font-size: 13px;
            color: var(--color-text-2);
            line-height: 1.5;
          }
        }
      }
    }
  }

  .summary-section {
    display: flex;
    justify-content: space-around;
    padding: 20px 24px;
    background: var(--color-bg-2);
    border-top: 1px solid var(--color-border-2);

    .summary-item {
      text-align: center;

      .summary-label {
        display: block;
        font-size: 12px;
        color: var(--color-text-3);
        margin-bottom: 4px;
      }

      .summary-value {
        display: block;
        font-size: 16px;
        font-weight: 600;
        color: var(--color-text-1);

        &.primary {
          color: var(--color-primary-6);
          font-size: 18px;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .tenant-detail-container {
    .main-content {
      flex-direction: column;
      gap: 20px;
      padding: 16px;

      .tenant-section {
        flex: none;

        .section-header {
          margin-bottom: 16px;
        }
      }

      .lease-section {
        .fees-grid {
          grid-template-columns: 1fr;
        }

        .additional-info {
          flex-direction: column;
          gap: 12px;
        }
      }
    }

    .summary-section {
      flex-direction: column;
      gap: 12px;

      .summary-item {
        display: flex;
        justify-content: space-between;
        text-align: left;
      }
    }
  }
}
</style>