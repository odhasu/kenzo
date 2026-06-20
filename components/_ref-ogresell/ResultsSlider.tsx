'use client';

import Image from 'next/image';

const PHOTOS = [
  { src: '/innercircle/photos/imagesweat.png', alt: 'Member result' },
  { src: '/innercircle/photos/imagebag.png', alt: 'Member result' },
  { src: '/innercircle/photos/IMG_0457.webp', alt: 'Member result' },
  { src: '/innercircle/photos/IMG_0468.webp', alt: 'Member result' },
  { src: '/innercircle/photos/IMG_4734.png', alt: 'Member result' },
  { src: '/innercircle/photos/IMG_7284.PNG', alt: 'Member result' },
  { src: '/innercircle/photos/Photo_Sep_10_2025_3_43_37_PM.webp', alt: 'Member result' },
  { src: '/innercircle/photos/image.png', alt: 'Member result' },
  { src: '/innercircle/photos/image-2.png', alt: 'Member result' },
  { src: '/innercircle/photos/result-design.png', alt: 'Member result' },
];

export function ResultsSlider() {
  const doubled = [...PHOTOS, ...PHOTOS];

  return (
    <section
      style={{
        maxWidth: '100%',
        padding: '0 0 80px',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(57,255,20,0.1)',
            border: '1px solid rgba(57,255,20,0.25)',
            color: '#39FF14',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            padding: '8px 16px',
            borderRadius: '100px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              background: '#39FF14',
              borderRadius: '50%',
              boxShadow: '0 0 6px #39FF14',
              animation: 'icDotPulse 2s ease-in-out infinite',
              display: 'inline-block',
            }}
          />
          REAL RESULTS
        </span>
      </div>
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '40px',
          fontSize: 'clamp(30px, 6vw, 56px)',
          fontWeight: 900,
          letterSpacing: '-1.8px',
          lineHeight: 1.1,
          background: 'linear-gradient(to bottom, #ffffff 30%, rgba(255,255,255,0.52) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Members Are <span style={{ WebkitTextFillColor: '#39FF14' }}>Winning</span> Every Day
      </h2>

      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.4)',
          padding: '40px 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 'max-content',
            gap: '24px',
            animation: 'icPhotoScroll 40s linear infinite',
          }}
        >
          {doubled.map((photo, i) => (
            <div key={i} style={{ position: 'relative', height: '400px', flexShrink: 0 }}>
              <Image
                src={photo.src}
                alt={photo.alt}
                height={400}
                width={300}
                style={{
                  height: '400px',
                  width: 'auto',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                  pointerEvents: 'none',
                  objectFit: 'cover',
                }}
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
