import CustomCursor from '@/app/components/CustomCursor';
import { SmoothScrollProvider } from '@/app/components/SmoothScrollProvider';
import Footer from '@/app/components/Footer';
import NavBar from '@/app/components/NavBar';

// Marketing-site chrome shared by every public route.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <NavBar />
      {children}
      <Footer />
    </SmoothScrollProvider>
  );
}
