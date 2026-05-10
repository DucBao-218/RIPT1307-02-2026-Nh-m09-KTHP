import { RunTimeLayoutConfig } from '@umijs/max';

export async function getInitialState(): Promise<{ user?: { id: number; role: string; fullName: string; email: string } }> {
  // In a real app, this might fetch the current user from the backend
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      return { user: JSON.parse(storedUser) };
    } catch (e) {
      return {};
    }
  }
  return {};
}

export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setInitialState({ ...initialState, user: undefined });
      window.location.href = '/login';
    },
  };
};
