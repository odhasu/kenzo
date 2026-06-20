import { ApplyForm } from './ApplyForm'

export function ApplySection() {
  return (
    <section id="apply" style={{ maxWidth: '780px', margin: '0 auto', padding: '0 20px 100px', position: 'relative', zIndex: 2 }}>
      <h2 style={{
        textAlign: 'center', marginBottom: '8px',
        fontSize: 'clamp(30px, 6vw, 56px)', fontWeight: 900, letterSpacing: '-1.8px', lineHeight: 1.1,
        background: 'linear-gradient(to bottom, #ffffff 30%, rgba(255,255,255,0.52) 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>
        Apply Now
      </h2>
      <div style={{ width: '60px', height: '3px', background: '#39FF14', margin: '0 auto 16px', borderRadius: '2px', boxShadow: '0 0 12px rgba(57,255,20,0.28)' }} />
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '15px', marginBottom: '36px' }}>
        Complete the application below to see if you qualify.
      </p>
      <ApplyForm />
    </section>
  )
}
