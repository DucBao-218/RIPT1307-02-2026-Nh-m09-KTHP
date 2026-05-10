import React, { useEffect, useState } from 'react';
import { Table, Card, Alert, List, Tag } from 'antd';
import axios from '@/utils/axios';

const Dashboard: React.FC = () => {
  const [data, setData] = useState([]);
  const [overdueRequests, setOverdueRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [topRes, borrowRes] = await Promise.all([
          axios.get('/borrow/top-borrowed'),
          axios.get('/borrow')
        ]);
        setData(topRes.data);
        
        // Filter overdue requests
        const overdue = borrowRes.data.filter((r: any) => r.status === 'OVERDUE');
        setOverdueRequests(overdue);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
      {overdueRequests.length > 0 && (
        <Card title={<span style={{ color: 'red' }}>⚠️ Cảnh Báo: Các đơn mượn quá hạn chưa trả</span>} style={{ marginBottom: 24, border: '1px solid red' }}>
          <List
            itemLayout="horizontal"
            dataSource={overdueRequests}
            renderItem={(item: any) => (
              <List.Item>
                <List.Item.Meta
                  title={<strong>Thiết bị: {item.equipment?.name}</strong>}
                  description={
                    <div>
                      <p style={{ margin: 0 }}>Sinh viên: {item.student?.fullName} ({item.student?.email})</p>
                      <p style={{ margin: 0, color: 'red' }}>Hẹn trả: {new Date(item.returnDate).toLocaleDateString()}</p>
                    </div>
                  }
                />
                <Tag color="orange">QUÁ HẠN</Tag>
              </List.Item>
            )}
          />
        </Card>
      )}

      <Card title="Top Thiết Bị Được Mượn Nhiều Nhất Tháng">
        <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={false} />
      </Card>
    </div>
  );
};

export default Dashboard;
