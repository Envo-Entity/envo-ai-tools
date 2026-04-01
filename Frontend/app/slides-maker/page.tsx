export default function SlidesMakerPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--color-bg)] px-4 py-10">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.05)] p-8 text-center shadow-[0_24px_80px_-48px_rgba(0,0,0,0.85)] backdrop-blur-sm">
        <p className="font-accent text-sm uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
          Tool 01
        </p>
        <h1 className="font-title mt-3 text-4xl tracking-[-0.05em] text-[color:var(--color-text)] sm:text-5xl">
          AI Slides Maker
        </h1>
        <p className="font-body mt-5 text-base leading-8 text-[color:var(--color-text-secondary)]">
          This tool is under construction. The route is ready, and the real builder can go here next.
        </p>
      </div>
    </main>
  );
}
