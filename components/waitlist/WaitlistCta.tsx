'use client'

interface WaitlistCtaProps {
  className?: string
}

export function WaitlistCta({ className = '' }: WaitlistCtaProps) {
  const scrollToForm = () => {
    document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className={`relative z-10 flex justify-center px-6 py-14 ${className}`}>
      <button
        onClick={scrollToForm}
        className="group relative rounded-full px-10 py-4 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          background: '#39ff14',
          color: '#0a0a0a',
          boxShadow: '0 0 40px rgba(57,255,20,0.2)',
        }}
      >
        <span className="relative z-10">Get Started Now</span>
        {/* Glow pulse on hover */}
        <div
          className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: '0 0 60px rgba(57,255,20,0.4)' }}
        />
      </button>
    </section>
  )
}
