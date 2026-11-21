
import { requireRole } from '@/lib/actions/server';
import { ReactNode } from 'react';

interface TutorLayoutProps {
  children: ReactNode;
}

const TutorLayout = async ({ children }: TutorLayoutProps) => {
  await requireRole('tutor');
  return <>{children}</>;
};

export default TutorLayout;