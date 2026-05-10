import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Hệ Thống Mượn Đồ',
    locale: false,
  },
  locale: {
    default: 'vi-VN',
    antd: true,
    title: false,
    baseNavigator: true,
    baseSeparator: '-',
  },
  routes: [
    {
      path: '/login',
      component: './Login',
      layout: false,
    },
    {
      path: '/',
      redirect: '/student/equipments',
    },
    {
      path: '/student',
      name: 'Sinh viên',
      routes: [
        { path: '/student/equipments', name: 'Mượn thiết bị', component: './student/Equipments' },
        { path: '/student/history', name: 'Lịch sử mượn', component: './student/History' },
      ],
    },
    {
      path: '/admin',
      name: 'Admin',
      access: 'canAdmin',
      routes: [
        { path: '/admin/dashboard', name: 'Thống kê', component: './admin/Dashboard' },
        { path: '/admin/equipments', name: 'Quản lý thiết bị', component: './admin/Equipments' },
        { path: '/admin/requests', name: 'Duyệt yêu cầu', component: './admin/Requests' },
      ],
    },
  ],
  npmClient: 'npm',
});
