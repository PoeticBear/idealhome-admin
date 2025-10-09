● 获取省市区数据API对接文档

  接口信息

  - 接口地址: GET /api/house/getCityCode
  - 认证方式: JWT Token (需要携带在请求头中)
  - 请求方式: GET

  请求头

  Authorization: Bearer {jwt_token}

  请求参数

  无需任何参数

  
  响应字段说明

  | 字段名     | 类型     | 说明                 |
  |---------|--------|--------------------|
  | status  | number | 状态码 (1表示成功，-1表示失败) |
  | data    | object | 省市区三级联动数据对象        |
  | message | string | 错误信息 (仅在失败时返回)     |

  错误响应示例

  {
    "status": -1,
    "data": [],
    "message": "地址获取失败"
  }

  

 