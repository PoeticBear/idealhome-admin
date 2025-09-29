# 房屋统计数据接口需求文档

## 接口基本信息

- **接口URL**: `GET /api/house/statistics`
- **接口名称**: 房屋统计数据接口
- **接口描述**: 获取房屋相关的统计数据，用于前端展示统计卡片

## 前端需求分析

根据前端页面设计，需要展示以下统计数据：

1. **总房屋数** - 所有房屋的总数量
2. **已出租** - 状态为已租的房屋数量 (status = 2)
3. **待出租** - 状态为待租的房屋数量 (status = 1)
4. **出租率** - 已出租房屋占总房屋数的百分比

## 数据库状态定义

根据前端代码分析，房屋状态定义如下：
- `status = 1`: 待租 (红色标识)
- `status = 2`: 已租 (绿色标识)

## 接口请求参数

- **请求方式**: GET
- **参数**: 无
- **认证**: 需要用户登录认证

## 接口返回数据结构

```json
{
  "status": 1,
  "message": "success",
  "data": {
    "totalHouses": 100,
    "rentedHouses": 75,
    "availableHouses": 25,
    "rentalRate": 75.0
  }
}
```

### 返回字段说明

| 字段名 | 类型 | 说明 | 计算方式 |
|--------|------|------|----------|
| totalHouses | int | 总房屋数 | COUNT(*) FROM houses |
| rentedHouses | int | 已出租房屋数 | COUNT(*) FROM houses WHERE status = 2 |
| availableHouses | int | 待出租房屋数 | COUNT(*) FROM houses WHERE status = 1 |
| rentalRate | float | 出租率百分比 | (rentedHouses / totalHouses) * 100 |

## 业务逻辑

1. **数据计算规则**:
   - 总房屋数：统计所有房屋记录
   - 已出租：统计状态为 2 的房屋
   - 待出租：统计状态为 1 的房屋
   - 出租率：已出租房屋数 / 总房屋数 × 100

2. **数据精度要求**:
   - 出租率保留一位小数
   - 数量统计为整数

3. **异常处理**:
   - 当总房屋数为 0 时，出租率应返回 0
   - 当没有数据时，所有字段返回 0

## 错误处理

```json
{
  "status": 0,
  "message": "获取统计数据失败",
  "data": null
}
```

## 数据库表结构建议

假设房屋表结构如下：

```sql
CREATE TABLE houses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) COMMENT '房屋名称',
  status TINYINT COMMENT '房屋状态：1=待租，2=已租',
  -- 其他字段...
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## SQL查询示例

```sql
SELECT
  COUNT(*) as totalHouses,
  SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) as rentedHouses,
  SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as availableHouses,
  ROUND(SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) as rentalRate
FROM houses
WHERE deleted_at IS NULL; -- 如果有软删除
```

## 前端集成说明

前端已在以下位置完成集成：

1. **API文件**: `src/api/house.ts`
   - 新增 `getHouseStatistics` 函数

2. **页面文件**: `src/views/house/houseList.vue`
   - 添加统计数据展示区域
   - 实现数据获取和展示逻辑
   - 响应式布局适配

3. **展示方式**:
   - 使用卡片式布局
   - 包含图标、标题和数值
   - 支持响应式设计

## 后续扩展建议

1. **增加更多统计维度**:
   - 按地区统计
   - 按价格区间统计
   - 按时间统计

2. **增加历史数据对比**:
   - 环比数据
   - 同比数据

3. **增加图表展示**:
   - 趋势图
   - 饼图
   - 柱状图