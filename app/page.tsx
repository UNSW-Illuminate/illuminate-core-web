import InteractiveGradient from './components/InteractiveGradient';
import CenterTitle from './components/CenterTitle';

export default function Home() {
  return (
    <main className="relative w-full">
      <InteractiveGradient />
      <div className="relative z-10 text-white w-full">
        <section className="min-h-screen flex items-center justify-center">
          <CenterTitle />
        </section>

        <section className="min-h-screen flex items-center justify-center px-6">
          <h2 className="text-center text-5xl md:text-7xl font-light tracking-tight text-white/95">
            Showcase
          </h2>
        </section>

        <section className="min-h-screen flex items-center justify-center px-6">
          <h2 className="text-center text-5xl md:text-7xl font-light tracking-tight text-white/95">
            Past Projects
          </h2>
        </section>

        <section className="min-h-screen flex items-center justify-center px-6">
          <h2 className="text-center text-5xl md:text-7xl font-light tracking-tight text-white/95">
            Meet The Team
          </h2>
        </section>

        <section className="min-h-screen flex items-center justify-center px-6">
          <h2 className="text-center text-5xl md:text-7xl font-light tracking-tight text-white/95">
            Contact
          </h2>
        </section>
      </div>
    </main>
  );
}
