import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import axios from '@/utils/axios';

const History: React.FC = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/borrow/my-history');
        setHistory(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const columns = [
    {
      title: 'Tên thiết bị',
      dataIndex: ['equipment', 'name'],
      key: 'equipmentName',
    },
    {
      title: 'Ngày mượn',
      dataIndex: 'borrowDate',
      key: 'borrowDate',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Ngày trả',
      dataIndex: 'returnDate',
      key: 'returnDate',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'APPROVED') color = 'blue';
        if (status === 'REJECTED') color = 'red';
        if (status === 'RETURNED') color = 'green';
        if (status === 'OVERDUE') color = 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div>
      <h2>Lịch Sử Mượn Đồ</h2>
      <Table columns={columns} dataSource={history} rowKey="id" loading={loading} />
    </div>
  );
};

export default History;
