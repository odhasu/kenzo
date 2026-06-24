"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const featuredVideo = {
  titlePrefix: "How This 19 Year Old Makes ",
  titleHighlight: "$17,000/Month",
  thumbnail: "/images/student-thumb-1.webp",
  aspectRatio: { width: 1280, height: 720 }, // 16:9
};

const gridVideos = [
  {
    titleHighlight: "$5K/Mo",
    titleSuffix: " at 15 Years Old",
    thumbnail: "https://img.youtube.com/vi/YKagzvb3EJI/0.jpg",
    aspectRatio: { width: 720, height: 1280 }, // 9:16
  },
  {
    titleHighlight: "$2K/Week",
    titleSuffix: " In Highschool",
    thumbnail: "https://img.youtube.com/vi/lZXLYIhGhAY/0.jpg",
    aspectRatio: { width: 720, height: 1280 }, // 9:16
  },
];

const resultsColumn1 = [
  { src: "/images/results/result-1.webp", alt: "Result screenshot 1", aspect: { w: 1200, h: 1169 } },
  { src: "/images/results/result-4.webp", alt: "Result screenshot 4", aspect: { w: 1200, h: 1192 } },
  { src: "/images/results/result-6.webp", alt: "Result screenshot 6", aspect: { w: 1200, h: 1509 } },
  { src: "/images/results/result-8.webp", alt: "Result screenshot 8", aspect: { w: 1200, h: 1431 } },
  { src: "/images/results/result-11.webp", alt: "Result screenshot 11", aspect: { w: 1200, h: 1256 } },
  { src: "/images/results/result-12.webp", alt: "Result screenshot 12", aspect: { w: 1200, h: 1853 } },
  { src: "/images/results/result-15.webp", alt: "Result screenshot 15", aspect: { w: 1200, h: 1380 } },
  { src: "/images/results/student-cash.webp", alt: "Student cash and products result", aspect: { w: 1200, h: 1119 } },
];

const resultsColumn2 = [
  { src: "/images/results/result-2.webp", alt: "Result screenshot 2", aspect: { w: 1200, h: 1169 } },
  { src: "/images/results/result-3.webp", alt: "Result screenshot 3", aspect: { w: 1200, h: 1192 } },
  { src: "/images/results/result-5.webp", alt: "Result screenshot 5", aspect: { w: 1200, h: 1509 } },
  { src: "/images/results/result-7.webp", alt: "Result screenshot 7", aspect: { w: 1200, h: 1431 } },
  { src: "/images/results/result-9.webp", alt: "Result screenshot 9", aspect: { w: 1200, h: 1256 } },
  { src: "/images/results/result-10.webp", alt: "Result screenshot 10", aspect: { w: 1200, h: 1853 } },
  { src: "/images/results/result-13.webp", alt: "Result screenshot 13", aspect: { w: 1200, h: 1380 } },
  { src: "/images/results/result-14.webp", alt: "Result screenshot 14", aspect: { w: 1200, h: 1119 } },
  { src: "/images/results/student-5k-colognes.webp", alt: "Student $5K cologne sales result", aspect: { w: 1200, h: 730 } },
  { src: "/images/results/student-colognes.webp", alt: "Student week 1 selling colognes result", aspect: { w: 1200, h: 800 } },
  { src: "/images/results/student-stan-store.webp", alt: "Student Stan Store revenue screenshot", aspect: { w: 1200, h: 800 } },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface VideoThumbnailCardProps {
  titlePrefix?: string;
  titleHighlight: string;
  titleSuffix?: string;
  thumbnail: string;
  aspectRatio: { width: number; height: number };
  featured?: boolean;
  index: number;
}

function VideoThumbnailCard({
  titlePrefix,
  titleHighlight,
  titleSuffix,
  thumbnail,
  aspectRatio,
  featured = false,
  index,
}: VideoThumbnailCardProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const isLocal = thumbnail.startsWith("/");
  const paddingBottom = `${(aspectRatio.height / aspectRatio.width) * 100}%`;

  return (
    <div
      ref={ref}
      className={`glow-border overflow-hidden rounded-xl bg-card transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Aspect ratio wrapper */}
      <div className="relative w-full" style={{ paddingBottom }}>
        <button
          type="button"
          className="absolute inset-0 h-full w-full cursor-pointer border-0 p-0"
          aria-label="Play video"
        >
          {isLocal ? (
            <Image
              src={thumbnail}
              alt="Video thumbnail"
              fill
              className="object-cover"
              sizes={featured ? "(max-width: 768px) 100vw, 800px" : "(max-width: 768px) 50vw, 400px"}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- remote YouTube thumbnails use raw <img> per spec
            <img
              src={thumbnail}
              alt="Video thumbnail"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          )}
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 shadow-lg">
              <Play className="h-6 w-6 fill-primary-foreground text-primary-foreground ml-0.5" />
            </div>
          </div>
        </button>
      </div>

      {/* Title bar */}
      <div className="bg-card px-3 py-2">
        <p className={`font-bold text-foreground ${featured ? "text-sm" : "text-xs"}`}>
          {titlePrefix && <>{titlePrefix}</>}
          <span className="text-primary">{titleHighlight}</span>
          {titleSuffix && <>{titleSuffix}</>}
        </p>
      </div>
    </div>
  );
}

interface ResultScreenshotItemProps {
  src: string;
  alt: string;
  aspect: { w: number; h: number };
  index: number;
}

function ResultScreenshotItem({ src, alt, aspect, index }: ResultScreenshotItemProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const paddingBottom = `${(aspect.h / aspect.w) * 100}%`;

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-xl border border-border bg-muted transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ paddingBottom, transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative" style={{ paddingBottom }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 400px"
          loading="lazy"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

const stats = [
  { value: "$2M+", label: "Student Revenue" },
  { value: "100+", label: "Students Mentored" },
  { value: "312", label: "First Sales This Month" },
  { value: "18 Days", label: "Avg. Time to First $1K" },
];

export function TestimonialsSection() {
  return (
    <section id="results" className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <h2 className="mb-2 text-center text-2xl font-extrabold text-foreground md:text-3xl">
          See What Our Students Are Saying
        </h2>

        {/* Live indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-bold text-primary tracking-wide uppercase">
            Live — 6 new wins posted this week
          </span>
        </div>

        {/* Stats bar */}
        <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card px-4 py-4 text-center"
            >
              <p className="text-xl font-extrabold text-primary md:text-2xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Featured Video */}
        <VideoThumbnailCard
          titlePrefix={featuredVideo.titlePrefix}
          titleHighlight={featuredVideo.titleHighlight}
          thumbnail={featuredVideo.thumbnail}
          aspectRatio={featuredVideo.aspectRatio}
          featured
          index={0}
        />

        {/* 2-Column Video Grid */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {gridVideos.map((video, i) => (
            <VideoThumbnailCard
              key={video.thumbnail}
              titleHighlight={video.titleHighlight}
              titleSuffix={video.titleSuffix}
              thumbnail={video.thumbnail}
              aspectRatio={video.aspectRatio}
              index={i + 1}
            />
          ))}
        </div>

        {/* Second heading */}
        <h2 className="mt-16 mb-6 text-center text-2xl font-extrabold text-foreground md:text-3xl">
          A Few More Results
        </h2>

        {/* 2-Column Masonry Grid */}
        <div className="flex gap-3">
          {/* Column 1 */}
          <div className="flex flex-1 flex-col gap-3">
            {resultsColumn1.map((item, i) => (
              <ResultScreenshotItem
                key={item.src}
                src={item.src}
                alt={item.alt}
                aspect={item.aspect}
                index={i}
              />
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-1 flex-col gap-3">
            {resultsColumn2.map((item, i) => (
              <ResultScreenshotItem
                key={item.src}
                src={item.src}
                alt={item.alt}
                aspect={item.aspect}
                index={i + resultsColumn1.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
