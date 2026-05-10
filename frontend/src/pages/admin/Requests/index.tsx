import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, message } from 'antd';
import axios from '@/utils/axios';

const Requests: React.FC = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/borrow');
      setRequests(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.put(`/borrow/${id}/status`, { status });
      message.success(`Đã cập nhật trạng thái thành ${status}`);
      fetchRequests();
    } catch (error) {}
  };

  const columns = [
    {
      title: 'Người mượn',
      dataIndex: ['student', 'fullName'],
      key: 'studentName',
    },
    {
      title: 'Thiết bị',
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
      title: 'Ngày trả dự kiến',
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
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => {
        if (record.status === 'PENDING') {
          return (
            <Space size="middle">
              <Button type="primary" onClick={() => updateStatus(record.id, 'APPROVED')}>Duyệt</Button>
              <Button danger onClick={() => updateStatus(record.id, 'REJECTED')}>Từ chối</Button>
            </Space>
          );
        }
        if (record.status === 'APPROVED' || record.status === 'OVERDUE') {
          return (
            <Button type="primary" style={{ background: 'green' }} onClick={() => updateStatus(record.id, 'RETURNED')}>
              Xác nhận Đã trả
            </Button>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div>
      <h2>Quản Lý Yêu Cầu Mượn Đồ</h2>
      <Table columns={columns} dataSource={requests} rowKey="id" loading={loading} />
    </div>
  );
};

export default Requests;
