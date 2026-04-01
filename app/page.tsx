import InteractiveGradient from './components/InteractiveGradient';
import CenterTitle from './components/CenterTitle';

export default function Home() {
  const pastProjects = [
    {
      id: 1,
      title: 'Immersive VR Experience',
      description: 'A groundbreaking virtual reality installation exploring digital art and interaction.',
      year: 2024,
    },
    {
      id: 2,
      title: 'Interactive Light Installation',
      description: 'Real-time responsive light art that reacts to visitor movement and sound.',
      year: 2024,
    },
    {
      id: 3,
      title: 'Motion Capture Performance',
      description: 'Live performance blending motion capture technology with generative visuals.',
      year: 2023,
    },
    {
      id: 4,
      title: 'Neural Network Visualization',
      description: 'Visual interpretation of machine learning processes in real-time.',
      year: 2023,
    },
  ];

  const teamMembers = [
    { name: 'Alex Chen', role: 'Creative Director', focus: 'Visual Design' },
    { name: 'Jordan Dev', role: 'Lead Developer', focus: 'WebGL & Shaders' },
    { name: 'Casey Moore', role: 'Motion Designer', focus: 'Animation' },
    { name: 'Morgan Lee', role: 'Technical Artist', focus: 'VFX & Rendering' },
    { name: 'Riley Park', role: 'Producer', focus: 'Project Management' },
    { name: 'Taylor Swift', role: 'Sound Designer', focus: 'Audio Integration' },
  ];

  return (
    <main className="relative w-full">
      <InteractiveGradient />
      <div className="relative z-10 text-white w-full">
        <CenterTitle />

        {/* Hero Section */}
        <section className="min-h-screen px-6 pb-16 md:px-12 lg:px-20 flex items-center">
          <div className="mx-auto flex h-full w-full max-w-5xl items-center">
            <div className="rounded-2xl border border-white/20 bg-black/30 p-8 backdrop-blur-sm md:p-12">
              <p className="text-sm uppercase tracking-[0.2em] text-white/70">Showcase</p>
              <h2 className="mt-4 text-3xl font-light md:text-5xl">Built for motion, depth, and play</h2>
              <p className="mt-6 max-w-2xl text-base text-white/80 md:text-lg">
                Scroll to move through the narrative while the live shader remains persistent in the background.
                This keeps the visual identity continuous across the entire experience.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="min-h-screen px-6 pb-24 md:px-12 lg:px-20 flex items-center">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3 w-full">
            {['Immersive visuals', 'Interactive systems', 'Real-time rendering'].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-white/15 bg-black/25 p-6 backdrop-blur-sm"
              >
                <h3 className="text-xl font-medium">{item}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  A section placeholder ready for your project content, case studies, and event highlights.
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Past Projects Section */}
        <section className="min-h-screen px-6 py-24 md:px-12 lg:px-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-16">
              <p className="text-sm uppercase tracking-[0.2em] text-white/70">Our Work</p>
              <h2 className="mt-4 text-4xl font-light md:text-5xl">Past Projects</h2>
              <p className="mt-6 text-base text-white/75">
                Explore our collection of innovative digital experiences and installations from recent years.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {pastProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-white/20 bg-black/40 p-8 backdrop-blur-sm hover:border-white/40 transition-all duration-300"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <h3 className="text-2xl font-medium">{project.title}</h3>
                    <span className="text-sm text-white/50">{project.year}</span>
                  </div>
                  <p className="text-base leading-relaxed text-white/80">{project.description}</p>
                  <div className="mt-6 flex gap-3">
                    <button className="px-4 py-2 rounded-lg border border-white/30 text-sm hover:bg-white/10 transition-colors">
                      View More
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-white/30 text-sm hover:bg-white/10 transition-colors">
                      Live Demo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="min-h-screen px-6 py-24 md:px-12 lg:px-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-16">
              <p className="text-sm uppercase tracking-[0.2em] text-white/70">Our People</p>
              <h2 className="mt-4 text-4xl font-light md:text-5xl">Meet the Team</h2>
              <p className="mt-6 text-base text-white/75">
                Talented creatives and developers working together to push the boundaries of digital art.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="rounded-2xl border border-white/15 bg-black/35 p-6 backdrop-blur-sm hover:border-white/30 transition-all duration-300"
                >
                  <div className="mb-4 h-32 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                    <span className="text-white/30 text-sm">Avatar</span>
                  </div>
                  <h3 className="text-lg font-medium">{member.name}</h3>
                  <p className="mt-1 text-sm text-white/60">{member.role}</p>
                  <p className="mt-3 text-xs uppercase tracking-wider text-white/50">{member.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <section className="min-h-screen px-6 py-24 md:px-12 lg:px-20 flex items-center">
          <div className="mx-auto max-w-2xl text-center w-full">
            <h2 className="text-4xl font-light md:text-5xl">Let&apos;s Create Together</h2>
            <p className="mt-6 text-base text-white/75">
              Interested in collaborating or learning more about our work? Get in touch with our team.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button className="px-8 py-3 rounded-lg border border-white/40 hover:bg-white/10 transition-colors font-medium">
                Contact Us
              </button>
              <button className="px-8 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium">
                View Portfolio
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
