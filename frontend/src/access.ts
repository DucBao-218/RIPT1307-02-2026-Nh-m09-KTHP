export default function access(initialState: { user?: { role: string } } | undefined) {
  const { user } = initialState ?? {};
  return {
    canAdmin: user?.role === 'ADMIN',
  };
}
