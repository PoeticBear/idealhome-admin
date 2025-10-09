<template>
  <div>
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
              </div>
            </template>

            <template #actions>
              <a-button type="outline" size="small" @click="showEdit(house)">
                <template #icon>
                  <icon-edit />
                </template>
                编辑
              </a-button>
              <a-button type="primary" size="small" @click="showInfo(house)">
                <template #icon>
                  <icon-eye />
                </template>
                详情
              </a-button>
            </template>

            <a-card-meta>
              <template #title>
                <div class="house-title">{{ house.name }}</div>
              </template>
              <template #description>
                <div class="house-info">
                  <div class="info-row">
                    <span class="info-label">户型：</span>
                    <span class="info-value">{{ house.layoutTypeText }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">面积：</span>
                    <span class="info-value">{{ house.areaText }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">租金：</span>
                    <span class="info-value price-text">{{ house.priceText }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">地区：</span>
                    <span class="info-value location-text">{{ house.location }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">状态：</span>
                    <a-tag :color="getStatusInfo(house.status).color" size="small">
                      {{ getStatusInfo(house.status).label }}
                    </a-tag>
                  </div>
                </div>
              </template>
            </a-card-meta>
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
  </div>
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
const viewMode = ref<'table' | 'card'>('table');

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
</script>
<style scoped lang="scss">
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
  .arco-modal-body {
    max-height: 85vh;
    overflow-y: auto;
    padding: 16px 20px;
  }

  .arco-modal-header {
    border-bottom: 1px solid var(--color-border-2);
    padding: 16px 20px;
  }

  .arco-modal-title {
    font-size: 16px;
    font-weight: 600;
  }

  .arco-modal-footer {
    padding: 12px 20px;
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
  justify-content: flex-end;

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
  border-radius: 8px;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .card-cover {
    height: 160px;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

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
    }
  }

  .house-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text-1);
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .house-info {
    .info-row {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      font-size: 13px;

      &:last-child {
        margin-bottom: 0;
      }

      .info-label {
        color: var(--color-text-3);
        min-width: 50px;
        flex-shrink: 0;
      }

      .info-value {
        color: var(--color-text-2);
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &.price-text {
          color: var(--color-primary-6);
          font-weight: 600;
        }

        &.location-text {
          font-size: 12px;
        }
      }
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
  .table-operations {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;

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
      height: 120px;
    }

    .house-title {
      font-size: 15px;
    }

    .house-info .info-row {
      font-size: 12px;

      .info-label {
        min-width: 45px;
      }
    }
  }
}

@media (max-width: 480px) {
  .house-card .house-info .info-row {
    flex-direction: column;
    align-items: flex-start;

    .info-label {
      margin-bottom: 2px;
      min-width: auto;
    }
  }
}

</style>