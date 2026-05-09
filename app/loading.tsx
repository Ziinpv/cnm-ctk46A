export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl p-6 md:p-10">
      <div className="mb-6 h-8 w-64 animate-pulse rounded bg-white/15" />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="space-y-3 rounded-xl border border-white/10 bg-[#0F1115] p-5">
            <div className="h-5 w-3/4 animate-pulse rounded bg-white/15" />
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
          </div>
        ))}
      </div>
    </main>
  );
}
