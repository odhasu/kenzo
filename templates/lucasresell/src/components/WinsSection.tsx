
const wins = [
  { src: "https://cdn.clyro.io/images/variants/img_QRRPzkCGFMuT9xArHuNWR/1920.jpeg", alt: "Testimonial image 1" },
  { src: "https://cdn.clyro.io/images/variants/img_X-biZtVijL98kAR1jwMKy/1920.jpeg", alt: "Testimonial image 2" },
  { src: "https://cdn.clyro.io/images/variants/img_yuCHlV6azfzk7a5jI1nIN/1920.jpeg", alt: "Testimonial image 3" },
  { src: "https://cdn.clyro.io/images/variants/img_OaIs3mxhFiRjjSUmK-9qk/1920.jpeg", alt: "Testimonial image 4" },
  { src: "https://cdn.clyro.io/images/variants/img_5enDm-0QLyhy8nEdfE3f4/1920.jpeg", alt: "Testimonial image 5" },
  { src: "https://cdn.clyro.io/images/variants/img_C3GXvDC7rELhMzxetJ-qP/1920.jpeg", alt: "Testimonial image 6" },
  { src: "https://cdn.clyro.io/images/variants/img_Id5zYTtOzzULo8KWdh7Ac/1920.jpeg", alt: "Testimonial image 7" },
  { src: "https://cdn.clyro.io/images/variants/img_c8UoUK-ppzWBG01LCZUaZ/1920.jpeg", alt: "Testimonial image 8" },
];

export function WinsSection() {
  return (
    <section className="px-4 py-[38px]">
      <div className="mb-10">
        <h2 className="font-heading text-[45.8px] leading-[50.38px] font-bold -tracking-[0.025em] text-white">
          More Inner Circle Wins:
        </h2>
      </div>

      <div className="mx-auto max-w-[75%]">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {wins.map((win, i) => (
            <div
              key={win.src}
              className="aspect-square overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.15)] transition-colors"
            >
              <img
                src={win.src}
                alt={win.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
