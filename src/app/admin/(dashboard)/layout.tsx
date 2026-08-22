import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import AdminShell from './admin-shell';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect('/admin/login');
  }

  return <AdminShell>{children}</AdminShell>;
}
