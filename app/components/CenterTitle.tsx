'use client';

export default function CenterTitle() {
  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pointer-events-none">
      <div className="text-center max-w-2xl px-8 flex flex-col items-center gap-8">
        <img src="/wordmark.svg" alt="Illuminate Wordmark" className="h-8 md:h-10" />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
          Where imagination meets engineering
        </h1>
      </div>
    </div>
  );
}
