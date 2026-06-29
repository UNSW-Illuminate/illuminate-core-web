import { projectSeeds } from '@/app/projects-data';
import AdminDashboard from './AdminDashboard';

// Access is gated by middleware.ts (redirects to /admin/login without a session).
export default function AdminPage() {
  return <AdminDashboard seed={projectSeeds} />;
}
