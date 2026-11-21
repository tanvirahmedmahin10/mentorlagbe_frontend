
import { requireRole } from '@/lib/actions/server';
import { ReactNode } from 'react';

interface TutorLayoutProps {
  children: ReactNode;
}

const AdminLayout = async ({ children }: TutorLayoutProps) => {
  await requireRole('admin');
  return <>{children}</>;
};

export default AdminLayout;