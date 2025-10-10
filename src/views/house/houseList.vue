<template>
  <div class="house-list-container">
    <!-- 搜索筛选区域已隐藏 -->
    <!-- 暂时完全移除搜索表单以避免v-model触发问题 -->
    <!--
    <headForm :label-width="100" style="display: none;">
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
    -->

    <!-- 操作按钮区域 -->
    <div class="table-operations">
      <div class="operations-left">
        <a-button type="primary" @click="showAddModal">
          <template #icon>
            <icon-plus />
          </template>
          新增房屋
        </a-button>
        <a-button @click="openIncomeExpenseModal">
          <template #icon>
            <icon-bar-chart />
          </template>
          收支详情
        </a-button>
      </div>
      <div class="operations-right">
        <a-radio-group v-model="viewMode" type="button" size="small">
          <a-radio value="table">
            <template #icon>
              <icon-list />
            </template>
            列表视图
          </a-radio>
          <a-radio value="card">
            <template #icon>
              <icon-grid />
            </template>
            卡片视图
          </a-radio>
        </a-radio-group>
      </div>
    </div>

    <!-- 表格视图 -->
    <a-table
      v-if="viewMode === 'table'"
      :columns="tableColumns" :loading="tableLoading" stripe
      show-page-size :pagination="pagination"
      :data="houseList" row-key="id"
      @page-size-change="onPageSizeChange"
      @page-change="onPageChange"
    >
      <template #status="{ record }">
        <a-tag :color="getStatusInfo(record.status).color">
          {{ getStatusInfo(record.status).label }}
        </a-tag>
      </template>
        <template #operation="{ record }">
        <a-space size="mini">
          <a-button type="outline" size="mini" @click="showEdit(record)">
            编辑
          </a-button>
          <a-button type="primary" size="mini" @click="showInfo(record)">
            详情
          </a-button>
        </a-space>
      </template>
    </a-table>

    <!-- 卡片视图 -->
    <div v-if="viewMode === 'card'" class="card-view-container">
      <a-row :gutter="16">
        <a-col
          v-for="house in houseList"
          :key="house.id"
          :xs="24" :sm="12" :md="8" :lg="6" :xl="6"
        >
          <a-card class="house-card" :hoverable="true">
            <template #cover>
              <div class="card-cover">
                <div class="house-image-placeholder">
                  <icon-home size="48" />
                  <span class="placeholder-text">暂无图片</span>
                </div>
                <!-- 悬浮操作按钮 -->
                <div class="card-actions">
                  <a-button
                    type="primary"
                    shape="circle"
                    size="small"
                    class="action-btn edit-btn"
                    @click="showEdit(house)"
                  >
                    <icon-edit />
                  </a-button>
                  <a-button
                    type="outline"
                    shape="circle"
                    size="small"
                    class="action-btn view-btn"
                    @click="showInfo(house)"
                  >
                    <icon-eye />
                  </a-button>
                </div>
              </div>
            </template>

            <div class="card-content">
              <!-- 房屋名称 -->
              <div class="house-title">{{ house.name }}</div>

              <!-- 主要信息区：租金突出显示 -->
              <div class="price-section">
                <div class="price-value">{{ house.priceText }}</div>
              </div>

              <!-- 次要信息区：户型和面积 -->
              <div class="basic-info">
                <div class="info-item">
                  <icon-home class="info-icon" />
                  <span>{{ house.layoutTypeText }}</span>
                </div>
                <div class="info-item">
                  <icon-fullscreen class="info-icon" />
                  <span>{{ house.areaText }}</span>
                </div>
              </div>

              <!-- 补充信息区：地区和状态 -->
              <div class="additional-info">
                <div class="location-info">
                  <icon-location class="info-icon small" />
                  <span>{{ house.location }}</span>
                </div>
                <a-tag
                  :color="getStatusInfo(house.status).color"
                  size="small"
                  class="status-tag"
                >
                  {{ getStatusInfo(house.status).label }}
                </a-tag>
              </div>

              <!-- 租客入住登记按钮（仅待租状态显示） -->
              <div v-if="house.status === 1" class="checkin-section">
                <a-button
                  type="primary"
                  size="small"
                  class="checkin-btn"
                  @click="showCheckinModal(house)"
                >
                  <template #icon>
                    <icon-user-add />
                  </template>
                  租客入住登记
                </a-button>
              </div>

              <!-- 查看租客按钮（仅已租状态显示） -->
              <div v-if="house.status === 2" class="tenant-section">
                <a-button
                  type="outline"
                  size="small"
                  class="tenant-btn"
                  @click="showTenantDetailModal(house)"
                >
                  <template #icon>
                    <icon-user />
                  </template>
                  查看租客
                </a-button>
                <a-button
                  type="outline"
                  size="small"
                  class="payment-btn"
                  @click="handlePaymentManagement(house)"
                >
                  <template #icon>
                    <icon-money-circle />
                  </template>
                  收款管理
                </a-button>
              </div>

              <!-- 水电录入按钮（所有状态显示） -->
              <div class="utility-section">
                <a-button
                  type="outline"
                  size="small"
                  class="utility-btn"
                  @click="handleShowUtilityModal(house)"
                >
                  <template #icon>
                    <icon-thunderbolt />
                  </template>
                  录入水电
                </a-button>
                <a-button
                  type="primary"
                  size="small"
                  class="batch-utility-btn"
                  @click="handleShowBatchUtilityModal"
                >
                  <template #icon>
                    <icon-thunderbolt />
                  </template>
                  批量录入
                </a-button>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <!-- 卡片视图分页 -->
      <div class="card-pagination">
        <a-pagination
          :total="pagination.total"
          :page-size="pagination.pageSize"
          :current="pagination.current"
          :show-page-size="pagination.showPageSize"
          :show-total="pagination.showTotal"
          :show-more="pagination.showMore"
          :show-jumper="pagination.showJumper"
          :simple="pagination.simple"
          @change="onPageChange"
          @page-size-change="onPageSizeChange"
        />
      </div>
    </div>
    <a-modal
      v-model:visible="showInfoModel" :title="showData.name" title-align="start"
      width="90%"
    >
      <a-space direction="vertical" size="small" fill>
        <!-- 主要信息：左右两列布局 -->
        <a-row :gutter="16">
          <!-- 左列 -->
          <a-col :span="12">
            <a-space direction="vertical" size="small" fill>
              <!-- 基本信息 -->
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-home /> 基本信息
                </template>
                <a-descriptions
                  size="mini" :column="3"
                  :data="showData.basicInfo"
                  layout="inline-horizontal"
                >
                  <template #value="{data}">
                    <template v-if="data.label==='户型：'">
                      <a-tag color="purple" size="small">
                        {{ getHouseTypeLabel(data.value) }}
                      </a-tag>
                    </template>
                    <span v-else class="compact-text">
                      {{ data.value || '-' }}
                    </span>
                  </template>
                </a-descriptions>
              </a-card>

  
              <!-- 设施配置 -->
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-settings /> 设施配置
                </template>
                <a-descriptions
                  size="mini" :column="3"
                  :data="showData.facilityInfo"
                  layout="inline-horizontal"
                >
                  <template #value="{data}">
                    <template v-if="data.label==='朝向：'">
                      <a-tag v-if="data.value===1" color="red" size="small">东</a-tag>
                      <a-tag v-else-if="data.value===2" color="orangered" size="small">西</a-tag>
                      <a-tag v-else-if="data.value===3" color="blue" size="small">南</a-tag>
                      <a-tag v-else-if="data.value===4" color="gray" size="small">北</a-tag>
                      <span v-else>-</span>
                    </template>
                    <template v-else-if="data.label==='卫生间：' || data.label==='厨房：'">
                      <a-tag v-if="data.value===0" color="red" size="small">没有</a-tag>
                      <a-tag v-else-if="data.value===1" color="green" size="small">独立</a-tag>
                      <a-tag v-else-if="data.value===2" color="orange" size="small">公用</a-tag>
                      <span v-else>-</span>
                    </template>
                    <template v-else-if="data.label==='阳台：'">
                      <a-tag v-if="data.value===1" color="green" size="small">有</a-tag>
                      <a-tag v-else color="red" size="small">无</a-tag>
                    </template>
                    <span v-else class="compact-text">
                      {{ data.value || '-' }}
                    </span>
                  </template>
                </a-descriptions>
              </a-card>
            </a-space>
          </a-col>

          <!-- 右列 -->
          <a-col :span="12">
            <a-space direction="vertical" size="small" fill>
              <!-- 费用信息 -->
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-safe /> 费用信息
                </template>
                <a-descriptions
                  size="mini" :column="3"
                  :data="showData.costInfo"
                  layout="inline-horizontal"
                >
                  <template #value="{data}">
                    <template v-if="data.label==='实际租金：' || data.label==='对外租金：'">
                      <span class="price-text compact">{{ data.value !== '-' ? `¥${data.value}/月` : '-' }}</span>
                    </template>
                    <template v-else-if="data.label==='押金月数：'">
                      <span class="compact-text">{{ data.value ? `${data.value}个月` : '-' }}</span>
                    </template>
                    <template v-else-if="data.label==='每次付月数：'">
                      <span class="compact-text">{{ data.value ? `每${data.value}个月付一次` : '-' }}</span>
                    </template>
                    <template v-else>
                      <span class="compact-text">{{ data.value !== '-' ? `¥${data.value}` : '-' }}</span>
                    </template>
                  </template>
                </a-descriptions>
              </a-card>

              <!-- 位置信息 -->
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-location /> 位置信息
                </template>
                <a-descriptions
                  size="mini" :column="1"
                  :data="showData.locationInfo"
                  layout="inline-horizontal"
                >
                  <template #value="{data}">
                    <span class="compact-text">
                      {{ data.value || '-' }}
                    </span>
                  </template>
                </a-descriptions>
              </a-card>

              <!-- 其他信息 -->
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-info-circle /> 其他信息
                </template>
                <a-descriptions
                  size="mini" :column="1"
                  :data="showData.otherInfo"
                  layout="inline-horizontal"
                >
                  <template #value="{data}">
                    <span class="compact-text">
                      {{ data.value || '-' }}
                    </span>
                  </template>
                </a-descriptions>
              </a-card>

              <!-- 租客信息 -->
              <div v-if="showData.tenantsUsers?.length>0">
                <a-card :bordered="false" class="info-section compact">
                  <template #title>
                    <icon-user /> 租客信息
                  </template>
                  <a-list :bordered="false" size="small">
                    <a-list-item v-for="(item,ind) in showData.tenantsUsers" :key="ind">
                      <a-list-item-meta
                        :title="`${item.name}（${item.phone}）`"
                        :description="`入住日期：${item.joinTime}`"
                      >
                        <template #avatar>
                          <a-avatar :image-url="item.headImg" :size="32">
                          </a-avatar>
                        </template>
                      </a-list-item-meta>
                    </a-list-item>
                  </a-list>
                </a-card>
              </div>
            </a-space>
          </a-col>
        </a-row>

        <!-- 媒体资源区域：图片视频同行显示 -->
        <div v-if="showData.headImg?.length>0 || showData.videoUrl?.length>0">
          <a-card :bordered="false" class="info-section compact media-section">
            <template #title>
              <icon-image /> 媒体资源
            </template>
            <a-row :gutter="16">
              <!-- 房屋图片 -->
              <a-col v-if="showData.headImg?.length>0" :span="showData.videoUrl?.length>0 ? 16 : 24">
                <div class="media-subtitle">房屋图片</div>
                <a-image-preview-group infinite>
                  <a-row :gutter="8">
                    <a-col
                      v-for="(item, ind) in showData.headImg.slice(0, 8)" :key="ind"
                      :span="6"
                    >
                      <a-image
                        fit="cover" :src="item.url"
                        width="100%" height="70px"
                        class="media-image"
                      />
                    </a-col>
                    <a-col v-if="showData.headImg.length > 8" :span="6">
                      <div class="more-images">
                        +{{ showData.headImg.length - 8 }}
                      </div>
                    </a-col>
                  </a-row>
                </a-image-preview-group>
              </a-col>

              <!-- 房间视频 -->
              <a-col v-if="showData.videoUrl?.length>0" :span="showData.headImg?.length>0 ? 8 : 24">
                <div class="media-subtitle">房间视频</div>
                <a-row :gutter="8">
                  <a-col
                    v-for="(item, ind) in showData.videoUrl.slice(0, 2)" :key="ind"
                    :span="12"
                  >
                    <div class="video-container compact">
                      <video
                        :src="item.url"
                        controls
                        preload="metadata"
                        style="width: 100%; height: 70px; object-fit: cover;"
                      >
                        您的浏览器不支持视频播放
                      </video>
                    </div>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-card>
        </div>
      </a-space>
    </a-modal>

    <!-- 编辑弹窗 -->
    <a-modal
      v-model:visible="showEditModel" :title="`编辑房屋信息 - ${editData.name}`" title-align="start"
      width="90%" :mask-closable="false"
    >
      <template #footer>
        <a-space>
          <a-button @click="cancelEdit">取消</a-button>
          <a-button type="primary" :loading="editLoading" @click="saveEdit">保存</a-button>
        </a-space>
      </template>

      <a-form :model="editForm" layout="vertical" size="medium">
        <a-row :gutter="16">
          <!-- 左列 -->
          <a-col :span="12">
            <a-space direction="vertical" size="small" fill>
              <!-- 基本信息 -->
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-home /> 基本信息
                </template>
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="房屋名称" field="name" :rules="[{ required: true, message: '请输入房屋名称' }]">
                      <a-input v-model="editForm.name" placeholder="请输入房屋名称" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="房号" field="roomNumber">
                      <a-input v-model="editForm.roomNumber" placeholder="请输入房号" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="面积(㎡)" field="area">
                      <a-input-number v-model="editForm.area" placeholder="请输入面积" :min="0" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="楼层" field="floor">
                      <a-input v-model="editForm.floor" placeholder="请输入楼层" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-form-item label="户型" field="layoutType">
                  <a-select v-model="editForm.layoutType" placeholder="请选择户型">
                    <a-option v-for="item in houseTypeOptions" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-option>
                  </a-select>
                </a-form-item>
              </a-card>

              <!-- 位置信息 -->
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-location /> 位置信息
                </template>
                <a-row :gutter="16">
                  <a-col :span="8">
                    <a-form-item label="省份" field="province">
                      <a-select
                        v-model="editForm.province"
                        placeholder="请选择省份"
                        :loading="cityCodeLoading"
                        @change="(value) => handleProvinceChange(value, true)"
                      >
                        <a-option
                          v-for="province in provinceList"
                          :key="province.id"
                          :value="province.id"
                        >
                          {{ province.name }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="城市" field="city">
                      <a-select
                        v-model="editForm.city"
                        placeholder="请选择城市"
                        :disabled="!editForm.province"
                        @change="(value) => handleCityChange(value, true)"
                      >
                        <a-option
                          v-for="city in cityList"
                          :key="city.id"
                          :value="city.id"
                        >
                          {{ city.name }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="区县" field="district">
                      <a-select
                        v-model="editForm.district"
                        placeholder="请选择区县"
                        :disabled="!editForm.city"
                      >
                        <a-option
                          v-for="district in districtList"
                          :key="district.id"
                          :value="district.id"
                        >
                          {{ district.name }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                  <a-form-item label="详细地址" field="addresInfo">
                  <a-input v-model="editForm.addresInfo" placeholder="请输入详细地址" />
                </a-form-item>
              </a-card>

              <!-- 设施配置 -->
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-settings /> 设施配置
                </template>
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="卫生间" field="toilet">
                      <a-select v-model="editForm.toilet" placeholder="请选择">
                        <a-option :value="0">没有</a-option>
                        <a-option :value="1">独立</a-option>
                        <a-option :value="2">公用</a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="厨房" field="kitchen">
                      <a-select v-model="editForm.kitchen" placeholder="请选择">
                        <a-option :value="0">没有</a-option>
                        <a-option :value="1">独立</a-option>
                        <a-option :value="2">公用</a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col :span="8">
                    <a-form-item label="阳台" field="balcony">
                      <a-select v-model="editForm.balcony" placeholder="请选择">
                        <a-option :value="0">无</a-option>
                        <a-option :value="1">有</a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="朝向" field="toward">
                      <a-select v-model="editForm.toward" placeholder="请选择">
                        <a-option :value="1">东</a-option>
                        <a-option :value="2">西</a-option>
                        <a-option :value="3">南</a-option>
                        <a-option :value="4">北</a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="状态" field="status">
                      <a-select v-model="editForm.status" placeholder="请选择">
                        <a-option :value="1">待租</a-option>
                        <a-option :value="2">已租</a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-form-item label="采光情况" field="lighting">
                  <a-textarea v-model="editForm.lighting" placeholder="请输入采光情况" :max-length="200" show-word-limit />
                </a-form-item>
              </a-card>
            </a-space>
          </a-col>

          <!-- 右列 -->
          <a-col :span="12">
            <a-space direction="vertical" size="small" fill>
              <!-- 费用信息 -->
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-safe /> 费用信息
                </template>
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="实际租金(元/月)" field="price">
                      <a-input-number v-model="editForm.price" placeholder="请输入实际租金" :min="0" :precision="2" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="对外租金(元/月)" field="fakePrice">
                      <a-input-number v-model="editForm.fakePrice" placeholder="请输入对外租金" :min="0" :precision="2" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="押金月数" field="depositNumber">
                      <a-input-number v-model="editForm.depositNumber" placeholder="请输入押金月数" :min="0" :max="12" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="每次付月数" field="priceNumber">
                      <a-input-number v-model="editForm.priceNumber" placeholder="请输入每次付月数" :min="1" :max="12" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="水费(元)" field="waterFee">
                      <a-input-number v-model="editForm.waterFee" placeholder="请输入水费" :min="0" :precision="2" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="电费(元)" field="electricityFee">
                      <a-input-number v-model="editForm.electricityFee" placeholder="请输入电费" :min="0" :precision="2" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="网费(元)" field="internetFee">
                      <a-input-number v-model="editForm.internetFee" placeholder="请输入网费" :min="0" :precision="2" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="燃气费(元)" field="fuelFee">
                      <a-input-number v-model="editForm.fuelFee" placeholder="请输入燃气费" :min="0" :precision="2" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-card>

              <!-- 其他信息 -->
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-info-circle /> 其他信息
                </template>
                <a-form-item label="备注信息" field="note">
                  <a-textarea v-model="editForm.note" placeholder="请输入备注信息" :max-length="500" show-word-limit />
                </a-form-item>
              </a-card>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!-- 新增房屋弹窗 -->
    <a-modal
      v-model:visible="showAddModel" title="新增房屋信息" title-align="start"
      width="90%" :mask-closable="false"
    >
      <template #footer>
        <a-space>
          <a-button @click="cancelAdd">取消</a-button>
          <a-button type="primary" :loading="addLoading" @click="saveAdd">保存</a-button>
        </a-space>
      </template>

      <a-form :model="addForm" layout="vertical" size="medium">
        <a-row :gutter="16">
          <!-- 左列 -->
          <a-col :span="12">
            <a-space direction="vertical" size="small" fill>
              <!-- 基本信息 -->
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-home /> 基本信息
                </template>
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="房屋名称" field="name" :rules="[{ required: true, message: '请输入房屋名称' }]">
                      <a-input v-model="addForm.name" placeholder="请输入房屋名称" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="房号" field="roomNumber">
                      <a-input v-model="addForm.roomNumber" placeholder="请输入房号" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="面积(㎡)" field="area">
                      <a-input-number v-model="addForm.area" placeholder="请输入面积" :min="0" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="楼层" field="floor">
                      <a-input v-model="addForm.floor" placeholder="请输入楼层" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-form-item label="户型" field="layoutType">
                  <a-select v-model="addForm.layoutType" placeholder="请选择户型">
                    <a-option v-for="item in houseTypeOptions" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </a-option>
                  </a-select>
                </a-form-item>
              </a-card>

              <!-- 位置信息 -->
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-location /> 位置信息
                </template>
                <a-row :gutter="16">
                  <a-col :span="8">
                    <a-form-item label="省份" field="province">
                      <a-select
                        v-model="addForm.province"
                        placeholder="请选择省份"
                        :loading="cityCodeLoading"
                        @change="handleProvinceChange"
                      >
                        <a-option
                          v-for="province in provinceList"
                          :key="province.id"
                          :value="province.id"
                        >
                          {{ province.name }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="城市" field="city">
                      <a-select
                        v-model="addForm.city"
                        placeholder="请选择城市"
                        :disabled="!addForm.province"
                        @change="handleCityChange"
                      >
                        <a-option
                          v-for="city in cityList"
                          :key="city.id"
                          :value="city.id"
                        >
                          {{ city.name }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="区县" field="district">
                      <a-select
                        v-model="addForm.district"
                        placeholder="请选择区县"
                        :disabled="!addForm.city"
                      >
                        <a-option
                          v-for="district in districtList"
                          :key="district.id"
                          :value="district.id"
                        >
                          {{ district.name }}
                        </a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-form-item label="详细地址" field="addresInfo">
                  <a-input v-model="addForm.addresInfo" placeholder="请输入详细地址" />
                </a-form-item>
              </a-card>

              <!-- 设施配置 -->
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-settings /> 设施配置
                </template>
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="卫生间" field="toilet">
                      <a-select v-model="addForm.toilet" placeholder="请选择">
                        <a-option :value="0">没有</a-option>
                        <a-option :value="1">独立</a-option>
                        <a-option :value="2">公用</a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="厨房" field="kitchen">
                      <a-select v-model="addForm.kitchen" placeholder="请选择">
                        <a-option :value="0">没有</a-option>
                        <a-option :value="1">独立</a-option>
                        <a-option :value="2">公用</a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col :span="8">
                    <a-form-item label="阳台" field="balcony">
                      <a-select v-model="addForm.balcony" placeholder="请选择">
                        <a-option :value="0">无</a-option>
                        <a-option :value="1">有</a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="朝向" field="toward">
                      <a-select v-model="addForm.toward" placeholder="请选择">
                        <a-option :value="1">东</a-option>
                        <a-option :value="2">西</a-option>
                        <a-option :value="3">南</a-option>
                        <a-option :value="4">北</a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="状态" field="status">
                      <a-select v-model="addForm.status" placeholder="请选择">
                        <a-option :value="1">待租</a-option>
                        <a-option :value="2">已租</a-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-form-item label="采光情况" field="lighting">
                  <a-textarea v-model="addForm.lighting" placeholder="请输入采光情况" :max-length="200" show-word-limit />
                </a-form-item>
              </a-card>
            </a-space>
          </a-col>

          <!-- 右列 -->
          <a-col :span="12">
            <a-space direction="vertical" size="small" fill>
              <!-- 费用信息 -->
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-safe /> 费用信息
                </template>
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="实际租金(元/月)" field="price">
                      <a-input-number v-model="addForm.price" placeholder="请输入实际租金" :min="0" :precision="2" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="对外租金(元/月)" field="fakePrice">
                      <a-input-number v-model="addForm.fakePrice" placeholder="请输入对外租金" :min="0" :precision="2" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="押金月数" field="depositNumber">
                      <a-input-number v-model="addForm.depositNumber" placeholder="请输入押金月数" :min="0" :max="12" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="每次付月数" field="priceNumber">
                      <a-input-number v-model="addForm.priceNumber" placeholder="请输入每次付月数" :min="1" :max="12" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="水费(元)" field="waterFee">
                      <a-input-number v-model="addForm.waterFee" placeholder="请输入水费" :min="0" :precision="2" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="电费(元)" field="electricityFee">
                      <a-input-number v-model="addForm.electricityFee" placeholder="请输入电费" :min="0" :precision="2" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="网费(元)" field="internetFee">
                      <a-input-number v-model="addForm.internetFee" placeholder="请输入网费" :min="0" :precision="2" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="燃气费(元)" field="fuelFee">
                      <a-input-number v-model="addForm.fuelFee" placeholder="请输入燃气费" :min="0" :precision="2" style="width: 100%" />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-card>

              <!-- 其他信息 -->
              <a-card :bordered="false" class="info-section compact">
                <template #title>
                  <icon-info-circle /> 其他信息
                </template>
                <a-form-item label="备注信息" field="note">
                  <a-textarea v-model="addForm.note" placeholder="请输入备注信息" :max-length="500" show-word-limit />
                </a-form-item>
              </a-card>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!-- 租客入住登记弹窗 -->
    <a-modal
      v-model:visible="showCheckinModel"
      :title="`租客入住登记 - ${checkinData.houseName}`"
      title-align="start"
      width="800px"
      :mask-closable="false"
    >
      <template #footer>
        <a-space>
          <a-button @click="cancelCheckin">取消</a-button>
          <a-button type="primary" :loading="checkinLoading" @click="saveCheckin">提交登记</a-button>
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
                  :rules="[
                    { required: true, message: '请输入身份证号码' },
                    {
                      validator: (value, callback) => {
                        const idCardReg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
                        if (!idCardReg.test(value)) {
                          callback('请输入正确的身份证号码')
                        } else {
                          callback()
                        }
                      }
                    }
                  ]"
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
                  :rules="[
                    { required: true, message: '请输入手机号码' },
                    {
                      validator: (value, callback) => {
                        const phoneReg = /^1[3-9]\d{9}$/
                        if (!phoneReg.test(value)) {
                          callback('请输入正确的手机号码')
                        } else {
                          callback()
                        }
                      }
                    }
                  ]"
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
                  :rules="[
                    { required: true, message: '请选择月结日' },
                    {
                      validator: (value, callback) => {
                        const validDays = [1, 15, 20];
                        if (!validDays.includes(value)) {
                          callback('月结日只能是1日、15日或20日');
                        } else {
                          callback();
                        }
                      }
                    }
                  ]"
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

    <!-- 租客详情弹窗 -->
    <a-modal
      v-model:visible="showTenantDetailModel"
      title=""
      title-align="start"
      width="900px"
      :mask-closable="false"
      class="tenant-detail-modal"
    >
      <template #footer>
        <a-space>
          <a-button @click="closeTenantDetail">关闭</a-button>
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
            <span class="summary-value primary">¥{{ formatAmount(calculateMonthlyTotal()) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">入住时长</span>
            <span class="summary-value">{{ calculateStayDuration() }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">合同剩余天数</span>
            <span class="summary-value">{{ calculateRemainingDays() }}天</span>
          </div>
        </div>
      </div>
    </a-modal>

  </div>

    <!-- 水电录入弹窗组件 -->
    <UtilityModal
      :visible="showUtilityModal"
      :house="selectedHouse"
      @update:visible="showUtilityModal = $event"
      @success="handleUtilitySuccess"
    />

    <!-- 批量水电录入弹窗组件 -->
    <BatchUtilityModal
      :visible="showBatchUtilityModal"
      :houses="houseList"
      @update:visible="showBatchUtilityModal = $event"
      @success="handleBatchUtilitySuccess"
    />

    <!-- 收款管理弹窗组件 -->
    <PaymentModal
      :visible="showPaymentModal"
      :house="selectedHouse"
      @update:visible="showPaymentModal = $event"
      @success="handlePaymentSuccess"
    />

    <!-- 收支详情弹窗组件 -->
    <IncomeExpenseModal
      :visible="showIncomeExpenseModal"
      :houses="houseList"
      @update:visible="showIncomeExpenseModal = $event"
    />

  </template>
<script lang="ts" setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import useStore from '@/stores/index';
import { storeToRefs } from 'pinia'
import { Message } from '@arco-design/web-vue';
import {
  getHouseList,
  updateHouse,
  createHouse,
  getCityCode
} from '@/api/house';
import {
  leaseRegister,
  uploadFile,
  getTenantDetailByHouseId
} from '@/api/lease';
import UtilityModal from '@/components/utility/UtilityModal.vue';
import BatchUtilityModal from '@/components/utility/BatchUtilityModal.vue';
import PaymentModal from '@/components/utility/PaymentModal.vue';
import IncomeExpenseModal from '@/components/utility/IncomeExpenseModal.vue';

const store = storeToRefs(useStore());

const tableColumns: object[] = reactive([
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '所在地区',
    align: 'center',
    dataIndex: 'location',
  },
  {
    title: '户型',
    align: 'center',
    dataIndex: 'layoutTypeText',
  },
  {
    title: '面积',
    align: 'center',
    dataIndex: 'areaText',
  },
  {
    title: '租金',
    align: 'center',
    dataIndex: 'priceText',
  },
  {
    title: '状态',
    align: 'center',
    slotName: 'status',
    dataIndex: 'status'
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
]);

const searchData = reactive({
  name: '',
  address: '',
  status: '',
  starTime: '',
  endTime: '',
  size: 10,
  index: 1
});

const houseTypeOptions = [
  { label: '单间', value: 1 },
  { label: '一房一厅', value: 2 },
  { label: '两房一厅', value: 3 },
  { label: '三房一厅', value: 4 },
  { label: '四房一厅', value: 5 },
  { label: '四房两厅', value: 6 }
];

let houseList = reactive<any[]>([]);
const tableLoading = ref(false);

// 省市区数据状态管理
const provinceList = ref<any[]>([]);
const cityList = ref<any[]>([]);
const districtList = ref<any[]>([]);
const cityCodeLoading = ref(false);

// 视图模式状态管理
const viewMode = ref<'table' | 'card'>('card');

// 获取户型标签
const getHouseTypeLabel = (value: number) => {
  const option = houseTypeOptions.find(item => item.value === value);
  return option ? option.label : '未知';
};

// 获取卫生间/厨房配置标签
const getFacilityLabel = (value: number, type: 'toilet' | 'kitchen') => {
  if (value === 0) return '没有';
  if (value === 1) return '独立';
  if (value === 2) return '公用';
  return '未知';
};

// 获取朝向标签
const getTowardLabel = (value: number) => {
  const directionMap: { [key: number]: string } = {
    1: '东',
    2: '西',
    3: '南',
    4: '北'
  };
  return directionMap[value] || '未知';
};

// 获取阳台标签
const getBalconyLabel = (value: number) => {
  return value === 1 ? '有' : '无';
};


// 格式化金额，保留2位小数
const formatAmount = (value: any) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  const num = parseFloat(value);
  return isNaN(num) ? '-' : num.toFixed(2);
};

// 计算属性：获取状态信息
const getStatusInfo = (status: number) => {
  return statusOption.find(item => item.value === status) || { label: '未知', color: '' };
};


// 防抖变量和请求计数器
let isLoading = false;
let requestCount = 0;
let lastRequestTime = 0;

const getHouseListFun = () => {
  const now = Date.now();

  // 防抖：500ms内只允许一次请求
  if (isLoading || (now - lastRequestTime) < 500) {
    console.log('防抖拦截请求，距离上次请求:', now - lastRequestTime, 'ms');
    return;
  }

  if (requestCount > 10) {
    console.error('请求次数过多，停止请求');
    return;
  }

  requestCount++;
  lastRequestTime = now;
  isLoading = true;
  tableLoading.value = true;

  console.log('发送房屋列表请求 #', requestCount, searchData);

  getHouseList(searchData)
    .then(({ status, data, count }) => {
      if (status === 1) {
        pagination.total = count || 0;

        // 处理数据，为每个房屋添加格式化字段
        const processedData = (data || []).map(item => {
          // 获取户型标签
          const getHouseTypeLabel = (value: number) => {
            const houseTypeOptions = [
              { label: '单间', value: 1 },
              { label: '一房一厅', value: 2 },
              { label: '两房一厅', value: 3 },
              { label: '三房一厅', value: 4 },
              { label: '四房一厅', value: 5 },
              { label: '四房两厅', value: 6 }
            ];
            const option = houseTypeOptions.find(item => item.value === value);
            return option ? option.label : '未知';
          };

          return {
            ...item,
            location: `${item.provinceName || ''} ${item.cityName || ''} ${item.areaName || ''}`.trim(),
            layoutTypeText: getHouseTypeLabel(item.layoutType),
            areaText: item.area ? `${item.area}㎡` : '-',
            priceText: item.price ? `¥${parseFloat(item.price).toLocaleString()}/月` : '-'
          };
        });

        houseList.splice(0, houseList.length, ...processedData);
        console.log('房屋列表请求成功，数据条数:', processedData?.length || 0);
        // 成功获取数据后重置计数器
        requestCount = 0;
      } else {
        console.error('房屋列表请求失败，状态:', status);
      }
    })
    .catch((error) => {
      console.error('获取房屋列表失败:', error);
    })
    .finally(() => {
      tableLoading.value = false;
      isLoading = false;
    });
};

// 组件挂载时初始化数据
onMounted(() => {
  // 延迟一点时间再初始化，确保组件完全挂载
  setTimeout(() => {
    getHouseListFun();
    loadProvinceData(); // 加载省份数据
  }, 100);
});

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
};

const datePickerChange = (value: any) => {
  if (value) {
    searchData.starTime = value[0];
    searchData.endTime = value[1];
  } else {
    searchData.starTime = '';
    searchData.endTime = '';
  }
  searchList();
};

let showInfoModel = ref(false);
let showData: any = reactive({});

// 编辑相关状态
let showEditModel = ref(false);
let editLoading = ref(false);
let editData: any = reactive({});
let editForm: any = reactive({});

// 新增相关状态
let showAddModel = ref(false);
let addLoading = ref(false);
let addData: any = reactive({});
let addForm: any = reactive({});

// 租客入住登记相关状态
let showCheckinModel = ref(false);
let checkinLoading = ref(false);
let checkinData: any = reactive({});
let checkinForm: any = reactive({});

// 租客详情相关状态
let showTenantDetailModel = ref(false);
let tenantDetailData: any = reactive({});

// 水电录入弹窗状态
const showUtilityModal = ref(false);
const selectedHouse = ref(null);

// 批量水电录入弹窗状态
const showBatchUtilityModal = ref(false);

// 收款管理弹窗状态
const showPaymentModal = ref(false);

// 收支详情弹窗状态
const showIncomeExpenseModal = ref(false);

// 月结日选项
const paymentDayOptions = [
  { label: '1日', value: 1 },
  { label: '15日', value: 15 },
  { label: '20日', value: 20 }
];


const showInfo = (data: any) => {
  showData.name = data.name;

  // 基本信息
  showData.basicInfo = [
    {
      label: '房屋名称：',
      value: data.name,
    },
    {
      label: '房号：',
      value: data.roomNumber,
    },
    {
      label: '所在地区：',
      value: `${data.provinceName || ''} ${data.cityName || ''} ${data.areaName || ''}`.trim(),
    },
    {
      label: '面积：',
      value: data.area ? `${data.area}㎡` : null,
    },
    {
      label: '楼层：',
      value: data.floor,
    },
    {
      label: '户型：',
      value: data.layoutType,
    },
  ];

  // 位置信息
  showData.locationInfo = [
    {
      label: '详细地址：',
      value: data.addresInfo,
    },
  ];


  // 费用信息
  showData.costInfo = [
    {
      label: '实际租金：',
      value: formatAmount(data.price),
    },
    {
      label: '对外租金：',
      value: formatAmount(data.fakePrice),
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
      label: '水费：',
      value: formatAmount(data.waterFee),
    },
    {
      label: '电费：',
      value: formatAmount(data.electricityFee),
    },
    {
      label: '网费：',
      value: formatAmount(data.internetFee),
    },
    {
      label: '燃气费：',
      value: formatAmount(data.fuelFee),
    },
  ];

  // 设施配置
  showData.facilityInfo = [
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
      label: '朝向：',
      value: data.toward,
    },
    {
      label: '采光情况：',
      value: data.lighting,
    },
  ];

  // 其他信息
  showData.otherInfo = [
    {
      label: '备注信息：',
      value: data.note,
    },
    {
      label: '创建时间：',
      value: data.createdAt,
    },
    {
      label: '更新时间：',
      value: data.updatedAt,
    },
  ];

  // 处理图片数据：支持字符串、JSON字符串、数组等多种格式
  if (data.headImg) {
    try {
      if (typeof data.headImg === 'string') {
        // 尝试解析JSON字符串
        const parsed = JSON.parse(data.headImg);
        showData.headImg = Array.isArray(parsed) ? parsed : [parsed];
      } else if (Array.isArray(data.headImg)) {
        // 已经是数组
        showData.headImg = data.headImg;
      } else {
        // 其他情况转为数组
        showData.headImg = [data.headImg];
      }
    } catch (e) {
      // JSON解析失败，当作单个图片路径处理
      if (typeof data.headImg === 'string') {
        showData.headImg = [{ url: data.headImg }];
      } else {
        showData.headImg = [{ url: String(data.headImg) }];
      }
    }
  } else {
    showData.headImg = [];
  }

  // 处理视频数据：支持字符串、JSON字符串、数组等多种格式
  if (data.videoUrl) {
    try {
      if (typeof data.videoUrl === 'string') {
        // 尝试解析JSON字符串
        const parsed = JSON.parse(data.videoUrl);
        showData.videoUrl = Array.isArray(parsed) ? parsed : [parsed];
      } else if (Array.isArray(data.videoUrl)) {
        // 已经是数组
        showData.videoUrl = data.videoUrl;
      } else {
        // 其他情况转为数组
        showData.videoUrl = [data.videoUrl];
      }
    } catch (e) {
      // JSON解析失败，当作单个视频路径处理
      if (typeof data.videoUrl === 'string') {
        showData.videoUrl = [{ url: data.videoUrl }];
      } else {
        showData.videoUrl = [{ url: String(data.videoUrl) }];
      }
    }
  } else {
    showData.videoUrl = [];
  }

  
  showData.tenantsUsers = (data.tenantsUsers || []).map((item: any) => {
    item.joinTime = item.houseLinkTenant?.createdAt;
    item.joinStatus = item.houseLinkTenant?.status;
    return item;
  });

  showInfoModel.value = true;
};


// 显示编辑弹窗
const showEdit = (data: any) => {
  // 深拷贝数据到编辑对象
  editData.id = data.id;
  editData.name = data.name;

  // 初始化编辑表单数据
  Object.keys(editForm).forEach(key => delete editForm[key]);

  // 清空省市区选择器数据
  cityList.value = [];
  districtList.value = [];

  // 立即显示弹窗
  showEditModel.value = true;

  // 在下一个 tick 中设置表单数据
  nextTick(() => {
    // 设置基本表单数据
    editForm.id = data.id;
    editForm.name = data.name || '';
    editForm.roomNumber = data.roomNumber || '';
    editForm.area = data.area ? Number(data.area) : null;
    editForm.floor = data.floor ? String(data.floor) : '';
    editForm.layoutType = data.layoutType ? Number(data.layoutType) : null;

    // 设置省市区数据（使用ID）
    editForm.province = data.provinceId ? String(data.provinceId) : '';
    editForm.city = data.cityId ? String(data.cityId) : '';
    editForm.district = data.areaId ? String(data.areaId) : '';

    // 省市区数据回显逻辑 - 智能匹配
    if (data.provinceName) {
      let actualProvinceId = data.provinceId ? String(data.provinceId) : '';
      let actualCityId = data.cityId ? String(data.cityId) : '';
      let actualDistrictId = data.areaId ? String(data.areaId) : '';

      // 尝试通过ID加载城市数据
      const cityLoaded = loadCityData(actualProvinceId, data.provinceName);

      if (cityLoaded && data.cityName) {
        // 城市数据加载成功，尝试加载区县数据
        setTimeout(() => {
          const districtLoaded = loadDistrictData(actualCityId, data.cityName);

          if (districtLoaded) {
            // 所有数据都加载成功，使用实际ID设置表单
            editForm.province = actualProvinceId;
            editForm.city = actualCityId;
            editForm.district = actualDistrictId;
          }
        }, 100);
      } else {
        // 如果通过ID无法加载，说明需要通过名称匹配找到正确的ID
        setTimeout(() => {
          // 通过名称查找正确的省份ID
          const matchedProvince = provinceList.value.find(p => p.name === data.provinceName);
          if (matchedProvince) {
            editForm.province = matchedProvince.id;

            // 重新加载城市数据
            loadCityData(matchedProvince.id);

            // 通过名称查找正确的城市ID
            if (data.cityName) {
              setTimeout(() => {
                const matchedCity = cityList.value.find(c => c.name === data.cityName);
                if (matchedCity) {
                  editForm.city = matchedCity.id;

                  // 重新加载区县数据
                  loadDistrictData(matchedCity.id);

                  // 通过名称查找正确的区县ID
                  if (data.areaName) {
                    setTimeout(() => {
                      const matchedDistrict = districtList.value.find(d => d.name === data.areaName);
                      if (matchedDistrict) {
                        editForm.district = matchedDistrict.id;
                      }
                    }, 100);
                  }
                }
              }, 100);
            }
          }
        }, 100);
      }
    }

    editForm.addresInfo = data.addresInfo || '';
    editForm.toilet = data.toilet !== undefined ? Number(data.toilet) : null;
    editForm.kitchen = data.kitchen !== undefined ? Number(data.kitchen) : null;
    editForm.balcony = data.balcony !== undefined ? Number(data.balcony) : null;
    editForm.toward = data.toward !== undefined ? Number(data.toward) : null;
    editForm.lighting = data.lighting || '';
    editForm.status = data.status ? Number(data.status) : 1;
    editForm.price = data.price ? Number(data.price) : null;
    editForm.fakePrice = data.fakePrice ? Number(data.fakePrice) : null;
    editForm.depositNumber = data.depositNumber ? Number(data.depositNumber) : null;
    editForm.priceNumber = data.priceNumber ? Number(data.priceNumber) : null;
    editForm.waterFee = data.waterFee ? Number(data.waterFee) : null;
    editForm.electricityFee = data.electricityFee ? Number(data.electricityFee) : null;
    editForm.internetFee = data.internetFee ? Number(data.internetFee) : null;
    editForm.fuelFee = data.fuelFee ? Number(data.fuelFee) : null;
    editForm.note = data.note || '';
  });
};

// 取消编辑
const cancelEdit = () => {
  showEditModel.value = false;
  editLoading.value = false;
};

// 保存编辑
const saveEdit = async () => {
  try {
    editLoading.value = true;

    // 根据API文档要求构建请求参数
    const requestData = {
      // 必填字段
      id: editForm.id,

      // 基本信息
      name: editForm.name,
      addresInfo: editForm.addresInfo,
      area: editForm.area ? String(editForm.area) : '',
      roomNumber: editForm.roomNumber,
      note: editForm.note || '',

      // 省市区信息
      provinceId: editForm.province ? Number(editForm.province) : null,
      cityId: editForm.city ? Number(editForm.city) : null,
      areaId: editForm.district ? Number(editForm.district) : null,

      // 租金信息
      price: editForm.price ? Number(editForm.price) : 0,
      fakePrice: editForm.fakePrice ? Number(editForm.fakePrice) : 0,
      depositNumber: editForm.depositNumber ? Number(editForm.depositNumber) : 0,
      priceNumber: editForm.priceNumber ? Number(editForm.priceNumber) : 1,

      // 房屋属性
      floor: editForm.floor ? Number(editForm.floor) : 0,
      toward: editForm.toward ? Number(editForm.toward) : 1,
      layoutType: editForm.layoutType ? Number(editForm.layoutType) : 1,
      toilet: editForm.toilet !== null && editForm.toilet !== undefined ? Number(editForm.toilet) : 0,
      kitchen: editForm.kitchen !== null && editForm.kitchen !== undefined ? Number(editForm.kitchen) : 0,
      balcony: editForm.balcony !== null && editForm.balcony !== undefined ? Number(editForm.balcony) : 0,

      // 配套费用
      waterFee: editForm.waterFee ? Number(editForm.waterFee) : 0,
      electricityFee: editForm.electricityFee ? Number(editForm.electricityFee) : 0,
      internetFee: editForm.internetFee ? Number(editForm.internetFee) : 0,
      fuelFee: editForm.fuelFee ? Number(editForm.fuelFee) : 0,

      // 其他信息
      lighting: editForm.lighting || '',
      headImg: [], // 图片数组，暂时为空
      videoUrl: '', // 视频URL，暂时为空
    };

    // 调用API更新房屋信息
    const response = await updateHouse(requestData);

    if (response.status === 1) {
      // 更新成功
      Message.success({
        content: '房屋信息更新成功',
        duration: 3000
      });

      showEditModel.value = false;
      getHouseListFun(); // 刷新列表
    } else {
      // 更新失败
      Message.error({
        content: response.message || '房屋信息更新失败',
        duration: 5000
      });
    }

  } catch (error: any) {
    console.error('更新房屋信息失败:', error);

    // 根据错误类型显示不同的错误信息
    let errorMessage = '房屋信息更新失败';

    if (error.response) {
      // 服务器响应错误
      const status = error.response.status;
      if (status === 401) {
        errorMessage = '未授权，请重新登录';
      } else if (status === 403) {
        errorMessage = '权限不足，无法修改此房屋信息';
      } else if (status === 404) {
        errorMessage = '房屋信息不存在';
      } else if (status === 422) {
        errorMessage = '数据验证失败，请检查输入信息';
      } else if (status >= 500) {
        errorMessage = '服务器错误，请稍后重试';
      }
    } else if (error.request) {
      // 网络错误
      errorMessage = '网络连接失败，请检查网络设置';
    } else {
      // 其他错误
      errorMessage = error.message || '未知错误';
    }

    Message.error({
      content: errorMessage,
      duration: 5000
    });

  } finally {
    editLoading.value = false;
  }
};

// 显示新增弹窗
const showAddModal = () => {
  // 初始化新增表单数据
  Object.keys(addForm).forEach(key => delete addForm[key]);

  addForm.name = '';
  addForm.roomNumber = '';
  addForm.area = null;
  addForm.floor = '';
  addForm.layoutType = null;
  addForm.province = '';
  addForm.city = '';
  addForm.district = '';
  addForm.addresInfo = '';
  addForm.toilet = 0;
  addForm.kitchen = 0;
  addForm.balcony = 0;
  addForm.toward = 1;
  addForm.lighting = '';
  addForm.status = 1;
  addForm.price = null;
  addForm.fakePrice = null;
  addForm.depositNumber = null;
  addForm.priceNumber = 1;
  addForm.waterFee = null;
  addForm.electricityFee = null;
  addForm.internetFee = null;
  addForm.fuelFee = null;
  addForm.note = '';

  // 清空省市区选择器数据
  cityList.value = [];
  districtList.value = [];

  showAddModel.value = true;
};

// 显示收支详情弹窗
const openIncomeExpenseModal = () => {
  showIncomeExpenseModal.value = true;
};

// 取消新增
const cancelAdd = () => {
  showAddModel.value = false;
  addLoading.value = false;
};

// 保存新增
const saveAdd = async () => {
  try {
    addLoading.value = true;

    // 验证必填字段
    if (!addForm.name || addForm.name.trim() === '') {
      Message.error({
        content: '请输入房屋名称',
        duration: 3000
      });
      return;
    }

  
    // 根据API文档要求构建请求参数
    const requestData = {
      // 必填字段
      name: addForm.name.trim(),
      parentId: 0, // 根级房屋

      // 基本信息（可选）
      addresInfo: addForm.addresInfo || '',
      area: addForm.area ? String(addForm.area) : '',
      roomNumber: addForm.roomNumber || '',
      note: addForm.note || '',

      // 省市区信息（可选）
      provinceId: addForm.province ? Number(addForm.province) : null,
      cityId: addForm.city ? Number(addForm.city) : null,
      areaId: addForm.district ? Number(addForm.district) : null,

      // 租金信息（可选，默认为0）
      price: addForm.price ? Number(addForm.price) : 0,
      fakePrice: addForm.fakePrice ? Number(addForm.fakePrice) : 0,
      depositNumber: addForm.depositNumber ? Number(addForm.depositNumber) : 0,
      priceNumber: addForm.priceNumber ? Number(addForm.priceNumber) : 1,

      // 房屋属性（可选）
      floor: addForm.floor ? Number(addForm.floor) : 0,
      toward: addForm.toward ? Number(addForm.toward) : 1,
      layoutType: addForm.layoutType ? Number(addForm.layoutType) : 1,
      toilet: addForm.toilet !== null && addForm.toilet !== undefined ? Number(addForm.toilet) : 0,
      kitchen: addForm.kitchen !== null && addForm.kitchen !== undefined ? Number(addForm.kitchen) : 0,
      balcony: addForm.balcony !== null && addForm.balcony !== undefined ? Number(addForm.balcony) : 0,

      // 配套费用（可选，默认为0）
      waterFee: addForm.waterFee ? Number(addForm.waterFee) : 0,
      electricityFee: addForm.electricityFee ? Number(addForm.electricityFee) : 0,
      internetFee: addForm.internetFee ? Number(addForm.internetFee) : 0,
      fuelFee: addForm.fuelFee ? Number(addForm.fuelFee) : 0,

      // 多媒体信息（可选）
      headImg: [], // 图片数组，暂时为空
      videoUrl: '', // 视频URL，暂时为空
      lighting: addForm.lighting || '',
    };

    // 调用API创建房屋
    const response = await createHouse(requestData);

    if (response.status === 1) {
      // 创建成功
      const newHouseId = response.data;

      Message.success({
        content: '房屋添加成功',
        duration: 3000
      });

      showAddModel.value = false;

      // 刷新房屋列表以获取最新数据
      getHouseListFun();

    } else {
      // 创建失败
      Message.error({
        content: response.message || '房屋添加失败',
        duration: 5000
      });
    }

  } catch (error: any) {
    console.error('添加房屋失败:', error);

    // 根据错误类型显示不同的错误信息
    let errorMessage = '房屋添加失败';

    if (error.response) {
      // 服务器响应错误
      const status = error.response.status;
      if (status === 401) {
        errorMessage = '未授权，请重新登录';
      } else if (status === 403) {
        errorMessage = '权限不足，无法添加房屋';
      } else if (status === 422) {
        errorMessage = '数据验证失败，请检查输入信息';
      } else if (status >= 500) {
        errorMessage = '服务器错误，请稍后重试';
      }
    } else if (error.request) {
      // 网络错误
      errorMessage = '网络连接失败，请检查网络设置';
    } else {
      // 其他错误
      errorMessage = error.message || '未知错误';
    }

    Message.error({
      content: errorMessage,
      duration: 5000
    });

  } finally {
    addLoading.value = false;
  }
};

// 省市区数据处理函数
const loadProvinceData = async () => {
  try {
    cityCodeLoading.value = true;
    const response = await getCityCode();
    if (response.status === 1) {
      provinceList.value = response.data || [];
    } else {
      Message.error(response.message || '获取省份数据失败');
    }
  } catch (error) {
    console.error('获取省份数据失败:', error);
    Message.error('获取省份数据失败');
  } finally {
    cityCodeLoading.value = false;
  }
};

const loadCityData = (provinceId: string, provinceName?: string) => {
  let province = provinceList.value.find(item => item.id === provinceId);

  // 如果通过ID没找到，尝试通过名称查找
  if (!province && provinceName) {
    province = provinceList.value.find(item => item.name === provinceName);
  }

  if (province && province.child) {
    cityList.value = province.child;
    districtList.value = []; // 清空区县列表
    return true; // 返回成功标志
  } else {
    cityList.value = [];
    districtList.value = [];
    return false; // 返回失败标志
  }
};

const loadDistrictData = (cityId: string, cityName?: string) => {
  let city = cityList.value.find(item => item.id === cityId);

  // 如果通过ID没找到，尝试通过名称查找
  if (!city && cityName) {
    city = cityList.value.find(item => item.name === cityName);
  }

  if (city && city.child) {
    districtList.value = city.child;
    return true; // 返回成功标志
  } else {
    districtList.value = [];
    return false; // 返回失败标志
  }
};

// 省份选择变化处理
const handleProvinceChange = (value: string, isEdit = false) => {
  if (isEdit) {
    editForm.city = '';
    editForm.district = '';
  } else {
    addForm.city = '';
    addForm.district = '';
  }
  loadCityData(value);
};

// 城市选择变化处理
const handleCityChange = (value: string, isEdit = false) => {
  if (isEdit) {
    editForm.district = '';
  } else {
    addForm.district = '';
  }
  loadDistrictData(value);
};

// 打开视频
const openVideo = (url: string) => {
  window.open(url, '_blank');
};

// 显示租客入住登记弹窗
const showCheckinModal = (house: any) => {
  // 重置表单数据
  Object.keys(checkinForm).forEach(key => delete checkinForm[key]);

  // 设置房屋信息
  checkinData.houseId = house.id;
  checkinData.houseName = house.name;

  // 初始化租客信息表单
  checkinForm.tenantName = '';
  checkinForm.idCard = '';
  checkinForm.phoneNumber = '';
  checkinForm.idPhoto = [];

  // 初始化租赁信息表单（保持原有字段名，在提交时映射到API字段）
  checkinForm.contractStartDate = '';
  checkinForm.contractEndDate = '';
  checkinForm.paymentDay = null;
  checkinForm.rentPrice = null;
  checkinForm.houseDeposit = null;
  checkinForm.otherDeposit = null;
  checkinForm.managementFee = null;
  checkinForm.internetFee = null;
  checkinForm.waterMeterReading = null;
  checkinForm.electricMeterReading = null;
  checkinForm.notes = '';

  showCheckinModel.value = true;
};

// 取消租客入住登记
const cancelCheckin = () => {
  showCheckinModel.value = false;
  checkinLoading.value = false;
  // 重置表单
  Object.keys(checkinForm).forEach(key => delete checkinForm[key]);
};

// 文件上传前的验证
const handleBeforeUpload = (file: any) => {
  // 检查文件类型
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    Message.error('只能上传图片文件（jpg、png格式）');
    return false;
  }

  // 检查文件大小（2MB）
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    Message.error('图片大小不能超过2MB');
    return false;
  }

  return true;
};

// 文件选择变化处理
const handleFileChange = async (fileList: any[], file: any) => {
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

// 上传身份照片到服务器
const uploadIdCardImage = async (file: any): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'id_card');

    const response = await uploadFile(formData);

    if (response.status === 1) {
      return response.data.url;
    } else {
      Message.error(response.message || '照片上传失败');
      return null;
    }
  } catch (error: any) {
    console.error('上传身份照片失败:', error);
    Message.error('照片上传失败，请检查网络连接');
    return null;
  }
};

// 显示租客详情弹窗
const showTenantDetailModal = async (house: any) => {
  try {
    // 重置租客详情数据
    Object.keys(tenantDetailData).forEach(key => delete tenantDetailData[key]);

    // 设置房屋基本信息
    tenantDetailData.houseId = house.id;
    tenantDetailData.houseName = house.name;

    // 调用API获取租客详情数据
    const response = await getTenantDetailByHouseId(house.id);

    if (response.status === 1 && response.data && Array.isArray(response.data) && response.data.length > 0) {
      // 查找生效中的合同（status === 1），如果有多个，取最新的
      const activeContracts = response.data.filter(contract => contract.status === 1);

      if (activeContracts.length === 0) {
        Message.warning('该房屋暂无生效中的租赁合同');
        return;
      }

      // 按创建时间降序排序，取最新的合同
      const latestContract = activeContracts.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

      // 提取租客信息
      if (latestContract.tenant) {
        tenantDetailData.tenantName = latestContract.tenant.realName || '';
        tenantDetailData.phoneNumber = latestContract.tenant.phone || '';
        tenantDetailData.idCardNumber = latestContract.tenant.idCardNumber || '';
        tenantDetailData.idCardImage = ''; // 租客头像需要单独处理
        tenantDetailData.joinTime = latestContract.createdAt || '';
      }

      // 设置租赁信息
      tenantDetailData.leaseStartDate = latestContract.leaseStartDate || '';
      tenantDetailData.leaseEndDate = latestContract.leaseEndDate || '';
      tenantDetailData.monthlyPaymentDay = latestContract.monthlyPaymentDay || 1;
      tenantDetailData.rentPrice = latestContract.rentPrice || 0;
      tenantDetailData.houseDeposit = latestContract.houseDeposit || 0;
      tenantDetailData.otherDeposit = latestContract.otherDeposit || 0;
      tenantDetailData.propertyFee = latestContract.propertyFee || 0;
      tenantDetailData.internetFee = latestContract.internetFee || 0;
      tenantDetailData.waterMeterReading = latestContract.waterMeterReading || 0;
      tenantDetailData.electricityMeterReading = latestContract.electricityMeterReading || 0;
      tenantDetailData.remark = latestContract.remark || '';
    } else {
      // 如果API调用失败或没有数据，显示提示
      Message.warning('该房屋暂无租客信息');
      return;
    }

    showTenantDetailModel.value = true;
  } catch (error) {
    console.error('获取租客详情失败:', error);
    Message.error('获取租客详情失败，请稍后重试');
  }
};

// 关闭租客详情弹窗
const closeTenantDetail = () => {
  showTenantDetailModel.value = false;
  // 重置数据
  Object.keys(tenantDetailData).forEach(key => delete tenantDetailData[key]);
};

// 显示水电录入弹窗
const handleShowUtilityModal = (house: any) => {
  selectedHouse.value = house;
  showUtilityModal.value = true;
};

// 处理水电录入成功
const handleUtilitySuccess = (data: any) => {
  console.log('水电录入成功:', data);
  Message.success('水电费用录入成功！');
  showUtilityModal.value = false;
  selectedHouse.value = null;
};

// 显示批量水电录入弹窗
const handleShowBatchUtilityModal = () => {
  showBatchUtilityModal.value = true;
};

// 处理批量水电录入成功
const handleBatchUtilitySuccess = (data: any) => {
  console.log('批量水电录入成功:', data);
  Message.success(`批量水电费用录入成功！共录入 ${data.length} 套房屋的费用信息`);
  showBatchUtilityModal.value = false;

  // 这里可以添加刷新列表或其他后续操作
  // getHouseList(); // 如果需要刷新房屋列表
};

// 显示收款管理弹窗
const handlePaymentManagement = (house: any) => {
  selectedHouse.value = house;
  showPaymentModal.value = true;
};

// 处理收款管理成功
const handlePaymentSuccess = (data: any) => {
  console.log('收款管理操作成功:', data);
  Message.success('收款管理操作成功！');
  showPaymentModal.value = false;
  selectedHouse.value = null;
};

// 获取月结日标签
const getPaymentDayLabel = (day: number) => {
  const option = paymentDayOptions.find(item => item.value === day);
  return option ? option.label : `${day}日`;
};

// 计算月度总费用
const calculateMonthlyTotal = () => {
  const rent = Number(tenantDetailData.rentPrice) || 0;
  const property = Number(tenantDetailData.propertyFee) || 0;
  const internet = Number(tenantDetailData.internetFee) || 0;
  return rent + property + internet;
};

// 计算入住时长
const calculateStayDuration = () => {
  if (!tenantDetailData.joinTime) return '未知';

  try {
    const joinDate = new Date(tenantDetailData.joinTime);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays}天`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      return remainingDays > 0 ? `${months}个月${remainingDays}天` : `${months}个月`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingDays = diffDays % 365;
      const months = Math.floor(remainingDays / 30);
      return months > 0 ? `${years}年${months}个月` : `${years}年`;
    }
  } catch (error) {
    return '计算错误';
  }
};

// 计算合同剩余天数
const calculateRemainingDays = () => {
  if (!tenantDetailData.leaseEndDate) return 0;

  try {
    const endDate = new Date(tenantDetailData.leaseEndDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 0;
    }
    return diffDays;
  } catch (error) {
    return 0;
  }
};

// 保存租客入住登记
const saveCheckin = async () => {
  try {
    checkinLoading.value = true;

    // 验证必填字段
    if (!checkinForm.tenantName?.trim()) {
      Message.error('请输入租客姓名');
      return;
    }

    if (!checkinForm.idCard?.trim()) {
      Message.error('请输入身份证号码');
      return;
    }

    if (!checkinForm.phoneNumber?.trim()) {
      Message.error('请输入手机号码');
      return;
    }

    if (!checkinForm.contractStartDate) {
      Message.error('请选择合同起始日期');
      return;
    }

    if (!checkinForm.contractEndDate) {
      Message.error('请选择合同结束日期');
      return;
    }

    if (!checkinForm.paymentDay) {
      Message.error('请选择月结日');
      return;
    }

    // 验证日期逻辑
    if (new Date(checkinForm.contractEndDate) <= new Date(checkinForm.contractStartDate)) {
      Message.error('合同结束日期必须晚于起始日期');
      return;
    }

    // 处理身份照片上传
    let idCardImageUrl = '';
    if (checkinForm.idPhoto && checkinForm.idPhoto.length > 0 && checkinForm.idPhoto[0].originFile) {
      Message.loading({
        content: '正在上传身份照片...',
        duration: 0
      });

      idCardImageUrl = await uploadIdCardImage(checkinForm.idPhoto[0].originFile);

      if (!idCardImageUrl) {
        Message.error('身份照片上传失败，请重试');
        return;
      }
    }

    // 构建API请求数据，按照API文档字段映射
    const requestData = {
      houseId: checkinData.houseId,
      tenantName: checkinForm.tenantName.trim(),
      idCardNumber: checkinForm.idCard.trim(),
      phone: checkinForm.phoneNumber.trim(),
      leaseStartDate: checkinForm.contractStartDate,
      leaseEndDate: checkinForm.contractEndDate,
      monthlyPaymentDay: checkinForm.paymentDay,
      rentPrice: Number(checkinForm.rentPrice) || 0,
      houseDeposit: Number(checkinForm.houseDeposit) || 0,
      otherDeposit: Number(checkinForm.otherDeposit) || 0,
      propertyFee: Number(checkinForm.managementFee) || 0,
      internetFee: Number(checkinForm.internetFee) || 0,
      waterMeterReading: Number(checkinForm.waterMeterReading) || 0,
      electricityMeterReading: Number(checkinForm.electricMeterReading) || 0,
      remark: checkinForm.notes?.trim() || '',
      idCardImage: idCardImageUrl
    };

    // 调用API进行租客入住登记
    const response = await leaseRegister(requestData);

    if (response.status === 1) {
      // 登记成功
      const successMessage = response.data?.contractNumber
        ? `租客入住登记成功！合同编号：${response.data.contractNumber}`
        : '租客入住登记成功！';

      Message.success({
        content: successMessage,
        duration: 5000
      });

      // 关闭弹窗
      showCheckinModel.value = false;

      // 刷新房屋列表
      getHouseListFun();

    } else {
      // API返回失败
      Message.error({
        content: response.message || '租客入住登记失败',
        duration: 5000
      });
    }

  } catch (error: any) {
    console.error('租客入住登记失败:', error);

    let errorMessage = '租客入住登记失败，请稍后重试';

    if (error.response) {
      // 服务器响应错误
      const status = error.response.status;
      if (status === 401) {
        errorMessage = '未授权，请重新登录';
      } else if (status === 403) {
        errorMessage = '权限不足，无法进行入住登记';
      } else if (status === 404) {
        errorMessage = '房屋不存在或状态不可租赁';
      } else if (status === 422) {
        errorMessage = '数据验证失败，请检查输入信息';
      } else if (status >= 500) {
        errorMessage = '服务器错误，请稍后重试';
      }
    } else if (error.request) {
      // 网络错误
      errorMessage = '网络连接失败，请检查网络设置';
    } else if (error.message) {
      // 其他错误
      if (error.message.includes('身份证')) {
        errorMessage = '身份证号码格式不正确';
      } else if (error.message.includes('手机号')) {
        errorMessage = '手机号码格式不正确';
      } else {
        errorMessage = error.message;
      }
    }

    Message.error({
      content: errorMessage,
      duration: 5000
    });

  } finally {
    checkinLoading.value = false;
  }
};
</script>
<style scoped lang="scss">
// 页面主容器宽度优化
.house-list-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 1440px) {
    max-width: 1200px;
  }

  @media (max-width: 1200px) {
    max-width: 100%;
    padding: 0 16px;
  }

  @media (max-width: 768px) {
    padding: 0 12px;
  }
}

// 紧凑型信息区域样式
.info-section {
  margin-bottom: 8px;

  &.compact {
    :deep(.arco-card-header) {
      border-bottom: 1px solid var(--color-border-2);
      padding: 8px 12px;
      min-height: auto;

      .arco-card-header-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-text-1);
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }

    :deep(.arco-card-body) {
      padding: 8px 12px;
    }
  }

  :deep(.arco-card-header) {
    border-bottom: 1px solid var(--color-border-2);
    padding: 12px 16px;

    .arco-card-header-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text-1);
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  :deep(.arco-card-body) {
    padding: 16px;
  }
}

// 紧凑文本样式
.compact-text {
  font-size: 13px;
  line-height: 1.4;
}

// 价格文本样式
.price-text {
  font-weight: 600;
  color: var(--color-primary-6);
  font-size: 14px;

  &.compact {
    font-size: 13px;
  }
}

// 视频容器样式
.video-container {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &.compact {
    border-radius: 4px;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  video {
    display: block;
    border-radius: 6px;

    .compact & {
      border-radius: 4px;
    }
  }

  .video-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    padding: 4px;
    display: flex;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }

  &:hover .video-actions {
    opacity: 1;
  }
}

// 媒体区域样式
.media-section {
  .media-subtitle {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-2);
    margin-bottom: 6px;
  }

  .media-image {
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  }

  .more-images {
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-fill-2);
    border-radius: 4px;
    color: var(--color-text-3);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: var(--color-fill-3);
      color: var(--color-text-2);
    }
  }

  // 同行布局时的特殊样式
  :deep(.arco-row) {
    .arco-col {
      &:first-child {
        border-right: 1px solid var(--color-border-2);
        padding-right: 16px;
      }

      &:last-child {
        padding-left: 16px;
      }
    }
  }
}

// 弹窗样式优化
:deep(.arco-modal) {
  // 大屏幕弹窗宽度优化
  @media (min-width: 1600px) {
    width: 1400px !important;
  }

  @media (min-width: 1200px) and (max-width: 1599px) {
    width: 1100px !important;
  }

  .arco-modal-body {
    max-height: 85vh;
    overflow-y: auto;
    padding: 20px 24px;
  }

  .arco-modal-header {
    border-bottom: 1px solid var(--color-border-2);
    padding: 20px 24px;
  }

  .arco-modal-title {
    font-size: 18px;
    font-weight: 600;
  }

  .arco-modal-footer {
    padding: 16px 24px;
    border-top: 1px solid var(--color-border-2);
  }
}

// 描述列表样式优化
:deep(.arco-descriptions) {
  &.arco-descriptions-size-mini {
    .arco-descriptions-item {
      padding: 4px 8px;
    }

    .arco-descriptions-item-label {
      font-weight: 500;
      color: var(--color-text-2);
      background-color: var(--color-fill-1);
      font-size: 13px;
      padding: 4px 8px;
    }

    .arco-descriptions-item-value {
      padding: 4px 8px;
      font-size: 13px;

      p {
        margin: 0;
        color: var(--color-text-1);
      }
    }
  }

  .arco-descriptions-item {
    padding: 6px 10px;
  }

  .arco-descriptions-item-label {
    font-weight: 500;
    color: var(--color-text-2);
    background-color: var(--color-fill-1);
  }

  .arco-descriptions-item-value {
    p {
      margin: 0;
      color: var(--color-text-1);
    }
  }
}

// 标签样式优化
:deep(.arco-tag) {
  font-weight: 500;
  font-size: 12px;

  &.arco-tag-size-small {
    font-size: 11px;
    padding: 1px 6px;
    height: 20px;
    line-height: 18px;
  }
}

// 列表样式优化
:deep(.arco-list) {
  &.arco-list-size-small {
    .arco-list-item {
      padding: 8px 0;
      min-height: auto;
    }

    .arco-list-item-meta {
      .arco-list-item-meta-title {
        font-size: 13px;
        margin-bottom: 2px;
      }

      .arco-list-item-meta-description {
        font-size: 12px;
        color: var(--color-text-3);
      }
    }
  }
}

// 响应式优化
@media (max-width: 1200px) {
  :deep(.arco-modal) {
    width: 95% !important;

    .arco-modal-body {
      padding: 16px 20px;
    }

    .arco-modal-header {
      padding: 16px 20px;
    }

    .arco-modal-footer {
      padding: 12px 20px;
    }
  }
}

@media (max-width: 768px) {
  .info-section {
    margin-bottom: 6px;

    &.compact {
      :deep(.arco-card-header) {
        padding: 6px 8px;
      }

      :deep(.arco-card-body) {
        padding: 6px 8px;
      }
    }

    :deep(.arco-descriptions) {
      .arco-descriptions-item {
        padding: 4px 6px;
      }
    }
  }

  :deep(.arco-modal) {
    width: 98% !important;
    margin: 10px;

    .arco-modal-body {
      padding: 12px 16px;
    }

    .arco-modal-header {
      padding: 12px 16px;
    }
  }

  .media-section {
    .media-image {
      height: 50px !important;
    }

    .more-images {
      height: 50px !important;
      font-size: 12px;
    }

    // 移动端恢复垂直布局
    :deep(.arco-row) {
      .arco-col {
        &:first-child {
          border-right: none;
          padding-right: 0;
          margin-bottom: 8px;
        }

        &:last-child {
          padding-left: 0;
        }
      }
    }
  }
}

// 编辑表单样式
:deep(.arco-form) {
  .arco-form-item {
    margin-bottom: 16px;

    .arco-form-item-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-2);
      padding-bottom: 4px;
    }

    .arco-input,
    .arco-input-number,
    .arco-select,
    .arco-textarea {
      font-size: 14px;

      &:hover {
        border-color: var(--color-primary-3);
      }

      &:focus-within {
        border-color: var(--color-primary-5);
        box-shadow: 0 0 0 2px rgba(var(--color-primary-1), 0.1);
      }
    }

    .arco-input-number {
      width: 100%;
    }
  }
}

// 编辑弹窗表单特殊样式
:deep(.arco-modal-body) {
  .arco-form {
    .arco-card {
      &.compact {
        .arco-card-body {
          padding: 12px 16px;
        }
      }

      .arco-row {
        margin: 0;

        .arco-col {
          padding: 0 8px;

          &:first-child {
            padding-left: 0;
          }

          &:last-child {
            padding-right: 0;
          }
        }
      }
    }
  }
}

// 表单验证错误样式
:deep(.arco-form-item) {
  &.arco-form-item-error {
    .arco-input,
    .arco-input-number,
    .arco-select,
    .arco-textarea {
      border-color: var(--color-danger-5);

      &:focus-within {
        border-color: var(--color-danger-5);
        box-shadow: 0 0 0 2px rgba(var(--color-danger-1), 0.1);
      }
    }
  }
}

// 加载状态样式
.arco-btn-loading {
  position: relative;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

// 表格操作按钮区域样式
.table-operations {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;

  .arco-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(var(--color-primary-6), 0.2);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// 响应式布局
@media (max-width: 768px) {
  .table-operations {
    justify-content: center;
    margin-bottom: 12px;

    .arco-btn {
      width: 100%;
      justify-content: center;
    }
  }
}

// 卡片视图样式
.card-view-container {
  margin-bottom: 20px;

  // 优化卡片网格布局
  :deep(.arco-row) {
    margin: 0 -8px; // 抵消列的间距

    .arco-col {
      padding: 0 8px; // 列间距
    }
  }
}

.card-pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding: 20px 0;
  border-top: 1px solid var(--color-border-2);
}

.table-operations {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .operations-left {
    display: flex;
    gap: 12px;
  }

  .operations-right {
    display: flex;
    align-items: center;
  }
}

.house-card {
  margin-bottom: 16px;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .card-cover {
    height: 160px;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;

    .house-image-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: rgba(255, 255, 255, 0.8);

      .placeholder-text {
        margin-top: 8px;
        font-size: 14px;
        font-weight: 400;
      }
    }

    // 悬浮操作按钮
    .card-actions {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      gap: 8px;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      .action-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;

        &:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        &:active {
          transform: scale(0.95);
        }

        &.edit-btn {
          background: rgba(22, 93, 255, 0.9);
          border-color: rgba(22, 93, 255, 0.3);
          color: white;

          &:hover {
            background: rgba(22, 93, 255, 1);
            border-color: rgba(22, 93, 255, 0.5);
          }
        }

        &.view-btn {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(0, 0, 0, 0.1);
          color: var(--color-text-1);

          &:hover {
            background: white;
            border-color: var(--color-primary-6);
            color: var(--color-primary-6);
          }
        }

        :deep(.arco-btn-icon) {
          font-size: 16px;
        }
      }
    }
  }

  &:hover .card-actions {
    opacity: 1;
    transform: translateY(0);
  }

  // 卡片内容区
  .card-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .house-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--color-text-1);
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-bottom: 4px;
  }

  // 主要信息区：租金
  .price-section {
    .price-value {
      font-size: 24px;
      font-weight: 800;
      color: var(--color-primary-6);
      line-height: 1.2;
      margin-bottom: 4px;
    }
  }

  // 次要信息区：户型和面积
  .basic-info {
    display: flex;
    gap: 16px;
    margin-bottom: 8px;

    .info-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: var(--color-text-2);
      font-weight: 500;

      .info-icon {
        font-size: 16px;
        color: var(--color-text-3);

        &.small {
          font-size: 14px;
        }
      }
    }
  }

  // 补充信息区：地区和状态
  .additional-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 8px;
    border-top: 1px solid var(--color-border-2);

    .location-info {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;
      min-width: 0;

      .info-icon {
        font-size: 14px;
        color: var(--color-text-3);
        flex-shrink: 0;
      }

      span {
        font-size: 12px;
        color: var(--color-text-3);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .status-tag {
      flex-shrink: 0;
      font-weight: 600;
      font-size: 11px;
      padding: 2px 8px;
      height: auto;
      line-height: 1.5;
    }
  }
}

// 卡片操作按钮样式
:deep(.arco-card-actions) {
  padding: 12px 16px;
  border-top: 1px solid var(--color-border-2);
  background-color: var(--color-fill-1);

  .arco-btn {
    flex: 1;
    height: 32px;
    font-size: 13px;
  }
}

// 卡片元信息样式
:deep(.arco-card-meta) {
  .arco-card-meta-title {
    margin-bottom: 8px;
  }

  .arco-card-meta-description {
    color: var(--color-text-2);
  }
}

// 卡片视图响应式设计
@media (max-width: 768px) {
  .house-list-container {
    padding: 0 8px;
  }

  .table-operations {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
    padding: 0;

    .operations-left {
      justify-content: center;
    }

    .operations-right {
      justify-content: center;
    }
  }

  .house-card {
    margin-bottom: 12px;

    .card-cover {
      height: 140px;

      .card-actions {
        top: 8px;
        right: 8px;
        gap: 6px;

        .action-btn {
          width: 32px;
          height: 32px;

          :deep(.arco-btn-icon) {
            font-size: 14px;
          }
        }
      }
    }

    .card-content {
      padding: 12px;
      gap: 10px;
    }

    .house-title {
      font-size: 16px;
      font-weight: 600;
    }

    .price-section .price-value {
      font-size: 20px;
      font-weight: 700;
    }

    .basic-info {
      gap: 12px;

      .info-item {
        font-size: 13px;

        .info-icon {
          font-size: 14px;
        }
      }
    }

    .additional-info {
      .location-info span {
        font-size: 11px;
      }

      .status-tag {
        font-size: 10px;
        padding: 1px 6px;
      }
    }
  }
}

@media (max-width: 480px) {
  .house-card {
    .card-cover {
      height: 120px;

      .card-actions {
        .action-btn {
          width: 30px;
          height: 30px;

          :deep(.arco-btn-icon) {
            font-size: 13px;
          }
        }
      }
    }

    .card-content {
      padding: 10px;
      gap: 8px;
    }

    .house-title {
      font-size: 15px;
      font-weight: 600;
      -webkit-line-clamp: 1;
      white-space: nowrap;
    }

    .price-section .price-value {
      font-size: 18px;
      font-weight: 700;
    }

    .basic-info {
      flex-direction: column;
      gap: 6px;

      .info-item {
        font-size: 12px;

        .info-icon {
          font-size: 13px;
        }
      }
    }

    .additional-info {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
      padding-top: 6px;

      .location-info {
        width: 100%;
      }
    }

    .utility-section {
      display: flex;
      gap: 8px;

      .utility-btn, .batch-utility-btn {
        height: 30px;
        font-size: 11px;
      }
    }
  }
}

// 租客入住登记相关样式
.checkin-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-2);

  .checkin-btn {
    width: 100%;
    height: 36px;
    font-weight: 600;
    font-size: 13px;
    border-radius: 6px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(var(--color-primary-6), 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// 租客查看相关样式
.tenant-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-2);

  .tenant-btn {
    width: 100%;
    height: 36px;
    font-weight: 600;
    font-size: 13px;
    border-radius: 6px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(var(--color-primary-6), 0.2);
    }

    &:active {
      transform: translateY(0);
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
    .checkin-section {
    .checkin-btn {
      height: 32px;
      font-size: 12px;
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

      svg {
        color: var(--color-primary-6);
      }
    }

    .arco-form {
      .arco-row {
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .arco-form-item {
        margin-bottom: 0;

        .arco-form-item-label {
          font-weight: 500;
          color: var(--color-text-2);
          font-size: 14px;
        }

        .arco-input,
        .arco-input-number,
        .arco-select,
        .arco-textarea,
        .arco-date-picker {
          font-size: 14px;

          &:hover {
            border-color: var(--color-primary-3);
          }

          &:focus-within {
            border-color: var(--color-primary-5);
            box-shadow: 0 0 0 2px rgba(var(--color-primary-1), 0.1);
          }
        }

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
    }
  }
}

// 租客入住登记弹窗响应式设计
@media (max-width: 768px) {
  .checkin-form-container {
    gap: 16px;

    .checkin-section {
      padding: 16px;

      .section-title {
        font-size: 15px;
        margin-bottom: 16px;
        padding-bottom: 8px;
      }

      .arco-form {
        .arco-row {
          margin-bottom: 12px;
        }

        .arco-form-item {
          .arco-form-item-label {
            font-size: 13px;
          }

          .arco-input,
          .arco-input-number,
          .arco-select,
          .arco-textarea,
          .arco-date-picker {
            font-size: 13px;
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .checkin-form-container {
    gap: 12px;

    .checkin-section {
      padding: 12px;

      .section-title {
        font-size: 14px;
        margin-bottom: 12px;
        padding-bottom: 6px;
      }

      .arco-form {
        .arco-row {
          margin-bottom: 10px;
          flex-direction: column;
          gap: 8px;
        }

        .arco-col {
          width: 100% !important;
          margin-bottom: 8px;
        }

        .arco-form-item {
          .arco-form-item-label {
            font-size: 12px;
          }

          .arco-input,
          .arco-input-number,
          .arco-select,
          .arco-textarea,
          .arco-date-picker {
            font-size: 12px;
          }
        }
      }
    }
  }
}

// 租客详情弹窗样式
.tenant-detail-modal {
  :deep(.arco-modal-body) {
    padding: 0;
  }

  :deep(.arco-modal-header) {
    padding: 0;
    border: none;
  }

  :deep(.arco-modal-footer) {
    padding: 16px 24px;
    border-top: 1px solid var(--color-border-2);
    background: var(--color-bg-2);
  }
}

.tenant-detail-container {
  .main-content {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 20px;
    margin: 0 0 20px 0;
  }

  // 租客信息区域
  .tenant-section {
    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding: 12px 16px;
      background: var(--color-bg-2);
      border-radius: 8px;
      
      svg {
        color: var(--color-primary-6);
      }

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--color-text-1);
      }
    }

    .tenant-profile {
      background: var(--color-bg-1);
      border-radius: 12px;
            padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

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
            background: var(--color-primary-light-1);
            margin: 0 -20px;
            padding: 16px 20px;
            border-radius: 8px;
            margin-bottom: 8px;

            .label {
              font-weight: 600;
              color: var(--color-primary-6);
            }

            .value.name {
              font-size: 18px;
              font-weight: 700;
              color: var(--color-primary-6);
            }
          }

          .label {
            font-weight: 500;
            color: var(--color-text-3);
            font-size: 14px;
          }

          .value {
            font-weight: 500;
            color: var(--color-text-1);
            text-align: right;
          }
        }
      }
    }
  }

  // 租赁信息区域
  .lease-section {
    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding: 12px 16px;
      background: var(--color-bg-2);
      border-radius: 8px;
      
      svg {
        color: var(--color-primary-6);
      }

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--color-text-1);
      }
    }

    // 合同期限卡片
    .contract-period-card {
      background: linear-gradient(135deg, var(--color-primary-light-1), var(--color-primary-light-2));
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      border: 1px solid var(--color-primary-light-3);

      .period-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;

        svg {
          color: var(--color-primary-6);
        }

        .period-title {
          font-weight: 600;
          color: var(--color-primary-6);
          font-size: 15px;
        }
      }

      .period-content {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .period-item {
          flex: 1;
          text-align: center;

          .period-label {
            display: block;
            font-size: 12px;
            color: var(--color-text-3);
            margin-bottom: 8px;
          }

          .period-value {
            display: block;
            font-size: 16px;
            font-weight: 600;
            color: var(--color-primary-6);
          }
        }

        .period-arrow {
          color: var(--color-primary-4);
          margin: 0 16px;
        }
      }
    }

    // 费用信息网格
    .fees-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 20px;

      .fee-card {
        background: var(--color-bg-1);
        border-radius: 12px;
        padding: 16px;
                display: flex;
        align-items: center;
        gap: 12px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        &.primary {
          background: linear-gradient(135deg, var(--color-warning-light-1), var(--color-warning-light-2));
          border-color: var(--color-warning-light-3);

          .fee-icon {
            svg {
              color: var(--color-warning-6);
            }
          }

          .fee-content {
            .fee-value {
              color: var(--color-warning-6);
              font-size: 18px;
              font-weight: 700;
            }
          }
        }

        .fee-icon {
          width: 40px;
          height: 40px;
          background: var(--color-fill-2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;

          svg {
            font-size: 20px;
            color: var(--color-primary-6);
          }
        }

        .fee-content {
          flex: 1;

          .fee-label {
            font-size: 12px;
            color: var(--color-text-3);
            margin-bottom: 4px;
          }

          .fee-value {
            font-size: 16px;
            font-weight: 600;
            color: var(--color-text-1);
            margin-bottom: 2px;
          }

          .fee-unit {
            font-size: 11px;
            color: var(--color-text-4);
          }
        }
      }
    }

    // 其他信息区域
    .additional-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;

      .info-card, .remark-card {
        background: var(--color-bg-1);
        border-radius: 12px;
                overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

        .info-header, .remark-header {
          background: var(--color-fill-2);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--color-border-2);

          svg {
            color: var(--color-primary-6);
          }

          span {
            font-weight: 500;
            color: var(--color-text-1);
            font-size: 14px;
          }
        }

        .info-details {
          padding: 16px;

          .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;

            &:last-child {
              padding-bottom: 0;
            }

            .detail-label {
              font-size: 13px;
              color: var(--color-text-3);
            }

            .detail-value {
              font-size: 13px;
              font-weight: 500;
              color: var(--color-text-1);
            }
          }
        }

        .remark-content {
          padding: 16px;
          color: var(--color-text-2);
          font-size: 13px;
          line-height: 1.6;
          min-height: 80px;
        }
      }
    }
  }

  // 底部统计信息
  .summary-section {
    background: var(--color-bg-2);
    border-radius: 12px;
    padding: 16px 20px;
        display: flex;
    justify-content: space-between;
    align-items: center;

    .summary-item {
      text-align: center;
      flex: 1;

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
          font-weight: 700;
        }
      }
    }
  }
}

// 租客详情弹窗响应式设计
@media (max-width: 768px) {
  .tenant-detail-modal {
    :deep(.arco-modal) {
      width: 95% !important;
      margin: 10px;
    }

    .tenant-detail-container {
      .main-content {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .tenant-section, .lease-section {
        .section-header {
          padding: 10px 12px;

          h3 {
            font-size: 15px;
          }
        }
      }

      .tenant-profile {
        padding: 16px;

        .tenant-info {
          .info-row {
            padding: 10px 0;

            &.primary {
              padding: 12px 16px;
              margin: 0 -16px 8px -16px;

              .value.name {
                font-size: 16px;
              }
            }

            .label, .value {
              font-size: 13px;
            }
          }
        }
      }

      .contract-period-card {
        padding: 16px;

        .period-content {
          .period-item {
            .period-value {
              font-size: 14px;
            }
          }
        }
      }

      .fees-grid {
        grid-template-columns: 1fr;
        gap: 10px;

        .fee-card {
          padding: 14px;

          .fee-content {
            .fee-value {
              font-size: 15px;
            }
          }

          &.primary {
            .fee-content {
              .fee-value {
                font-size: 16px;
              }
            }
          }
        }
      }

      .additional-info {
        grid-template-columns: 1fr;
        gap: 10px;

        .info-card, .remark-card {
          .info-details {
            padding: 12px;

            .detail-row {
              padding: 6px 0;

              .detail-label, .detail-value {
                font-size: 12px;
              }
            }
          }

          .remark-content {
            padding: 12px;
            font-size: 12px;
          }
        }
      }

      .summary-section {
        flex-direction: column;
        gap: 12px;
        padding: 12px 16px;

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .summary-value {
            &.primary {
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .tenant-detail-modal {
    :deep(.arco-modal) {
      width: 98% !important;
      margin: 5px;
    }

    .tenant-detail-container {

      .tenant-profile {
        padding: 12px;

        .tenant-info {
          .info-row {
            padding: 8px 0;

            &.primary {
              padding: 10px 12px;
              margin: 0 -12px 6px -12px;

              .value.name {
                font-size: 15px;
              }
            }

            .label, .value {
              font-size: 12px;
            }
          }
        }
      }

      .contract-period-card {
        padding: 12px;

        .period-content {
          flex-direction: column;
          gap: 12px;

          .period-arrow {
            transform: rotate(90deg);
            margin: 0;
          }
        }
      }

      .fees-grid {
        gap: 8px;

        .fee-card {
          padding: 12px;

          .fee-icon {
            width: 36px;
            height: 36px;

            svg {
              font-size: 18px;
            }
          }

          .fee-content {
            .fee-label {
              font-size: 11px;
            }

            .fee-value {
              font-size: 14px;
              margin-bottom: 1px;
            }

            .fee-unit {
              font-size: 10px;
            }
          }

          &.primary {
            .fee-content {
              .fee-value {
                font-size: 15px;
              }
            }
          }
        }
      }

      .additional-info {
        .info-card, .remark-card {
          .info-header, .remark-header {
            padding: 10px 12px;

            span {
              font-size: 13px;
            }
          }

          .info-details {
            padding: 10px;

            .detail-row {
              padding: 5px 0;

              .detail-label, .detail-value {
                font-size: 11px;
              }
            }
          }

          .remark-content {
            padding: 10px;
            font-size: 11px;
            min-height: 60px;
          }
        }
      }

      .summary-section {
        padding: 10px 12px;
        gap: 10px;

        .summary-item {
          .summary-label {
            font-size: 11px;
          }

          .summary-value {
            font-size: 14px;

            &.primary {
              font-size: 15px;
            }
          }
        }
      }

      .utility-modal-container {
        .utility-header {
          padding: 12px;
          margin-bottom: 12px;

          .house-info {
            flex-direction: column;
            text-align: center;
            gap: 8px;

            .header-icon {
              font-size: 24px;
            }

            .house-details {
              h3 {
                font-size: 15px;
              }

              p {
                font-size: 12px;
              }
            }
          }
        }

        .utility-bills-container {
          margin-bottom: 16px;

          .utility-bill-card {
            margin-bottom: 12px;

            .card-title {
              font-size: 14px;

              .title-icon {
                font-size: 15px;
              }
            }

            .date-range-container {
              .arco-radio-group {
                flex-direction: column;
                gap: 4px;

                .arco-radio {
                  margin-right: 0;
                }
              }
            }

            :deep(.arco-form-item-label) {
              font-size: 11px;
            }
          }
        }

        .utility-summary {
          .summary-content {
            gap: 8px;

            .summary-item {
              padding: 5px 8px;

              .label {
                font-size: 12px;
              }

              .value {
                font-size: 14px;
              }

              &.total {
                padding: 8px 10px;
                margin-top: 2px;

                .label {
                  font-size: 13px;
                }

                .value {
                  font-size: 15px;
                }
              }
            }
          }
        }
      }
    }
  }
}

</style>