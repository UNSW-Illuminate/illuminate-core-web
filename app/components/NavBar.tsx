'use client';

export default function NavBar() {
  const navItems = ['Projects', 'About', 'Team', 'Contact'];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 ">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <img src="/logospin.svg" alt="Illuminate Logo" className="w-8 h-8" />
        <div className="text-white text-xl font-medium">illuminate</div>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-8">
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="nav-link text-white/80 hover:text-white transition-colors duration-300 text-sm  tracking-wider"
          >
            {item}
          </a>
        ))}
      </div>
    </nav>
  );
}
