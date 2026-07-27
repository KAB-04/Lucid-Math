const skeletonClass = 'animate-pulse rounded-md bg-[var(--color-muted)]/35'

export const DashboardSkeleton = () => (
  <section aria-label="Loading student dashboard" className="grid gap-6" role="status">
    <div className="rounded-lg border border-[var(--color-border)] bg-white p-5 shadow-sm">
      <div className={`${skeletonClass} h-4 w-40`} />
      <div className={`${skeletonClass} mt-4 h-9 w-full max-w-lg`} />
      <div className={`${skeletonClass} mt-4 h-4 w-full max-w-2xl`} />
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {[0, 1, 2, 3].map((item) => (
        <div className="rounded-lg border border-[var(--color-border)] bg-white p-5 shadow-sm" key={item}>
          <div className={`${skeletonClass} h-4 w-28`} />
          <div className={`${skeletonClass} mt-4 h-8 w-24`} />
          <div className={`${skeletonClass} mt-5 h-4 w-full`} />
        </div>
      ))}
    </div>

    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-lg border border-[var(--color-border)] bg-white p-5 shadow-sm">
        <div className={`${skeletonClass} h-5 w-52`} />
        <div className={`${skeletonClass} mt-5 h-28 w-full`} />
      </div>
      <div className="rounded-lg border border-[var(--color-border)] bg-white p-5 shadow-sm">
        <div className={`${skeletonClass} h-5 w-40`} />
        <div className={`${skeletonClass} mt-5 h-28 w-full`} />
      </div>
    </div>
  </section>
)
