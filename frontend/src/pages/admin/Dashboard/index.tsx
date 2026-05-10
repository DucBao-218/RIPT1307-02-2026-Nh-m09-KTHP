import React, { useEffect, useState } from 'react';
import { Table, Card } from 'antd';
import axios from '@/utils/axios';

const Dashboard: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopBorrowed = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/borrow/top-borrowed');
        setData(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchTopBorrowed();
  }, []);

  const columns = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lượt mượn trong tháng',
      dataIndex: 'borrowCount',
      key: 'borrowCount',
    },
    {
      title: 'Tổng số lượng',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
    },
    {
      title: 'Đang rảnh',
      dataIndex: 'availableQuantity',
      key: 'availableQuantity',
    },
  ];

  return (
    <div>
      <Card title="Top Thiết Bị Được Mượn Nhiều Nhất Tháng">
        <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} />
      </Card>
    </div>
  );
};

export default Dashboard;
