'use client';

import AnimatedTextLink from './ui/AnimatedTextLink';

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
          <AnimatedTextLink
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm text-white/80 transition-colors duration-300 hover:text-white"
          >
            {item}
          </AnimatedTextLink>
        ))}
      </div>
    </nav>
  );
}
