import { FileText, Target, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Apply & Get Accepted",
    description:
      "Fill out the short application below. I personally review every submission. If it looks like a fit, we'll hop on a quick call to make sure we're aligned — no pressure, no pitch.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Get Your Personalized Blueprint",
    description:
      "Once you're in, I build you a custom scaling plan based on your exact situation — your budget, time, goals, and experience level. You also get instant access to the full training vault, verified vendor network, and automation tools.",
    icon: Target,
  },
  {
    number: "03",
    title: "Execute & Scale to $5K–$20K/Mo",
    description:
      "Follow the blueprint, use the systems, and tap into 1-on-1 mentorship whenever you hit a wall. Most students hit their first $5K month within 90 days. The community keeps you accountable, the vendors keep you stocked, and the automation runs 24/7.",
    icon: Rocket,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Section heading */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground md:text-4xl">
            How It{" "}
            <span className="text-primary">Works</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Three simple steps from where you are now to a profitable reselling business.
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-8 md:gap-12">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isEven = i % 2 === 1;

            return (
              <div
                key={step.number}
                className={`flex flex-col gap-6 md:flex-row md:items-center md:gap-12 ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Visual */}
                <div className="relative flex-shrink-0 md:w-1/2">
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8">
                    {/* Number watermark */}
                    <span className="absolute -top-2 -right-2 text-[8rem] font-extrabold leading-none text-muted/10 select-none pointer-events-none md:text-[10rem]">
                      {step.number}
                    </span>
                    {/* Icon */}
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <Icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
                    </div>
                    {/* Step title inside card for mobile */}
                    <h3 className="relative z-10 mt-4 text-lg font-bold text-foreground md:hidden">
                      {step.title}
                    </h3>
                    <p className="relative z-10 mt-2 text-sm leading-relaxed text-muted-foreground md:hidden">
                      {step.description}
                    </p>
                    {/* Desktop: show icon area larger */}
                    <div className="relative z-10 hidden md:flex items-center justify-center py-8">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-12 w-12 text-primary" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Copy */}
                <div className="md:w-1/2">
                  <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase">
                    Step {step.number}
                  </span>
                  <h3 className="mt-1 hidden text-2xl font-bold text-foreground md:block md:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 hidden text-base leading-relaxed text-muted-foreground md:block">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
