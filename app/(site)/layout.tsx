import CustomCursor from '@/app/components/CustomCursor';
import { SmoothScrollProvider } from '@/app/components/SmoothScrollProvider';
import Footer from '@/app/components/Footer';
import NavBar from '@/app/components/NavBar';

// Marketing-site chrome (nav, custom cursor, smooth scroll, footer). Lives in
// the (site) route group so the /admin tool can opt out of all of it.
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
