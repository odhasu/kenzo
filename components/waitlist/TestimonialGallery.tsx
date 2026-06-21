'use client'

const IMAGES = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  alt: `Inner Circle win ${i + 1}`,
  // Placeholder gradient blocks — in production these would be real earnings screenshots
  color: [
    'from-emerald-900/60 to-green-800/40',
    'from-green-900/50 to-emerald-800/30',
    'from-teal-900/60 to-green-900/40',
    'from-emerald-800/50 to-green-700/30',
    'from-green-900/40 to-emerald-800/50',
    'from-teal-800/50 to-green-900/30',
  ][i % 6],
}))

const METRICS = [
  '$8,420', '$12,150', '$5,980', '$27,300', '$9,840', '$15,620',
  '$22,100', '$7,450', '$18,900', '$31,200', '$6,780', '$14,300',
  '$10,500', '$25,800', '$4,920', '$19,400', '$11,230', '$29,100',
  '$8,900', '$16,750', '$13,600', '$21,400', '$9,100', '$17,800',
]

export function TestimonialGallery() {
  return (
    <section className="relative z-10 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <h2 className="mb-10 text-2xl font-bold text-white sm:text-3xl">
          More Inner Circle Wins:
        </h2>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {IMAGES.map((img, i) => (
            <div
              key={img.id}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03]"
              style={{ border: '1px solid rgba(255,255,255,0.05)' }}
            >
              {/* Gradient background placeholder */}
              <div className={`absolute inset-0 bg-gradient-to-br ${img.color}`} />

              {/* Revenue metric overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                <span
                  className="text-xl sm:text-2xl font-extrabold tabular-nums tracking-tight"
                  style={{ color: '#39ff14', textShadow: '0 0 20px rgba(57,255,20,0.3)' }}
                >
                  {METRICS[i]}
                </span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/50">
                  / month
                </span>
              </div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 80px rgba(57,255,20,0.1)' }}
              />

              {/* Decorative corner lines */}
              <div className="absolute top-0 right-0 h-8 w-8 opacity-20"
                style={{ borderTop: '1px solid rgba(57,255,20,0.5)', borderRight: '1px solid rgba(57,255,20,0.5)' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
