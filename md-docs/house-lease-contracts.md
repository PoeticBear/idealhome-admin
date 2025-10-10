  1. 查询单个房屋的租赁合同历史

  接口: GET /api/lease/byHouse
  参数:
  {
    houseId: 1  // 房屋ID
  }

  示例请求:
  // 前端调用示例
  const response = await fetch(`/api/lease/byHouse?houseId=${houseId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await response.json();

  返回数据格式:
  {
    "status": 1,
    "data": [
      {
        "id": 1,
        "contractNumber": "LC20241001123456",
        "houseId": 1,
        "tenantId": 1,
        "landlordId": 1,
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
        "status": 1,
        "createdAt": "2024-10-01 12:00:00",
        "updatedAt": "2024-10-01 12:00:00",
        "tenant": {
          "id": 1,
          "realName": "张三",
          "phone": "13800138000",
          "idCardNumber": "110101199001011234"
        }
      }
    ]
  }

  2. 获取房屋详情（包含租赁信息）

  接口: GET /api/house/detailWithLease
  参数:
  {
    id: 1  // 房屋ID
  }

  示例请求:
  const response = await fetch(`/api/house/detailWithLease?id=${houseId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await response.json();

  返回数据格式:
  {
    "status": 1,
    "data": {
      "id": 1,
      "name": "阳光花园3栋501",
      "status": 2,
      "landlord": {
        "id": 1,
        "name": "房东姓名",
        "phone": "13900139000"
      },
      "leaseContracts": [
        {
          "id": 1,
          "contractNumber": "LC20241001123456",
          "leaseStartDate": "2024-01-01",
          "leaseEndDate": "2024-12-31",
          "status": 1,
          "tenant": {
            "id": 1,
            "realName": "张三",
            "phone": "13800138000"
          }
        }
      ]
    }
  }

  3. 查询所有租赁合同列表（支持按房屋筛选）

  接口: GET /api/lease/list
  参数:
  {
    houseName: "阳光花园",  // 可选，按房屋名称筛选
    size: 10,              // 可选，分页大小
    index: 1,              // 可选，页码
    status: 1              // 可选，合同状态筛选
  }

  示例请求:
  const response = await fetch('/api/lease/list?houseName=阳光花园&size=10&index=1', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await response.json();

  4. 获取具体合同详情

  接口: GET /api/lease/detail
  参数:
  {
    id: 1  // 合同ID
  }

  示例请求:
  const response = await fetch(`/api/lease/detail?id=${contractId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  5. 前端使用建议

  5.1 在房屋详情页面显示租赁信息

  // 获取房屋详情及租赁信息
  async function loadHouseWithLeaseInfo(houseId) {
    try {
      const response = await fetch(`/api/house/detailWithLease?id=${houseId}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      const result = await response.json();

      if (result.status === 1) {
        const house = result.data;
        const currentLease = house.leaseContracts.find(
          contract => contract.status === 1
        );

        if (currentLease) {
          // 显示当前租赁信息
          displayCurrentLease(currentLease);
        }

        // 显示租赁历史
        displayLeaseHistory(house.leaseContracts);
      }
    } catch (error) {
      console.error('获取房屋租赁信息失败:', error);
    }
  }

  5.2 检查房屋租赁状态

  // 检查房屋是否可租赁
  async function checkHouseAvailable(houseId) {
    try {
      const response = await fetch(`/api/house/checkAvailable?houseId=${houseId}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      const result = await response.json();

      return result.status === 1 ? result.data.available : false;
    } catch (error) {
      console.error('检查房屋状态失败:', error);
      return false;
    }
  }

  // 使用示例
  const isAvailable = await checkHouseAvailable(houseId);
  if (isAvailable) {
    // 显示"租客入住登记"按钮
    showRegisterButton();
  } else {
    // 显示房屋已租状态
    showLeasedStatus();
  }

  6. 数据状态说明

  合同状态 (status):
  - 1: 生效中
  - 2: 已结束
  - 3: 已取消

  房屋状态 (status):
  - 1: 待租
  - 2: 已租
  - 3: 删除

  通过这些接口，前端可以完整地查询和展示房屋的租赁合同数据，包括当前租赁状态、历史合同记录等所有相关信息。