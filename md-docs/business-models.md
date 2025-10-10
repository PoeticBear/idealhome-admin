1. 管理员用户模型 (adminUser)

  - 表名: admin_user
  - 主要字段:
    - id: 主键
    - name: 用户名称
    - phone: 手机号
    - password: 密码
    - status: 状态 (1:正常, 2:停用, 3:删除)
    - headImg: 头像
    - remark: 备注

  2. 房东用户模型 (landlordUser)

  - 表名: landlord_user
  - 主要字段:
    - id: 主键
    - name: 用户名称
    - phone: 手机号
    - password: 密码
    - openId: 微信openId
    - unionId: 微信unionId
    - sessionKey: 微信sessionKey
    - sourceType: 用户来源 (1:微信)
    - status: 状态 (1:正常, 2:停用, 3:删除)
    - headImg: 头像
    - remark: 备注
  - 关联关系: 与房屋模型是一对多关系 (一个房东可以有多个房屋)

  3. 租客用户模型 (tenantsUser)

  - 表名: tenants_user
  - 主要字段:
    - id: 主键
    - name: 用户名称
    - phone: 手机号
    - password: 密码
    - openId: 微信openId
    - unionId: 微信unionId
    - sessionKey: 微信sessionKey
    - sourceType: 用户来源 (1:微信)
    - status: 状态 (1:正常, 2:停用, 3:删除)
    - headImg: 头像
    - remark: 备注
  - 关联关系: 当前版本中未设置关联关系

  4. 房屋模型 (house)

  - 表名: house
  - 主要字段:
    - id: 主键
    - name: 房子名称
    - userId: 房东id (外键)
    - parentId: 上级房间id
    - 地理位置: provinceId/cityId/areaId + 省市区名称 + 详细地址 + 经纬度
    - 房屋信息: 面积、租金、对外租金、楼层、朝向
    - 房屋配置: 卫生间、厨房、阳台
    - 费用信息: 水费、电费、网费、燃气费
    - 其他: 房号、户型、采光情况、视频URL、图片
    - status: 状态 (1:待租, 2:已租, 3:删除)
  - 关联关系: 与房东模型是多对一关系 (多个房屋属于一个房东)