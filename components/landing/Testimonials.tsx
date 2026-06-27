"use client";

const quotes = [
  {
    text: "Kenzo helped me go from zero to $8k/mo in 3 weeks. The AI wrote better copy than my $2k copywriter.",
    name: "Marcus T.",
    role: "Fitness Coach",
  },
  {
    text: "I built my entire sales funnel in an afternoon. Published it the same day. Got my first lead within hours.",
    name: "Sarah L.",
    role: "Business Consultant",
  },
  {
    text: "The drag-and-drop editor is insane. I'm not technical at all and I was able to customize everything perfectly.",
    name: "Jordan K.",
    role: "Marketing Agency Owner",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="font-[family-name:var(--font-lora)] text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by coaches & agency owners
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {quotes.map((q) => (
            <div key={q.name} className="rounded-xl border border-gray-100 bg-gray-50/50 p-6">
              <p className="text-gray-600 leading-relaxed mb-4 text-sm">&ldquo;{q.text}&rdquo;</p>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{q.name}</p>
                <p className="text-xs text-gray-400">{q.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
