<template>
  <a-modal
    :visible="visible"
    title="租客详情"
    title-align="start"
    width="900px"
    :mask-closable="false"
    class="tenant-detail-modal"
    @update:visible="$emit('update:visible', $event)"
  >

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

          <!-- 租赁信息列表 -->
          <div class="lease-info">
            <div class="info-row">
              <span class="label">开始日期</span>
              <span class="value">{{ tenantDetailData.leaseStartDate || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="label">结束日期</span>
              <span class="value">{{ tenantDetailData.leaseEndDate || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="label">月租金</span>
              <span class="value">¥{{ formatAmount(tenantDetailData.rentPrice) }}</span>
            </div>
            <div class="info-row">
              <span class="label">房屋押金</span>
              <span class="value">¥{{ formatAmount(tenantDetailData.houseDeposit) }}</span>
            </div>
            <div class="info-row">
              <span class="label">物业费</span>
              <span class="value">¥{{ formatAmount(tenantDetailData.propertyFee) }}</span>
            </div>
            <div class="info-row">
              <span class="label">网络费</span>
              <span class="value">¥{{ formatAmount(tenantDetailData.internetFee) }}</span>
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
      padding: 16px 20px;
      border-bottom: 1px solid var(--color-border-2);

      .arco-modal-header-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--color-text-1);
      }

      .arco-modal-close-btn {
        color: var(--color-text-3);

        &:hover {
          color: var(--color-text-1);
        }
      }
    }

    .arco-modal-footer {
      display: none;
    }
  }
}

.tenant-detail-container {
  .main-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px 12px;

    .tenant-section {
      flex: none;

      .section-header {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 8px;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--color-primary-6);

        h3 {
          margin: 0;
          font-size: 16px;
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
            padding: 6px 0;
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
        gap: 6px;
        margin-bottom: 8px;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--color-primary-6);

        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-1);
        }
      }

      .lease-info {
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid var(--color-border-2);

          &:last-child {
            border-bottom: none;
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
            text-align: right;
          }
        }
      }

      .additional-info {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .info-card, .remark-card {
          background: var(--color-bg-2);
          border-radius: 6px;
          padding: 10px;
          border: 1px solid var(--color-border-2);

          .info-header, .remark-header {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 8px;
            font-size: 13px;
            font-weight: 600;
            color: var(--color-text-1);
          }

          .info-details {
            .detail-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 4px 0;

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
            font-size: 12px;
            color: var(--color-text-2);
            line-height: 1.4;
          }
        }
      }
    }
  }

  .summary-section {
    display: flex;
    justify-content: space-around;
    padding: 8px 16px;
    background: var(--color-bg-2);
    border-top: 1px solid var(--color-border-2);

    .summary-item {
      text-align: center;

      .summary-label {
        display: block;
        font-size: 12px;
        color: var(--color-text-3);
        margin-bottom: 3px;
      }

      .summary-value {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: var(--color-text-1);

        &.primary {
          color: var(--color-primary-6);
          font-size: 16px;
        }
      }
    }
  }

  .close-section {
    padding: 16px;
    text-align: center;
    border-top: 1px solid var(--color-border-2);
    background: var(--color-bg-2);

    .arco-btn {
      min-width: 120px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .tenant-detail-container {
    .main-content {
      gap: 8px;
      padding: 10px;

      .tenant-section {
        .section-header {
          margin-bottom: 8px;
        }

        .tenant-info .info-row {
          padding: 5px 0;

          &.primary .value.name {
            font-size: 15px;
          }

          .label, .value {
            font-size: 13px;
          }
        }
      }

      .lease-section {
        .lease-info .info-row {
          padding: 5px 0;

          .label, .value {
            font-size: 13px;
          }
        }

        .additional-info {
          gap: 6px;

          .info-card, .remark-card {
            padding: 8px;

            .info-header, .remark-header {
              margin-bottom: 6px;
              font-size: 12px;
            }

            .info-details .detail-row {
              padding: 3px 0;

              .detail-label {
                font-size: 11px;
              }

              .detail-value {
                font-size: 12px;
              }
            }

            .remark-content {
              font-size: 11px;
            }
          }
        }
      }
    }

    .summary-section {
      flex-direction: column;
      gap: 8px;
      padding: 8px 12px;

      .summary-item {
        display: flex;
        justify-content: space-between;
        text-align: left;

        .summary-label {
          font-size: 11px;
        }

        .summary-value {
          font-size: 13px;

          &.primary {
            font-size: 14px;
          }
        }
      }
    }

    .close-section {
      padding: 12px;

      .arco-btn {
        min-width: 100px;
        font-size: 13px;
      }
    }
  }
}
</style>