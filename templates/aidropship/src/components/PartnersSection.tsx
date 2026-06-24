import Image from "next/image";

import { cn } from "@/lib/utils";

const partners = [
  { src: "/partners/wix.avif", alt: "Wix", height: 36 },
  { src: "/partners/tiktok.avif", alt: "TikTok", height: 32 },
  { src: "/partners/autods.avif", alt: "AutoDS", height: 36 },
  { src: "/partners/hostinger.avif", alt: "Hostinger", height: 28 },
] as const;

export default function PartnersSection({
  className,
}: {
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden py-4 pb-8 text-center",
        className,
      )}
    >
      <p
        className="mb-6 text-[11px] font-semibold uppercase tracking-[2px]"
        style={{ color: "#7f84a0" }}
      >
        OUR PARTNERS
      </p>

      <div className="flex flex-wrap items-center justify-center gap-12">
        {partners.map((partner) => (
          <Image
            key={partner.alt}
            src={partner.src}
            alt={partner.alt}
            height={partner.height}
            width={0}
            sizes="200px"
            className="h-auto w-auto opacity-70 transition-opacity hover:opacity-90"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        ))}
      </div>
    </section>
  );
}
