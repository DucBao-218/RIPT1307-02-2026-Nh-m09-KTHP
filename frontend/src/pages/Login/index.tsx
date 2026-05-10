import React, { useState } from 'react';
import { Form, Input, Button, Card, Tabs, message, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { useModel, history } from '@umijs/max';
import axios from '@/utils/axios';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const { setInitialState } = useModel('@@initialState');

  const onLogin = async (values: any) => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', values);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setInitialState((s: any) => ({ ...s, user: res.data.user }));
      message.success('Đăng nhập thành công!');
      
      if (res.data.user.role === 'ADMIN') {
        history.push('/admin/dashboard');
      } else {
        history.push('/student/equipments');
      }
    } catch (error) {
      // Error is handled in axios interceptor
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values: any) => {
    setLoading(true);
    try {
      await axios.post('/auth/register', values);
      message.success('Đăng ký thành công, vui lòng đăng nhập!');
      setActiveTab('login');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Hệ Thống Quản Lý Thiết Bị</h2>
        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <Tabs.TabPane tab="Đăng Nhập" key="login">
            <Form name="login" onFinish={onLogin} size="large">
              <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}>
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Đăng Nhập
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Đăng Ký" key="register">
            <Form name="register" onFinish={onRegister} size="large">
              <Form.Item name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                <Input prefix={<IdcardOutlined />} placeholder="Họ và Tên" />
              </Form.Item>
              <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}>
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
              </Form.Item>
              <Form.Item name="role" initialValue="STUDENT" rules={[{ required: true }]}>
                <Select placeholder="Chọn vai trò">
                  <Select.Option value="STUDENT">Sinh Viên</Select.Option>
                  <Select.Option value="ADMIN">Quản Trị Viên</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Đăng Ký
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
