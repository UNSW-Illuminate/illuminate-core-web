import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Illuminate admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root min-h-screen bg-black text-white">{children}</div>;
}
