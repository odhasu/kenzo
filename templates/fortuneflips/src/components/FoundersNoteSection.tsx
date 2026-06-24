export function FoundersNoteSection() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
          {/* Photo */}
          <div className="flex-shrink-0 flex justify-center md:w-1/3">
            <div className="relative">
              <div className="h-48 w-48 rounded-3xl bg-gradient-to-br from-primary/30 via-primary/10 to-muted flex items-center justify-center border-2 border-primary/20 overflow-hidden md:h-56 md:w-56">
                <span className="text-6xl select-none">🎯</span>
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-xl -z-10" />
            </div>
          </div>

          {/* Message */}
          <div className="md:w-2/3">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              A Word From The Founder
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-foreground md:text-3xl">
              &quot;I built this because I wish I had it when I started.&quot;
            </h2>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                When I first got into reselling, I spent months piecing together
                scattered YouTube videos, buying overpriced courses that delivered
                nothing, and losing money on bad vendors. I told myself: if I ever
                figure this out, I&apos;ll build the program I needed back then.
              </p>
              <p>
                That&apos;s exactly what the Inner Circle is. No fluff, no
                repackaged free content, no &quot;secret method&quot; that stops
                working the week after you learn it. Just real systems, real vendors,
                and real mentorship from someone who&apos;s actually doing it.
              </p>
              <p>
                I don&apos;t sell a course. I take on a small group of serious
                people and work with them directly. That&apos;s why there&apos;s an
                application — I need to know you&apos;re the right fit, and you need
                to know this is right for you.
              </p>
              <p className="font-semibold text-foreground">
                If you&apos;re ready to take this seriously, fill out the
                application below. If not, no hard feelings — the free content will
                always be here.
              </p>
            </div>

            {/* Signature */}
            <div className="mt-6 border-t border-border pt-4">
              <p className="text-sm font-bold text-foreground">
                Talk soon,
              </p>
              <p className="text-sm text-primary font-semibold">
                The FortuneFlips Team
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
