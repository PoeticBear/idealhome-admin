# 前端对接指南 - 电子合同管理模块

## 优先功能列表

### 1. 合同列表查询
获取用户相关的合同列表，支持分页和筛选。

**接口地址**: `GET /api/contracts`

**请求参数**:
```javascript
{
  page: 1,           // 页码
  limit: 10,         // 每页数量
  status: 1,         // 状态筛选（可选）
  keyword: '搜索词'  // 关键词搜索（可选）
}
```

**响应格式**:
```javascript
{
  "code": 200,
  "message": "获取合同列表成功",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "房屋租赁合同",
        "status": 1,
        "statusText": "待房东签署",
        "startDate": "2024-01-01",
        "endDate": "2024-12-31",
        "rentAmount": 1000,
        "depositAmount": 2000,
        "createdAt": "2024-01-01 10:00:00"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25
    }
  }
}
```

### 2. 合同详情查看
获取指定合同的完整信息。

**接口地址**: `GET /api/contract/:id`

**响应格式**:
```javascript
{
  "code": 200,
  "message": "获取合同详情成功",
  "data": {
    "id": 1,
    "title": "房屋租赁合同",
    "status": 1,
    "statusText": "待房东签署",
    "content": "完整的合同内容...",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "rentAmount": 1000,
    "depositAmount": 2000,
    "landlordId": 1,
    "tenantId": 2,
    "houseId": 1,
    "signatures": [
      {
        "id": 1,
        "signerName": "张三",
        "signerType": 1,
        "signerTypeText": "房东",
        "signatureType": 1,
        "signedAt": "2024-01-01 11:00:00"
      }
    ],
    "createdAt": "2024-01-01 10:00:00"
  }
}
```

### 3. 合同创建
创建新合同（草稿状态）。

**接口地址**: `POST /api/contract`

**请求参数**:
```javascript
{
  "houseId": 1,
  "templateId": 1,
  "title": "房屋租赁合同",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "rentAmount": 1000,
  "depositAmount": 2000,
  "paymentMethod": "月付",
  "paymentDate": "每月1日",
  "deliveryDate": "2024-01-01",
  "specialTerms": "其他约定..."
}
```

**响应格式**:
```javascript
{
  "code": 200,
  "message": "创建合同成功",
  "data": {
    "id": 1,
    "title": "房屋租赁合同",
    "status": 0,
    "statusText": "草稿",
    "createdAt": "2024-01-01 10:00:00"
  }
}
```

### 4. 合同更新
更新草稿状态的合同。

**接口地址**: `PUT /api/contract/:id`

**请求参数**: 同创建合同

### 5. 合同删除
删除草稿状态的合同。

**接口地址**: `DELETE /api/contract/:id`

### 6. 合同模板列表
获取可用的合同模板。

**接口地址**: `GET /api/contract-templates`

**响应格式**:
```javascript
{
  "code": 200,
  "message": "获取模板列表成功",
  "data": [
    {
      "id": 1,
      "name": "标准房屋租赁合同",
      "type": 1,
      "typeText": "租赁合同",
      "status": 1,
      "isDefault": true,
      "description": "标准合同模板"
    }
  ]
}
```

## 状态码说明

### 合同状态
- `0`: 草稿
- `1`: 待房东签署
- `2`: 待租客签署
- `3`: 已签署
- `4`: 已生效
- `5`: 已到期
- `6`: 已终止

### 签名类型
- `1`: 手写签名
- `2`: 电子签章
- `3`: 数字证书

### 签名人类型
- `1`: 房东
- `2`: 租客

## 权限说明

### 房东权限
- 查看自己发布的合同
- 创建合同（草稿）
- 更新草稿状态合同
- 删除草稿状态合同
- 签署合同（待房东签署状态）

### 租客权限
- 查看与自己相关的合同
- 签署合同（待租客签署状态）

## 错误码说明

- `401`: 未登录或token失效
- `403`: 权限不足
- `404`: 合同不存在
- `400`: 请求参数错误
- `500`: 服务器内部错误

## 注意事项

1. **认证要求**: 所有接口需要在请求头中携带JWT token
   ```
   Authorization: Bearer <token>
   ```

2. **数据格式**: 日期格式统一使用 `YYYY-MM-DD`

3. **金额单位**: 所有金额字段单位为元，使用数字类型

4. **权限控制**: 前端需要根据用户角色和合同状态控制操作按钮的显示和隐藏

5. **状态转换**: 只有特定状态的合同才能进行相应操作（如只有草稿状态才能编辑和删除）