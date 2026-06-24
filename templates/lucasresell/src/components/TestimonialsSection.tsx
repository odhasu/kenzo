import { TestimonialCard } from "./TestimonialCard";

const testimonials = [
  {
    title: "He makes $25,000/m selling unbranded glasses",
    thumbnailUrl: "https://i.ytimg.com/vi/IE0_sR4QfRg/hqdefault.jpg",
  },
  {
    title: "He's Doing $20,000/Month With High Ticket Reselling",
    thumbnailUrl: "https://i.ytimg.com/vi/-yUZ4U91dVQ/hqdefault.jpg",
  },
  {
    title: "$0 to $30,000/Month in 6 Months",
    thumbnailUrl: "https://i.ytimg.com/vi/7xr2eSPviGM/hqdefault.jpg",
  },
  {
    title: "16 Year Old: $0 → $27K/Month",
    thumbnailUrl: "https://i.ytimg.com/vi/K4zdxmcqkcQ/hqdefault.jpg",
  },
  {
    title: "15 Year Old Hitting $22K/Month",
    thumbnailUrl: "https://i.ytimg.com/vi/evjICkbXsig/hqdefault.jpg",
  },
  {
    title: "From Trampoline Park to $21K/Month",
    thumbnailUrl: "https://i.ytimg.com/vi/uP7VTQFMmFY/hqdefault.jpg",
  },
  {
    title: "He Bought a C8 Corvette From Reselling",
    thumbnailUrl: "https://i.ytimg.com/vi/fX0Jrb7-bkI/hqdefault.jpg",
  },
  {
    title: "16 Year Old: $0 → $8K/Month",
    thumbnailUrl: "https://i.ytimg.com/vi/A8NgC6evgpA/hqdefault.jpg",
  },
  {
    title: "16 Year Old Made $70,000 With High Ticket Reselling",
    thumbnailUrl: "https://i.ytimg.com/vi/I80B0-LlEUk/hqdefault.jpg",
  },
  {
    title: "He's 15 and Makes $10,000/Month",
    thumbnailUrl: "https://i.ytimg.com/vi/JsOt0YROtMk/hqdefault.jpg",
  },
];

export function TestimonialsSection() {
  return (
    <section className="px-4 py-[38px]">
      <div className="mb-12">
        <h2 className="font-heading text-[47.8px] leading-[52.58px] font-bold tracking-normal text-white">
          Interviews with the Inner Circle:
        </h2>
      </div>

      <div className="mx-auto max-w-[75%]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {testimonials.map((t) => (
            <TestimonialCard
              key={t.thumbnailUrl}
              title={t.title}
              thumbnailUrl={t.thumbnailUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
