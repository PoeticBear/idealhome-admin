租客缴费状态查询功能 - API文档

  功能概述

  实现完整的租客缴费状态管理系统，支持缴费记录查询、欠费管理、账单生成等功能。

  数据库设计

  缴费记录表 (tenant_payment_record)

  | 字段名           | 类型            | 说明                            |
  |---------------|---------------|-------------------------------|
  | id            | int           | 主键ID                          |
  | tenant_id     | int           | 租客ID                          |
  | house_id      | int           | 房源ID                          |
  | landlord_id   | int           | 房东ID                          |
  | payment_type  | int           | 缴费类型：1租金 2水费 3电费 4网费 5燃气费 6其他 |
  | payment_month | varchar(7)    | 缴费月份（YYYY-MM）                 |
  | amount        | decimal(10,2) | 缴费金额                          |
  | status        | int           | 状态：0未缴费 1已缴费 2欠费 3部分缴费        |
  | due_date      | date          | 缴费截止日期                        |
  | payment_date  | date          | 实际缴费日期                        |
  | remark        | varchar(500)  | 备注                            |
  | created_at    | datetime      | 创建时间                          |
  | updated_at    | datetime      | 更新时间                          |

  API接口说明

  1. 获取租客缴费状态总览

  接口地址： GET /api/tenantsUser/payment/status

  请求参数：
  {
    tenantId: 123,        // 租客ID（可选，不传则获取当前登录用户）
    paymentMonth: "2024-01", // 缴费月份（可选）
    status: 0,             // 缴费状态（可选：0未缴费 1已缴费 2欠费 3部分缴费）
    paymentType: 1        // 缴费类型（可选：1租金 2水费 3电费 4网费 5燃气费 6其他）
  }

  返回数据：
  {
    "status": 1,
    "data": {
      "records": [
        {
          "id": 1,
          "tenantId": 123,
          "houseId": 456,
          "landlordId": 789,
          "paymentType": 1,
          "paymentMonth": "2024-01",
          "amount": 4800.00,
          "status": 1,
          "dueDate": "2024-01-05",
          "paymentDate": "2024-01-03",
          "remark": "月租金",
          "createdAt": "2024-01-01 10:00:00",
          "updatedAt": "2024-01-03 15:30:00",
          "house": {
            "name": "沙嘴村两室一厅",
            "id": 456,
            "price": 4800.00,
            "provinceName": "广东省",
            "cityName": "深圳市",
            "areaName": "福田区",
            "addresInfo": "沙嘴村1栋"
          }
        }
      ],
      "count": 1,
      "statistics": {
        "totalAmount": 4800.00,    // 总金额
        "paidAmount": 4800.00,     // 已缴金额
        "unpaidAmount": 0.00,      // 未缴金额
        "overdueAmount": 0.00,     // 欠费金额
        "totalRecords": 1,         // 总记录数
        "paidRecords": 1,          // 已缴记录数
        "unpaidRecords": 0,        // 未缴记录数
        "overdueRecords": 0        // 欠费记录数
      }
    }
  }

  2. 获取缴费记录明细

  接口地址： GET /api/tenantsUser/payment/records

  请求参数：
  {
    tenantId: 123,        // 租客ID（可选）
    landlordId: 789,      // 房东ID（可选）
    houseId: 456,         // 房源ID（可选）
    paymentMonth: "2024-01", // 缴费月份（可选）
    status: 0,             // 缴费状态（可选）
    paymentType: 1,       // 缴费类型（可选）
    size: 10,             // 每页数量（可选）
    index: 1              // 当前页码（可选）
  }

  返回数据：
  {
    "status": 1,
    "count": 25,
    "data": [
      {
        "id": 1,
        "tenantId": 123,
        "houseId": 456,
        "landlordId": 789,
        "paymentType": 1,
        "paymentMonth": "2024-01",
        "amount": 4800.00,
        "status": 1,
        "dueDate": "2024-01-05",
        "paymentDate": "2024-01-03",
        "remark": "月租金",
        "createdAt": "2024-01-01 10:00:00",
        "updatedAt": "2024-01-03 15:30:00",
        "tenantUser": {
          "name": "张三",
          "id": 123,
          "phone": "13800138000",
          "headImg": "/images/avatar1.jpg"
        },
        "house": {
          "name": "沙嘴村两室一厅",
          "id": 456,
          "price": 4800.00,
          "provinceName": "广东省",
          "cityName": "深圳市",
          "areaName": "福田区",
          "addresInfo": "沙嘴村1栋"
        },
        "landlordUser": {
          "name": "李房东",
          "id": 789,
          "phone": "13900139000"
        }
      }
    ]
  }

  3. 获取欠费租客列表

  接口地址： GET /api/tenantsUser/payment/overdue

  权限说明： 仅房东和管理员可访问

  请求参数：
  {
    landlordId: 789,      // 房东ID（可选，房东用户自动填充）
    houseId: 456,         // 房源ID（可选）
    size: 10,             // 每页数量（可选）
    index: 1              // 当前页码（可选）
  }

  返回数据：
  {
    "status": 1,
    "count": 5,
    "data": [
      {
        "id": 2,
        "tenantId": 124,
        "houseId": 457,
        "landlordId": 789,
        "paymentType": 1,
        "paymentMonth": "2024-01",
        "amount": 3200.00,
        "status": 2,
        "dueDate": "2024-01-05",
        "paymentDate": null,
        "remark": "月租金",
        "createdAt": "2024-01-01 10:00:00",
        "updatedAt": "2024-01-01 10:00:00",
        "tenantUser": {
          "name": "王五",
          "id": 124,
          "phone": "13800138001",
          "headImg": "/images/avatar2.jpg"
        },
        "house": {
          "name": "沙嘴村单间公寓",
          "id": 457,
          "price": 3200.00,
          "provinceName": "广东省",
          "cityName": "深圳市",
          "areaName": "福田区",
          "addresInfo": "沙嘴村2栋"
        },
        "landlordUser": {
          "name": "李房东",
          "id": 789,
          "phone": "13900139000"
        }
      }
    ]
  }

  4. 生成月度账单

  接口地址： POST /api/tenantsUser/payment/generateBill

  权限说明： 仅房东和管理员可访问

  请求参数：
  {
    houseId: 456,         // 房源ID
    tenantId: 123,        // 租客ID
    landlordId: 789,      // 房东ID（可选，房东用户自动填充）
    paymentMonth: "2024-01" // 缴费月份
  }

  返回数据：
  {
    "status": 1,
    "data": [
      {
        "id": 10,
        "houseId": 456,
        "tenantId": 123,
        "landlordId": 789,
        "paymentType": 1,
        "paymentMonth": "2024-01",
        "amount": 4800.00,
        "status": 0,
        "dueDate": "2024-01-05",
        "remark": "月租金",
        "createdAt": "2024-01-01 10:00:00",
        "updatedAt": "2024-01-01 10:00:00"
      }
    ],
    "message": "月度账单生成成功"
  }

  5. 更新缴费状态

  接口地址： POST /api/tenantsUser/payment/updateStatus

  请求参数：
  {
    id: 1,                // 缴费记录ID
    status: 1,            // 新状态：0未缴费 1已缴费 2欠费 3部分缴费
    paymentDate: "2024-01-03" // 实际缴费日期（可选，不传则使用当前时间）
  }

  返回数据：
  {
    "status": 1,
    "data": {
      "id": 1,
      "tenantId": 123,
      "houseId": 456,
      "landlordId": 789,
      "paymentType": 1,
      "paymentMonth": "2024-01",
      "amount": 4800.00,
      "status": 1,
      "dueDate": "2024-01-05",
      "paymentDate": "2024-01-03",
      "remark": "月租金",
      "createdAt": "2024-01-01 10:00:00",
      "updatedAt": "2024-01-03 15:30:00"
    },
    "message": "缴费状态更新成功"
  }

  数据字典

  缴费类型 (payment_type)

  | 值   | 说明  |
  |-----|-----|
  | 1   | 租金  |
  | 2   | 水费  |
  | 3   | 电费  |
  | 4   | 网费  |
  | 5   | 燃气费 |
  | 6   | 其他  |

  缴费状态 (status)

  | 值   | 说明   | 描述           |
  |-----|------|--------------|
  | 0   | 未缴费  | 未到缴费截止日期或未缴费 |
  | 1   | 已缴费  | 已完成缴费        |
  | 2   | 欠费   | 超过缴费截止日期未缴费  |
  | 3   | 部分缴费 | 只缴纳了部分费用     |

  前端实现建议

  1. 租客端功能

  - 缴费状态仪表板：显示当前月缴费概览
  - 缴费记录列表：展示历史缴费记录
  - 欠费提醒：突出显示欠费项目
  - 在线缴费：集成支付功能

  2. 房东端功能

  - 欠费租客管理：查看所有欠费租客
  - 账单生成：一键生成月度账单
  - 缴费统计：按房源、时间维度统计
  - 催缴提醒：发送催缴通知

  3. 管理员功能

  - 全局缴费统计：系统整体缴费情况
  - 异常处理：处理特殊缴费情况
  - 报表导出：导出缴费数据报表

  4. 通用组件

  - 状态标签组件：根据状态显示不同颜色标签
  - 金额格式化：统一金额显示格式
  - 日期选择器：支持月份选择
  - 分页组件：通用分页功能

  注意事项

  1. 权限控制：所有接口都需要JWT认证，部分接口有角色限制
  2. 数据格式：金额使用DECIMAL类型，前端注意精度处理
  3. 时区处理：日期时间统一使用服务器时区
  4. 错误处理：接口返回统一的错误格式，前端需要做好异常处理
  5. 分页参数：分页参数从1开始，size为每页数量

  示例代码

  获取缴费状态

  // 租客查看自己的缴费状态
  async getPaymentStatus(month = null) {
    try {
      const params = month ? { paymentMonth: month } : {};
      const response = await axios.get('/api/tenantsUser/payment/status', {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 1) {
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('获取缴费状态失败:', error);
      throw error;
    }
  }

  更新缴费状态

  // 标记为已缴费
  async markAsPaid(paymentId) {
    try {
      const response = await axios.post('/api/tenantsUser/payment/updateStatus', {
        id: paymentId,
        status: 1
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 1) {
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('更新缴费状态失败:', error);
      throw error;
    }
  }