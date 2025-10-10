● 房屋信息更新API对接文档

  接口信息

  - 接口地址: POST /api/house/update
  - 认证方式: JWT Token (需要携带在请求头中)
  - 数据格式: JSON

  请求头

  Authorization: Bearer {jwt_token}
  Content-Type: application/json

  请求参数

  必填参数

  | 参数名    | 类型     | 说明                |
  |--------|--------|-------------------|
  | id     | number | 房屋ID              |
  | userId | number | 房东ID (系统自动从JWT获取) |

  房屋基本信息

  | 参数名        | 类型     | 说明   | 示例         |
  |------------|--------|------|------------|
  | name       | string | 房屋名称 | "阳光小区三房一厅" |
  | addresInfo | string | 详细地址 | "XX街道XX号"  |
  | area       | string | 面积   | "120"      |
  | roomNumber | string | 房号   | "A-301"    |
  | note       | string | 备注   | "采光好，交通便利" |

  地理位置

  | 参数名          | 类型      | 说明   |
  |--------------|---------|------|
  | provinceId   | number  | 省份ID |
  | provinceName | string  | 省份名称 |
  | cityId       | number  | 城市ID |
  | cityName     | string  | 城市名称 |
  | areaId       | number  | 区域ID |
  | areaName     | string  | 区域名称 |
  | longitude    | decimal | 经度   |
  | latitude     | decimal | 纬度   |

  租金信息

  | 参数名           | 类型      | 说明    |
  |---------------|---------|-------|
  | price         | decimal | 实际租金  |
  | fakePrice     | decimal | 对外租金  |
  | depositNumber | number  | 押金月数  |
  | priceNumber   | number  | 每次付月数 |

  房屋属性

  | 参数名        | 类型     | 说明                                     |
  |------------|--------|----------------------------------------|
  | floor      | number | 楼层                                     |
  | toward     | number | 朝向 (1东 2西 3南 4北)                       |
  | layoutType | number | 户型 (1单间 2一房一厅 3两房一厅 4三房一厅 5四房一厅 6四房两厅) |
  | toilet     | number | 卫生间 (0没有 1独立 2公用)                      |
  | kitchen    | number | 厨房 (0没有 1独立 2公用)                       |
  | balcony    | number | 阳台 (1有 0没有)                            |

  配套费用

  | 参数名            | 类型      | 说明  |
  |----------------|---------|-----|
  | waterFee       | decimal | 水费  |
  | electricityFee | decimal | 电费  |
  | internetFee    | decimal | 网费  |
  | fuelFee        | decimal | 燃气费 |

  多媒体信息

  | 参数名      | 类型     | 说明                   |
  |----------|--------|----------------------|
  | headImg  | array  | 图片数组 (会被转为JSON字符串存储) |
  | videoUrl | string | 视频URL                |
  | lighting | string | 采光情况描述               |

  请求示例

  {
    "id": 1,
    "name": "阳光小区三房一厅",
    "addresInfo": "XX街道XX号",
    "area": "120",
    "roomNumber": "A-301",
    "price": 3500.00,
    "fakePrice": 4000.00,
    "depositNumber": 2,
    "priceNumber": 1,
    "floor": 15,
    "toward": 3,
    "layoutType": 3,
    "toilet": 1,
    "kitchen": 1,
    "balcony": 1,
    "waterFee": 50.00,
    "electricityFee": 100.00,
    "internetFee": 50.00,
    "fuelFee": 30.00,
    "headImg": ["image1.jpg", "image2.jpg"],
    "videoUrl": "http://example.com/video.mp4",
    "lighting": "南北通透，采光良好",
    "note": "精装修，家电齐全"
  }

  响应格式

  {
    "status": 1,
    "data": {
      // 更新后的房屋完整信息
    }
  }

  注意事项

  1. 所有金额字段使用小数形式，如：3500.00
  2. 图片数组需要以数组形式传递，后端会自动转换为JSON字符串
  3. 省市区ID和名称需要同时提供且保持一致
  4. 系统会自动从JWT中获取用户ID，无需手动传递
  5. 更新成功后返回完整的房屋信息对象