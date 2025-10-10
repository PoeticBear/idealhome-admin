● 根据前端开发的对接需求，我来整理一份详细的API对接文档。基于我们已经实现的租客入住登记功能，以下是完整的对接信息：

  租客入住登记功能 API 对接文档

  1. 核心接口信息

  1.1 租客入住登记接口

  接口URL: /api/lease/register
  请求方法: POST请求头要求:
  Content-Type: application/json
  Authorization: Bearer {管理员token}

  1.2 请求参数结构

  {
    "houseId": 1,
    "tenantName": "张三",
    "idCardNumber": "110101199001011234",
    "phone": "13800138000",
    "leaseStartDate": "2024-01-01",
    "leaseEndDate": "2024-12-31",
    "monthlyPaymentDay": 1,
    "rentPrice": 2000.00,
    "houseDeposit": 2000.00,
    "otherDeposit": 0.00,
    "propertyFee": 100.00,
    "internetFee": 50.00,
    "waterMeterReading": 100.0,
    "electricityMeterReading": 200.0,
    "remark": "备注信息",
    "idCardImage": "/uploads/contract/id_card_123456.jpg"
  }

  1.3 数据字段映射关系

  | 前端字段   | 后端字段                    | 数据类型   | 是否必填 | 说明            |
  |--------|-------------------------|--------|------|---------------|
  | 房屋ID   | houseId                 | Number | 是    | 房屋唯一标识        |
  | 租客姓名   | tenantName              | String | 是    | 租客真实姓名，最大50字符 |
  | 身份证号码  | idCardNumber            | String | 是    | 18位身份证号码      |
  | 手机号码   | phone                   | String | 是    | 11位手机号码       |
  | 合同起始日期 | leaseStartDate          | String | 是    | 格式：YYYY-MM-DD |
  | 合同结束日期 | leaseEndDate            | String | 是    | 格式：YYYY-MM-DD |
  | 月结日    | monthlyPaymentDay       | Number | 是    | 固定值：1/15/20   |
  | 出房价格   | rentPrice               | Number | 是    | 月租金，单位：元      |
  | 房屋押金   | houseDeposit            | Number | 是    | 押金金额，单位：元     |
  | 其他押金   | otherDeposit            | Number | 否    | 其他押金，默认0      |
  | 物管费用   | propertyFee             | Number | 是    | 物业费，单位：元/月    |
  | 网络费用   | internetFee             | Number | 是    | 网费，单位：元/月     |
  | 水表底数   | waterMeterReading       | Number | 是    | 水表读数，单位：吨     |
  | 电表底数   | electricityMeterReading | Number | 是    | 电表读数，单位：度     |
  | 备注     | remark                  | String | 否    | 备注信息，最大200字符  |
  | 身份照片   | idCardImage             | String | 否    | 身份证照片URL      |

  2. 文件上传处理

  2.1 身份照片上传方案

  当前状态: 预留接口，暂未实现具体上传功能推荐方案:

  方案A: 单独的文件上传接口
  POST /api/file/upload
  Content-Type: multipart/form-data

  参数：
  - file: 身份证照片文件
  - type: "id_card"

  返回：
  {
    "status": 1,
    "data": {
      "url": "/uploads/contract/id_card_123456.jpg"
    }
  }

  方案B: 包含在主接口中
  - 前端先调用文件上传接口获取URL
  - 将返回的URL填入主接口的 idCardImage 字段

  2.2 文件要求

  - 格式: jpg/png
  - 大小限制: 最大2MB
  - 命名规范: id_card_{timestamp}.{ext}

  3. 响应数据格式

  3.1 成功响应

  {
    "status": 1,
    "data": {
      "id": 1,
      "contractNumber": "LC20241001123456",
      "houseId": 1,
      "tenantId": 1,
      "landlordId": 1,
      "createdAt": "2024-10-01 12:00:00"
    },
    "message": "入住登记成功"
  }

  3.2 错误响应

  验证错误 (HTTP 200, status: -1)
  {
    "status": -1,
    "message": "数据验证失败: 身份证号码格式不正确"
  }

  业务错误 (HTTP 200, status: -1)
  {
    "status": -1,
    "message": "房屋不存在或状态不可租赁"
  }

  系统错误 (HTTP 200, status: -1)
  {
    "status": -1,
    "message": "入住登记失败，请稍后重试"
  }

  3.3 具体错误类型

  | 错误场景    | HTTP状态码 | 响应消息               |
  |---------|---------|--------------------|
  | 参数验证失败  | 200     | "数据验证失败: {具体错误信息}" |
  | 房屋不存在   | 200     | "房屋不存在或状态不可租赁"     |
  | 身份证格式错误 | 200     | "身份证号码格式不正确"       |
  | 手机号格式错误 | 200     | "手机号码格式不正确"        |
  | 日期逻辑错误  | 200     | "合同结束日期必须晚于起始日期"   |
  | 身份证已存在  | 200     | "该身份证号码已被其他租客使用"   |
  | 系统异常    | 200     | "入住登记失败，请稍后重试"     |

  4. 业务流程说明

  4.1 房屋状态更新

  - 后端自动处理: 登记成功后，后端自动将房屋状态从"待租"(status=1)更新为"已租"(status=2)
  - 前端无需额外调用: 不需要前端单独调用状态更新接口

  4.2 数据关联处理

  - 租客处理:
    - 如果身份证号码不存在，自动创建新租客记录
    - 如果身份证号码已存在，更新租客姓名和手机号
  - 合同编号: 后端自动生成唯一合同编号，格式：LC + 年月日 + 时间戳
  - 关联关系: 自动建立房屋、租客、房东、合同之间的关联关系

  5. 相关接口列表

  5.1 核心业务接口

  | 接口       | 方法   | 路径                        | 说明        |
  |----------|------|---------------------------|-----------|
  | 租客入住登记   | POST | /api/lease/register       | 核心功能接口    |
  | 获取可租赁房屋  | GET  | /api/house/available      | 查询待租房屋列表  |
  | 检查房屋状态   | GET  | /api/house/checkAvailable | 验证房屋是否可租赁 |
  | 获取租赁合同列表 | GET  | /api/lease/list           | 查看已登记的合同  |

  5.2 辅助接口

  获取可租赁房屋列表
  GET /api/house/available?name=房屋名称&address=地址&size=10&index=1

  检查房屋状态
  GET /api/house/checkAvailable?houseId=1

  6. 数据验证规则

  6.1 前端建议验证

  // 身份证号码验证
  const idCardPattern = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;

  // 手机号码验证
  const phonePattern = /^1[3-9]\d{9}$/;

  // 月结日验证
  const paymentDays = [1, 15, 20];

  6.2 后端验证规则

  - 身份证号码: 18位，符合国家标准格式
  - 手机号码: 11位，符合中国手机号格式
  - 月结日: 只能是1日、15日、20日
  - 数值字段: 所有金额必须≥0
  - 日期: 结束日期必须晚于开始日期

  7. 开发调试建议

  7.1 开发环境

  - API基础地址: http://localhost:7001
  - 完整接口地址: http://localhost:7001/api/lease/register

  7.2 调试步骤

  1. 先调用获取可租赁房屋接口，获取房屋ID
  2. 调用房屋状态检查接口，确认房屋可租赁
  3. 准备完整的租客和租赁信息
  4. 调用入住登记接口
  5. 检查返回结果和房屋状态更新

  7.3 错误处理建议

  // 前端错误处理示例
  try {
    const response = await fetch('/api/lease/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.status === 1) {
      // 登记成功，刷新页面或跳转
      window.location.reload();
    } else {
      // 显示错误信息
      alert(result.message);
    }
  } catch (error) {
    console.error('请求失败:', error);
    alert('网络请求失败，请检查网络连接');
  }

  8. 注意事项

  1. 权限验证: 需要管理员权限的token
  2. 数据一致性: 使用事务处理，确保数据一致性
  3. 状态自动更新: 房屋状态由后端自动处理
  4. 身份证唯一性: 系统确保身份证号码的唯一性
  5. 合同编号: 系统自动生成，无需前端处理
  6. 文件上传: 当前为预留接口，需要配合文件上传功能使用

  这份文档包含了前端开发所需的所有接口信息、数据格式、验证规则和业务逻辑说明，可以直接用于前端开发对接。