export function AuthVerificationUnavailable() {
  return (
    <main className="mx-auto flex min-h-[65vh] w-full max-w-3xl items-center px-4 py-16 sm:px-6">
      <section role="alert" className="w-full rounded-3xl border border-stone-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-stone-600">Account check unavailable</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-stone-900">We could not verify your sign-in.</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">Please check that the sign-in service is running, then refresh this page.</p>
      </section>
    </main>
  );
}
