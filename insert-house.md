添加房屋信息API对接文档

  接口信息

  - 接口地址: POST /api/house/insert
  - 认证方式: JWT Token (需要携带在请求头中)
  - 数据格式: JSON

  请求头

  Authorization: Bearer {jwt_token}
  Content-Type: application/json

  请求参数

  房屋基本信息

  | 参数名        | 类型     | 必填  | 说明   | 示例         |
  |------------|--------|-----|------|------------|
  | name       | string | 是   | 房屋名称 | "阳光小区三房一厅" |
  | addresInfo | string | 否   | 详细地址 | "XX街道XX号"  |
  | area       | string | 否   | 面积   | "120"      |
  | roomNumber | string | 否   | 房号   | "A-301"    |
  | note       | string | 否   | 备注   | "采光好，交通便利" |

  地理位置

  | 参数名          | 类型      | 必填  | 说明   |
  |--------------|---------|-----|------|
  | provinceId   | number  | 是   | 省份ID |
  | provinceName | string  | 是   | 省份名称 |
  | cityId       | number  | 是   | 城市ID |
  | cityName     | string  | 是   | 城市名称 |
  | areaId       | number  | 是   | 区域ID |
  | areaName     | string  | 是   | 区域名称 |
  | longitude    | decimal | 否   | 经度   |
  | latitude     | decimal | 否   | 纬度   |

  租金信息

  | 参数名           | 类型      | 必填  | 说明         |
  |---------------|---------|-----|------------|
  | price         | decimal | 否   | 实际租金 (默认0) |
  | fakePrice     | decimal | 否   | 对外租金 (默认0) |
  | depositNumber | number  | 否   | 押金月数       |
  | priceNumber   | number  | 否   | 每次付月数      |

  房屋属性

  | 参数名        | 类型     | 必填  | 说明                                     |
  |------------|--------|-----|----------------------------------------|
  | parentId   | number | 是   | 上级房间ID (根级传0或1)                        |
  | floor      | number | 否   | 楼层                                     |
  | toward     | number | 否   | 朝向 (1东 2西 3南 4北)                       |
  | layoutType | number | 否   | 户型 (1单间 2一房一厅 3两房一厅 4三房一厅 5四房一厅 6四房两厅) |
  | toilet     | number | 否   | 卫生间 (0没有 1独立 2公用)                      |
  | kitchen    | number | 否   | 厨房 (0没有 1独立 2公用)                       |
  | balcony    | number | 否   | 阳台 (1有 0没有)                            |

  配套费用

  | 参数名            | 类型      | 必填  | 说明        |
  |----------------|---------|-----|-----------|
  | waterFee       | decimal | 否   | 水费 (默认0)  |
  | electricityFee | decimal | 否   | 电费 (默认0)  |
  | internetFee    | decimal | 否   | 网费 (默认0)  |
  | fuelFee        | decimal | 否   | 燃气费 (默认0) |

  多媒体信息

  | 参数名      | 类型     | 必填  | 说明           |
  |----------|--------|-----|--------------|
  | headImg  | array  | 否   | 图片数组         |
  | videoUrl | string | 否   | 视频URL (默认空)  |
  | lighting | string | 否   | 采光情况描述 (默认空) |

  请求示例

  {
    "name": "阳光小区三房一厅",
    "parentId": 0,
    "provinceId": 110000,
    "provinceName": "北京市",
    "cityId": 110100,
    "cityName": "北京市",
    "areaId": 110101,
    "areaName": "东城区",
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
    "data": 123
  }

  响应字段说明

  | 字段名    | 类型     | 说明          |
  |--------|--------|-------------|
  | status | number | 状态码 (1表示成功) |
  | data   | number | 新创建的房屋ID    |

  注意事项

  1. name、省市区信息、parentId 为必填字段
  2. 系统会自动从JWT中获取用户ID作为房东ID
  3. 所有金额和费用字段默认为0，可不传
  4. 字符串字段默认为空，可不传
  5. 图片数组需要以数组形式传递，后端会自动转换为JSON字符串
  6. 省市区ID和名称需要同时提供且保持一致
  7. parentId 用于构建房屋层级关系，根级房屋可传0或1
  8. 新创建的房屋默认状态为"待租" (status: 1)