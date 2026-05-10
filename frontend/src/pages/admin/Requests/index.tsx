import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, message, Modal, Descriptions } from 'antd';
import axios from '@/utils/axios';

const Requests: React.FC = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

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
      if (selectedRequest && selectedRequest.id === id) {
        setIsModalVisible(false); // Close modal if open
      }
    } catch (error) {}
  };

  const showDetails = (record: any) => {
    setSelectedRequest(record);
    setIsModalVisible(true);
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
        return (
          <Space size="middle">
            <Button onClick={() => showDetails(record)}>Xem chi tiết</Button>
            {record.status === 'PENDING' && (
              <>
                <Button type="primary" onClick={() => updateStatus(record.id, 'APPROVED')}>Duyệt</Button>
                <Button danger onClick={() => updateStatus(record.id, 'REJECTED')}>Từ chối</Button>
              </>
            )}
            {(record.status === 'APPROVED' || record.status === 'OVERDUE') && (
              <Button type="primary" style={{ background: 'green' }} onClick={() => updateStatus(record.id, 'RETURNED')}>
                Xác nhận trả
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <h2>Quản Lý Yêu Cầu Mượn Đồ</h2>
      <Table columns={columns} dataSource={requests} rowKey="id" loading={loading} />

      <Modal 
        title="Chi tiết yêu cầu mượn đồ" 
        open={isModalVisible} 
        onCancel={() => setIsModalVisible(false)} 
        footer={null}
        width={600}
      >
        {selectedRequest && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mã yêu cầu">#{selectedRequest.id}</Descriptions.Item>
            <Descriptions.Item label="Người mượn">{selectedRequest.student?.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email liên hệ">{selectedRequest.student?.email}</Descriptions.Item>
            <Descriptions.Item label="Thiết bị mượn">{selectedRequest.equipment?.name}</Descriptions.Item>
            <Descriptions.Item label="Số lượng kho hiện tại">{selectedRequest.equipment?.availableQuantity} / {selectedRequest.equipment?.totalQuantity}</Descriptions.Item>
            <Descriptions.Item label="Ngày mượn">{new Date(selectedRequest.borrowDate).toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label="Ngày hẹn trả">{new Date(selectedRequest.returnDate).toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái hiện tại">
              <Tag color={
                selectedRequest.status === 'APPROVED' ? 'blue' : 
                selectedRequest.status === 'REJECTED' ? 'red' : 
                selectedRequest.status === 'RETURNED' ? 'green' : 
                selectedRequest.status === 'OVERDUE' ? 'orange' : 'default'
              }>{selectedRequest.status}</Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          {selectedRequest?.status === 'PENDING' && (
            <>
              <Button danger onClick={() => updateStatus(selectedRequest.id, 'REJECTED')}>Từ chối</Button>
              <Button type="primary" onClick={() => updateStatus(selectedRequest.id, 'APPROVED')}>Duyệt yêu cầu</Button>
            </>
          )}
          {(selectedRequest?.status === 'APPROVED' || selectedRequest?.status === 'OVERDUE') && (
            <Button type="primary" style={{ background: 'green' }} onClick={() => updateStatus(selectedRequest.id, 'RETURNED')}>
              Xác nhận Đã trả
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Requests;
