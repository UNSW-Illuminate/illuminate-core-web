'use client';

export default function CenterTitle() {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="text-center max-w-2xl px-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
          Where imagination meets engineering to create experiences that don&apos;t just exist
        </h1>
      </div>
    </div>
  );
}
