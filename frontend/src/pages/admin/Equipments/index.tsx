import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space, Popconfirm } from 'antd';
import axios from '@/utils/axios';

const Equipments: React.FC = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const fetchEquipments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/equipments');
      setEquipments(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/equipments/${id}`);
      message.success('Đã xóa thiết bị!');
      fetchEquipments();
    } catch (error) {}
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onSave = async (values: any) => {
    try {
      if (editingId) {
        await axios.put(`/equipments/${editingId}`, values);
        message.success('Cập nhật thành công!');
      } else {
        await axios.post('/equipments', values);
        message.success('Thêm mới thành công!');
      }
      setIsModalVisible(false);
      fetchEquipments();
    } catch (error) {}
  };

  const columns = [
    { title: 'Tên thiết bị', dataIndex: 'name', key: 'name' },
    { title: 'Tổng số lượng', dataIndex: 'totalQuantity', key: 'totalQuantity' },
    { title: 'Còn lại', dataIndex: 'availableQuantity', key: 'availableQuantity' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Quản Lý Thiết Bị</h2>
        <Button type="primary" onClick={handleAdd}>Thêm thiết bị</Button>
      </div>
      <Table columns={columns} dataSource={equipments} rowKey="id" loading={loading} />

      <Modal title={editingId ? 'Sửa thiết bị' : 'Thêm thiết bị'} open={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={onSave}>
          <Form.Item name="name" label="Tên thiết bị" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="totalQuantity" label="Tổng số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          {editingId && (
            <Form.Item name="availableQuantity" label="Số lượng còn lại" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          )}
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="AVAILABLE">Khả dụng (AVAILABLE)</Select.Option>
              <Select.Option value="MAINTENANCE">Bảo trì (MAINTENANCE)</Select.Option>
              <Select.Option value="UNAVAILABLE">Không khả dụng (UNAVAILABLE)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Lưu thay đổi</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Equipments;
