const TRUSTED_COMPANIES = [
  "TATA",
  "OpenAI",
  "NVIDIA",
  "Paytm",
  "Datadog",
  "Reliance",
  "stripe",
  "CARS24",
];

export default function TrustedByComponent() {
  return (
    <section className="w-full py-8 sm:py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <p className="mb-5 text-center text-sm text-zinc-100 sm:mb-6 sm:text-2xl">
          Trusted every day by teams that build world-class software
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
          {TRUSTED_COMPANIES.map((company) => (
            <div
              key={company}
              className="flex h-24 items-center justify-center rounded-sm border border-[#262626] bg-[#161616] px-3"
            >
              <span className="text-lg font-semibold tracking-tight text-zinc-100">{company}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
