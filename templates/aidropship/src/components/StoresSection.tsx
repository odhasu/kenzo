import StoreCard from './StoreCard';
import { cn } from '@/lib/utils';

const stores = [
  { src: '/stores/01.avif', alt: 'AI-built e-commerce store' },
  { src: '/stores/02.avif', alt: 'AI-built e-commerce store' },
  { src: '/stores/03.avif', alt: 'AI-built e-commerce store' },
  { src: '/stores/04.avif', alt: 'AI-built e-commerce store' },
  { src: '/stores/05.avif', alt: 'AI-built e-commerce store' },
  { src: '/stores/06.avif', alt: 'AI-built e-commerce store' },
] as const;

export default function StoresSection({ className }: { className?: string }) {
  return (
    <section
      className={cn(className)}
      style={{
        padding: '120px 64px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '64px' }}>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#6366f1',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          BUILT BY AI
        </p>

        <h2
          style={{
            fontSize: '42px',
            fontWeight: 700,
            color: '#e8ecf1',
            lineHeight: 1.1,
            marginBottom: '16px',
          }}
        >
          E-com stores{' '}
          <em
            className="font-serif italic text-[#6366f1]"
            style={{ fontStyle: 'italic' }}
          >
            that our AI has built.
          </em>
        </h2>

        <p
          style={{
            fontSize: '18px',
            color: '#7f84a0',
            maxWidth: '600px',
          }}
        >
          Six real student stores, designed and deployed by our AI. Product
          research, copy, design, supplier setup - all handled. You sign off in
          minutes, not weeks.
        </p>
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        style={{ gap: '24px' }}
      >
        {stores.map((store) => (
          <StoreCard key={store.src} image={store.src} />
        ))}
      </div>
    </section>
  );
}
