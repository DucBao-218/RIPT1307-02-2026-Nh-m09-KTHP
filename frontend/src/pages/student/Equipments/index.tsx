import React, { useEffect, useState } from 'react';
import { Card, Button, List, Tag, Modal, Form, DatePicker, message } from 'antd';
import axios from '@/utils/axios';

const Equipments: React.FC = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEq, setSelectedEq] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchEquipments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/equipments/available');
      setEquipments(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const showBorrowModal = (eq: any) => {
    setSelectedEq(eq);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedEq(null);
  };

  const onBorrow = async (values: any) => {
    try {
      await axios.post('/borrow', {
        equipmentId: selectedEq.id,
        borrowDate: values.dates[0].toDate(),
        returnDate: values.dates[1].toDate(),
      });
      message.success('Đã gửi yêu cầu mượn thành công. Vui lòng chờ duyệt!');
      handleCancel();
      fetchEquipments();
    } catch (error) {
      // Error handled by interceptor
    }
  };

  return (
    <div>
      <h2>Danh Sách Thiết Bị Khả Dụng</h2>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={equipments}
        loading={loading}
        renderItem={(item: any) => (
          <List.Item>
            <Card title={item.name} extra={<Tag color="green">Có sẵn: {item.availableQuantity}</Tag>}>
              <p>Trạng thái: <Tag color="blue">{item.status}</Tag></p>
              <Button type="primary" onClick={() => showBorrowModal(item)}>Đăng ký mượn</Button>
            </Card>
          </List.Item>
        )}
      />

      <Modal title={`Mượn thiết bị: ${selectedEq?.name}`} open={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={onBorrow}>
          <Form.Item name="dates" label="Thời gian mượn (Từ ngày - Đến ngày)" rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}>
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Gửi Yêu Cầu</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Equipments;
