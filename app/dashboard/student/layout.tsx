
import { requireRole } from '@/lib/actions/server';
import { ReactNode } from 'react';

interface TutorLayoutProps {
  children: ReactNode;
}

const StudentLayout = async ({ children }: TutorLayoutProps) => {
  await requireRole('student');
  return <>{children}</>;
};

export default StudentLayout;