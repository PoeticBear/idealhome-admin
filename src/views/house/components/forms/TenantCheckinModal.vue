<template>
  <a-modal
    :visible="visible"
    :title="`租客入住登记 - ${checkinData.houseName}`"
    title-align="start"
    width="800px"
    :mask-closable="false"
    @update:visible="$emit('update:visible', $event)"
  >
    <template #footer>
      <a-space>
        <a-button @click="$emit('cancel')">取消</a-button>
        <a-button type="primary" :loading="loading" @click="$emit('confirm')">提交登记</a-button>
      </a-space>
    </template>

    <div class="checkin-form-container">
      <!-- 租客信息部分 -->
      <div class="checkin-section">
        <h3 class="section-title">
          <icon-user theme="filled" size="18" />
          租客信息
        </h3>
        <a-form :model="checkinForm" layout="vertical" size="medium">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="租客姓名"
                field="tenantName"
                :rules="[{ required: true, message: '请输入租客姓名' }]"
              >
                <a-input
                  v-model="checkinForm.tenantName"
                  placeholder="请输入租客姓名"
                  :max-length="50"
                  show-word-limit
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="身份证号码"
                field="idCard"
                :rules="VALIDATION_RULES.ID_CARD"
              >
                <a-input
                  v-model="checkinForm.idCard"
                  placeholder="请输入18位身份证号码"
                  :max-length="18"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="手机号码"
                field="phoneNumber"
                :rules="VALIDATION_RULES.PHONE_NUMBER"
              >
                <a-input
                  v-model="checkinForm.phoneNumber"
                  placeholder="请输入11位手机号码"
                  :max-length="11"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="身份照片" field="idPhoto">
                <a-upload
                  v-model="checkinForm.idPhoto"
                  :limit="1"
                  :auto-upload="false"
                  accept="image/*"
                  list-type="picture-card"
                  image-preview
                  :on-before-upload="handleBeforeUpload"
                  :on-change="handleFileChange"
                >
                  <template #upload-button>
                    <div class="upload-trigger">
                      <icon-upload />
                      <div class="upload-text">上传照片</div>
                    </div>
                  </template>
                </a-upload>
                <div class="upload-tip">
                  支持 jpg、png 格式，文件大小不超过 2MB
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 租赁信息部分 -->
      <div class="checkin-section">
        <h3 class="section-title">
          <icon-file-text theme="filled" size="18" />
          租赁信息
        </h3>
        <a-form :model="checkinForm" layout="vertical" size="medium">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="合同起始日期"
                field="contractStartDate"
                :rules="[{ required: true, message: '请选择合同起始日期' }]"
              >
                <a-date-picker
                  v-model="checkinForm.contractStartDate"
                  placeholder="请选择合同起始日期"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="合同结束日期"
                field="contractEndDate"
                :rules="[{ required: true, message: '请选择合同结束日期' }]"
              >
                <a-date-picker
                  v-model="checkinForm.contractEndDate"
                  placeholder="请选择合同结束日期"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item
                label="月结日"
                field="paymentDay"
                :rules="VALIDATION_RULES.PAYMENT_DAY"
              >
                <a-select
                  v-model="checkinForm.paymentDay"
                  placeholder="请选择月结日"
                  :options="paymentDayOptions"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="出房价格（元）"
                field="rentPrice"
                :rules="[{ required: true, message: '请输入出房价格' }]"
              >
                <a-input-number
                  v-model="checkinForm.rentPrice"
                  placeholder="请输入出房价格"
                  :min="0"
                  :precision="2"
                  style="width: 100%"
                >
                  <template #suffix>元</template>
                </a-input-number>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="房屋押金（元）"
                field="houseDeposit"
                :rules="[{ required: true, message: '请输入房屋押金' }]"
              >
                <a-input-number
                  v-model="checkinForm.houseDeposit"
                  placeholder="请输入房屋押金"
                  :min="0"
                  :precision="2"
                  style="width: 100%"
                >
                  <template #suffix>元</template>
                </a-input-number>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="其他押金（元）" field="otherDeposit">
                <a-input-number
                  v-model="checkinForm.otherDeposit"
                  placeholder="请输入其他押金"
                  :min="0"
                  :precision="2"
                  style="width: 100%"
                >
                  <template #suffix>元</template>
                </a-input-number>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="物管费用（元）"
                field="managementFee"
                :rules="[{ required: true, message: '请输入物管费用' }]"
              >
                <a-input-number
                  v-model="checkinForm.managementFee"
                  placeholder="请输入物管费用"
                  :min="0"
                  :precision="2"
                  style="width: 100%"
                >
                  <template #suffix>元</template>
                </a-input-number>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="网络费用（元）"
                field="internetFee"
                :rules="[{ required: true, message: '请输入网络费用' }]"
              >
                <a-input-number
                  v-model="checkinForm.internetFee"
                  placeholder="请输入网络费用"
                  :min="0"
                  :precision="2"
                  style="width: 100%"
                >
                  <template #suffix>元</template>
                </a-input-number>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item
                label="水表底数"
                field="waterMeterReading"
                :rules="[{ required: true, message: '请输入水表底数' }]"
              >
                <a-input-number
                  v-model="checkinForm.waterMeterReading"
                  placeholder="请输入水表底数"
                  :min="0"
                  :precision="1"
                  style="width: 100%"
                >
                  <template #suffix>吨</template>
                </a-input-number>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="电表底数"
                field="electricMeterReading"
                :rules="[{ required: true, message: '请输入电表底数' }]"
              >
                <a-input-number
                  v-model="checkinForm.electricMeterReading"
                  placeholder="请输入电表底数"
                  :min="0"
                  :precision="1"
                  style="width: 100%"
                >
                  <template #suffix>度</template>
                </a-input-number>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="备注" field="notes">
                <a-textarea
                  v-model="checkinForm.notes"
                  placeholder="请输入备注信息"
                  :max-length="200"
                  :auto-size="{ minRows: 2, maxRows: 4 }"
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { VALIDATION_RULES } from '../../constants/form';
import { validateImageFile } from '../../utils/validators';
import { PAYMENT_DAY_OPTIONS } from '../../constants/house';
import { Message } from '@arco-design/web-vue';

interface Props {
  visible: boolean;
  checkinData: any;
  checkinForm: any;
  loading: boolean;
}

defineProps<Props>();

defineEmits<{
  'update:visible': [value: boolean];
  confirm: [];
  cancel: [];
}>();

const paymentDayOptions = PAYMENT_DAY_OPTIONS;

// 文件上传前的验证
const handleBeforeUpload = (file: File): boolean => {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    Message.error(validation.error);
    return false;
  }
  return true;
};

// 文件选择变化处理
const handleFileChange = (fileList: any[], file: any) => {
  if (file.status === 'uploading') {
    // 开始上传
    Message.loading({
      content: '正在上传身份照片...',
      duration: 0
    });
  } else if (file.status === 'done') {
    // 上传成功
    Message.success({
      content: '身份照片上传成功'
    });
  } else if (file.status === 'error') {
    // 上传失败
    Message.error({
      content: '身份照片上传失败，请重试'
    });
  }
};
</script>

<style scoped lang="scss">
// 租客入住登记弹窗上下布局样式
.checkin-form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .checkin-section {
    background: var(--color-fill-1);
    border-radius: 8px;
    padding: 20px;

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 20px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text-1);
      padding-bottom: 12px;
      border-bottom: 1px solid var(--color-border-2);
    }
  }
}

// 租客入住登记弹窗样式
:deep(.arco-modal-body) {
  .upload-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--color-text-3);
    font-size: 14px;

    .upload-text {
      margin-top: 4px;
    }
  }

  .upload-tip {
    margin-top: 8px;
    font-size: 12px;
    color: var(--color-text-3);
    line-height: 1.4;
  }
}

// 租客入住登记表单样式优化
:deep(.arco-form-item) {
  .arco-form-item-label {
    font-weight: 600;
    color: var(--color-text-2);
  }

  .arco-input,
  .arco-input-number,
  .arco-select,
  .arco-textarea {
    &:hover {
      border-color: var(--color-primary-3);
    }

    &:focus-within {
      border-color: var(--color-primary-5);
      box-shadow: 0 0 0 2px rgba(var(--color-primary-1), 0.1);
    }
  }
}

// 上传组件样式优化
:deep(.arco-upload) {
  .arco-upload-list-item {
    border-radius: 6px;
    overflow: hidden;

    &:hover {
      border-color: var(--color-primary-5);
    }
  }

  .arco-upload-list-picture-card {
    width: 104px;
    height: 104px;
    border-radius: 6px;
    border: 1px dashed var(--color-border-2);
    background: var(--color-fill-1);
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--color-primary-5);
      background: var(--color-primary-1);
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .checkin-form-container {
    .checkin-section {
      padding: 16px;

      .section-title {
        font-size: 14px;
        margin-bottom: 16px;
        padding-bottom: 8px;
      }
    }
  }

  :deep(.arco-modal) {
    width: 95% !important;
    margin: 10px;

    .arco-modal-body {
      padding: 12px 16px;
    }

    .arco-modal-header {
      padding: 12px 16px;
    }

    .arco-modal-footer {
      padding: 12px 16px;
    }
  }
}
</style>