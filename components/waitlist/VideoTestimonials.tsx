'use client'

const VIDEOS = [
  {
    id: '1',
    title: 'How I scaled to $27K/month with Inner Circle vendor access',
    tag: 'Inner Circle Member',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  },
  {
    id: '2',
    title: '15-year-old hits $8K/month reselling sneakers',
    tag: 'Inner Circle Member',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  },
  {
    id: '3',
    title: 'From $0 to $15K/month in 90 days — full breakdown',
    tag: 'Inner Circle Member',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  },
  {
    id: '4',
    title: 'Bought my dream car (C8 Corvette) at 19 from reselling',
    tag: 'Inner Circle Member',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  },
  {
    id: '5',
    title: 'How this 16-year-old consistently pulls $12K months',
    tag: 'Inner Circle Member',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  },
  {
    id: '6',
    title: '$30K in 30 days — exact strategy inside the Inner Circle',
    tag: 'Inner Circle Member',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  },
  {
    id: '7',
    title: 'Quit my 9–5 after 4 months in the program',
    tag: 'Inner Circle Member',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  },
  {
    id: '8',
    title: 'Scaling past $20K/month — what changed everything',
    tag: 'Inner Circle Member',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  },
  {
    id: '9',
    title: 'The OEM vendor loophole that 10x\'d my margins',
    tag: 'Inner Circle Member',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  },
]

export function VideoTestimonials() {
  return (
    <section className="relative z-10 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <h2 className="mb-10 text-2xl font-bold text-white sm:text-3xl">
          Interviews with the Inner Circle:
        </h2>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((video) => (
            <a
              key={video.id}
              href={`https://youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover transition-all duration-400 group-hover:brightness-110"
                  loading="lazy"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/70 transition-transform duration-300 group-hover:scale-110">
                    <svg className="ml-1 h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 60px rgba(57,255,20,0.08)' }}
                />
              </div>
              {/* Text */}
              <div className="p-4">
                <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
                  {video.title}
                </p>
                <p className="mt-1.5 text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>
                  {video.tag}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
