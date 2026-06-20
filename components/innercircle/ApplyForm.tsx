'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const GREEN = 'var(--accent)';
const GREEN_GLOW = 'var(--accent-glow)';
const GREEN_DIM = 'var(--accent-dim)';
const MUTED = 'var(--text-muted)';

const TOTAL = 7;

const COUNTRIES = [
  { f: '🇺🇸', c: '+1', n: 'United States' },
  { f: '🇬🇧', c: '+44', n: 'United Kingdom' },
  { f: '🇨🇦', c: '+1', n: 'Canada' },
  { f: '🇦🇺', c: '+61', n: 'Australia' },
  { f: '🇩🇪', c: '+49', n: 'Germany' },
  { f: '🇫🇷', c: '+33', n: 'France' },
  { f: '🇳🇱', c: '+31', n: 'Netherlands' },
  { f: '🇧🇪', c: '+32', n: 'Belgium' },
  { f: '🇨🇭', c: '+41', n: 'Switzerland' },
  { f: '🇦🇹', c: '+43', n: 'Austria' },
  { f: '🇮🇹', c: '+39', n: 'Italy' },
  { f: '🇪🇸', c: '+34', n: 'Spain' },
  { f: '🇸🇪', c: '+46', n: 'Sweden' },
  { f: '🇳🇴', c: '+47', n: 'Norway' },
  { f: '🇩🇰', c: '+45', n: 'Denmark' },
  { f: '🇵🇱', c: '+48', n: 'Poland' },
  { f: '🇷🇺', c: '+7', n: 'Russia' },
  { f: '🇹🇷', c: '+90', n: 'Turkey' },
  { f: '🇮🇱', c: '+972', n: 'Israel' },
  { f: '🇦🇪', c: '+971', n: 'UAE' },
  { f: '🇸🇦', c: '+966', n: 'Saudi Arabia' },
  { f: '🇮🇳', c: '+91', n: 'India' },
  { f: '🇨🇳', c: '+86', n: 'China' },
  { f: '🇯🇵', c: '+81', n: 'Japan' },
  { f: '🇰🇷', c: '+82', n: 'South Korea' },
  { f: '🇸🇬', c: '+65', n: 'Singapore' },
  { f: '🇧🇷', c: '+55', n: 'Brazil' },
  { f: '🇲🇽', c: '+52', n: 'Mexico' },
  { f: '🇿🇦', c: '+27', n: 'South Africa' },
  { f: '🇳🇬', c: '+234', n: 'Nigeria' },
];

type Answers = {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  email?: string;
  name?: string;
  phone?: string;
  countryCode?: string;
  q7?: string;
};

function Dots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '10px 28px 16px' }}>
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <div
            key={i}
            style={{
              width: isActive ? '28px' : '10px',
              height: '10px',
              borderRadius: isActive ? '5px' : '50%',
              background: isActive ? GREEN : isDone ? 'color-mix(in srgb, var(--accent) 45%, transparent)' : 'rgba(255,255,255,0.14)',
              boxShadow: isActive ? `0 0 10px ${GREEN_GLOW}` : undefined,
              transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s ease',
            }}
          />
        );
      })}
    </div>
  );
}

function ChoiceBtn({
  label,
  keyLetter,
  selected,
  onClick,
}: {
  label: string;
  keyLetter: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: selected ? GREEN_DIM : 'rgba(255,255,255,0.03)',
        border: `1px solid ${selected ? GREEN : 'rgba(255,255,255,0.09)'}`,
        borderRadius: '12px',
        padding: '14px 18px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: 500,
        color: selected ? '#fff' : 'rgba(255,255,255,0.68)',
        transition: 'all 0.14s',
        userSelect: 'none',
      }}
    >
      <span
        style={{
          width: '28px',
          height: '28px',
          flexShrink: 0,
          background: selected ? GREEN : 'rgba(255,255,255,0.07)',
          border: `1px solid ${selected ? GREEN : 'rgba(255,255,255,0.12)'}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 700,
          color: selected ? '#000' : MUTED,
          transition: 'all 0.14s',
        }}
      >
        {keyLetter}
      </span>
      {label}
    </div>
  );
}

export function ApplyForm() {
  const [step, setStep] = useState(1);
  const [ans, setAns] = useState<Answers>({});
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [countryIdx, setCountryIdx] = useState(0);
  const emailRef = useRef<HTMLInputElement>(null);
  const firstRef = useRef<HTMLInputElement>(null);
  const lastRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = useCallback(() => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }, []);

  const pick = useCallback(
    (key: keyof Answers, val: string) => {
      setAns((prev) => ({ ...prev, [key]: val }));
      setError('');
      setTimeout(() => {
        setStep((s) => {
          const next = s + 1;
          scrollToForm();
          return next;
        });
      }, 320);
    },
    [scrollToForm],
  );

  const validate = useCallback((): boolean => {
    if (step <= 4 && !ans[`q${step}` as keyof Answers]) {
      setError('Please select an option.');
      return false;
    }
    if (step === 5) {
      const v = emailRef.current?.value.trim() ?? '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        setError('Please enter a valid email address.');
        return false;
      }
      setAns((prev) => ({ ...prev, email: v }));
    }
    if (step === 6) {
      const fn = firstRef.current?.value.trim() ?? '';
      const ph = phoneRef.current?.value.trim() ?? '';
      if (!fn) { setError('Please enter your first name.'); return false; }
      if (!ph) { setError('Please enter your phone number.'); return false; }
      const ln = lastRef.current?.value.trim() ?? '';
      const code = COUNTRIES[countryIdx].c;
      setAns((prev) => ({ ...prev, name: `${fn} ${ln}`.trim(), phone: `${code} ${ph}`, countryCode: code }));
    }
    if (step === 7 && !ans.q7) {
      setError('Please choose how we should reach you.');
      return false;
    }
    return true;
  }, [step, ans, countryIdx]);

  const submitForm = useCallback(async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        experience: ans.q1,
        goal: ans.q2,
        age: ans.q3,
        budget: ans.q4,
        email: ans.email ?? emailRef.current?.value.trim(),
        name: ans.name ?? `${firstRef.current?.value.trim()} ${lastRef.current?.value.trim()}`.trim(),
        phone: ans.phone ?? `${COUNTRIES[countryIdx].c} ${phoneRef.current?.value.trim()}`,
        contact_preference: ans.q7,
      };
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Submit failed');
      setDone(true);
      launchConfetti();
      scrollToForm();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [ans, countryIdx, scrollToForm]);

  const next = useCallback(() => {
    if (!validate()) return;
    if (step < TOTAL) {
      setStep((s) => s + 1);
      setError('');
      scrollToForm();
    } else {
      submitForm();
    }
  }, [step, validate, scrollToForm, submitForm]);

  const back = useCallback(() => {
    if (step > 1) { setStep((s) => s - 1); setError(''); scrollToForm(); }
  }, [step, scrollToForm]);

  useEffect(() => {
    if (step === 5) setTimeout(() => emailRef.current?.focus(), 200);
    if (step === 6) setTimeout(() => firstRef.current?.focus(), 200);
  }, [step]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (step === 6 && e.key === 'Enter') {
        e.preventDefault();
        const active = document.activeElement;
        if (active === firstRef.current) lastRef.current?.focus();
        else if (active === lastRef.current) phoneRef.current?.focus();
        else next();
        return;
      }
      if ((tag === 'INPUT' || tag === 'SELECT') && e.key === 'Enter') { e.preventDefault(); next(); return; }
      if (e.key === 'Enter' && step <= TOTAL) { next(); return; }
      if (step >= 1 && step <= 4) {
        const map: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, e: 4 };
        const idx = map[e.key.toLowerCase()];
        if (idx !== undefined) {
          const choices = [
            ['just_starting', 'less_6mo', '6mo_1yr', '1_2yr', '2yr_plus'],
            ['side_income', 'fulltime', 'scale', 'freedom'],
            ['13-17', '18-23', '23-35', '35+'],
            ['under_200', '200-500', '500-1k', '1k-3k', '3k+'],
          ];
          const val = choices[step - 1]?.[idx];
          if (val) pick(`q${step}` as keyof Answers, val);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [step, next, pick]);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid rgba(255,255,255,0.14)',
    outline: 'none',
    fontSize: '22px',
    fontWeight: 600,
    color: '#fff',
    padding: '6px 0 12px',
    letterSpacing: '-0.3px',
  };

  const btnOkStyle = (ready: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: ready ? GREEN : 'rgba(255,255,255,0.09)',
    border: `1px solid ${ready ? GREEN : 'rgba(255,255,255,0.13)'}`,
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: 700,
    color: ready ? '#000' : '#fff',
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
    boxShadow: ready ? `0 0 24px ${GREEN_GLOW}` : undefined,
  });

  const isReady = (q: keyof Answers) => Boolean(ans[q]);

  if (done) {
    const waContact = ans.q7 === 'whatsapp';
    const waPhone = ans.phone?.replace(/\s+/g, '').replace('+', '') ?? '';
    const waLink = `https://wa.me/${waPhone}`;

    return (
      <div ref={formRef} style={{ background: 'rgba(8,8,8,0.97)', border: '1.5px solid color-mix(in srgb, var(--accent) 55%, transparent)', borderRadius: '18px', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', padding: '40px 28px 28px' }}>
          <div style={{ width: '72px', height: '72px', background: GREEN_DIM, border: `2px solid ${GREEN}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '30px', color: GREEN, boxShadow: `0 0 40px ${GREEN_GLOW}` }}>✓</div>
          <h3 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '10px' }}>Application Received!</h3>
          <p style={{ fontSize: '15px', color: MUTED, lineHeight: 1.7, marginBottom: '28px' }}>
            We received your answers and will personally reach out to you{' '}
            {waContact ? 'on WhatsApp' : 'shortly'}.
          </p>

          <div style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid color-mix(in srgb, var(--accent) 22%, transparent)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span style={{ fontSize: '24px' }}>🎉</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '2px' }}>Download the free guide here</div>
                <div style={{ fontSize: '13px', color: MUTED }}>Click the button below</div>
              </div>
            </div>
            {['How to find your first high-ticket product', 'The platforms that pay the most', 'How to pass StockX & GOAT authentication', 'The exact steps our members use to hit $10K/month'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '9px' }}>
                <span style={{ color: GREEN, fontWeight: 800 }}>✓</span>{item}
              </div>
            ))}
          </div>

          <a href="https://ogresell.shop/b/guide" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: GREEN, color: '#000', fontWeight: 800, fontSize: '16px', padding: '18px 24px', borderRadius: '12px', textDecoration: 'none', width: '100%', boxShadow: `0 0 32px ${GREEN_GLOW}`, letterSpacing: '-0.2px', marginBottom: waContact ? '12px' : '0' }}>
            📖 Get Your Free Reselling Guide ↗
          </a>

          {waContact && (
            <a href={waLink} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#25D366', color: '#fff', fontWeight: 800, fontSize: '16px', padding: '18px 24px', borderRadius: '12px', textDecoration: 'none', width: '100%', letterSpacing: '-0.2px', marginTop: '0' }}>
              💬 Chat on WhatsApp ↗
            </a>
          )}
        </div>
        <Dots current={TOTAL + 1} total={TOTAL} />
      </div>
    );
  }

  const footer = (canGoBack: boolean, ready: boolean) => (
    <>
      {error && <div style={{ fontSize: '12px', color: '#f87171', padding: '0 28px 8px' }}>{error}</div>}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px 18px', gap: '10px' }}>
        <button
          onClick={back}
          disabled={!canGoBack}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: canGoBack ? 'rgba(255,255,255,0.4)' : 'transparent', fontSize: '14px', fontWeight: 600, cursor: canGoBack ? 'pointer' : 'default', padding: 0 }}
        >
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: MUTED }}>Press <kbd style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: '5px', padding: '3px 7px', fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>Enter</kbd></span>
          <button onClick={next} disabled={submitting} style={btnOkStyle(ready)}>
            {submitting ? 'Submitting…' : step === TOTAL ? 'Submit ✓' : 'OK →'}
          </button>
        </div>
      </div>
      <Dots current={step} total={TOTAL} />
    </>
  );

  const KEYS = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div
      ref={formRef}
      style={{ background: 'rgba(8,8,8,0.97)', border: '1.5px solid color-mix(in srgb, var(--accent) 55%, transparent)', borderRadius: '18px', overflow: 'hidden', animation: 'icBorderPulse 4s ease-in-out infinite' }}
    >
      {/* Q1 */}
      {step === 1 && (
        <div>
          <div style={{ padding: '32px 28px 20px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: GREEN, fontSize: '15px', fontWeight: 800, borderRadius: '8px', marginBottom: '20px', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>1</div>
            <div style={{ fontSize: 'clamp(18px,4vw,26px)', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.25, marginBottom: '26px', color: 'rgba(255,255,255,0.95)' }}>
              <span style={{ color: GREEN, marginRight: '8px' }}>→</span>How long have you been reselling?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {["I'm just starting", 'Less than 6 months', '6 months – 1 year', '1–2 years', '2+ years'].map((label, i) => (
                <ChoiceBtn key={label} label={label} keyLetter={KEYS[i]} selected={ans.q1 === ['just_starting', 'less_6mo', '6mo_1yr', '1_2yr', '2yr_plus'][i]} onClick={() => pick('q1', ['just_starting', 'less_6mo', '6mo_1yr', '1_2yr', '2yr_plus'][i])} />
              ))}
            </div>
          </div>
          {footer(false, isReady('q1'))}
        </div>
      )}

      {/* Q2 */}
      {step === 2 && (
        <div>
          <div style={{ padding: '32px 28px 20px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: GREEN, fontSize: '15px', fontWeight: 800, borderRadius: '8px', marginBottom: '20px', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>2</div>
            <div style={{ fontSize: 'clamp(18px,4vw,26px)', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.25, marginBottom: '26px', color: 'rgba(255,255,255,0.95)' }}>
              <span style={{ color: GREEN, marginRight: '8px' }}>→</span>What do you want to achieve with reselling?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {['Side income alongside my job', 'Make it my full-time business', 'Scale my existing reselling store', 'Financial freedom / quit my 9–5'].map((label, i) => (
                <ChoiceBtn key={label} label={label} keyLetter={KEYS[i]} selected={ans.q2 === ['side_income', 'fulltime', 'scale', 'freedom'][i]} onClick={() => pick('q2', ['side_income', 'fulltime', 'scale', 'freedom'][i])} />
              ))}
            </div>
          </div>
          {footer(true, isReady('q2'))}
        </div>
      )}

      {/* Q3 */}
      {step === 3 && (
        <div>
          <div style={{ padding: '32px 28px 20px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: GREEN, fontSize: '15px', fontWeight: 800, borderRadius: '8px', marginBottom: '20px', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>3</div>
            <div style={{ fontSize: 'clamp(18px,4vw,26px)', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.25, marginBottom: '26px', color: 'rgba(255,255,255,0.95)' }}>
              <span style={{ color: GREEN, marginRight: '8px' }}>→</span>How old are you?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {['13–17', '18–23', '23–35', '35+'].map((label, i) => (
                <ChoiceBtn key={label} label={label} keyLetter={KEYS[i]} selected={ans.q3 === ['13-17', '18-23', '23-35', '35+'][i]} onClick={() => pick('q3', ['13-17', '18-23', '23-35', '35+'][i])} />
              ))}
            </div>
          </div>
          {footer(true, isReady('q3'))}
        </div>
      )}

      {/* Q4 */}
      {step === 4 && (
        <div>
          <div style={{ padding: '32px 28px 20px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: GREEN, fontSize: '15px', fontWeight: 800, borderRadius: '8px', marginBottom: '20px', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>4</div>
            <div style={{ fontSize: 'clamp(18px,4vw,26px)', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.25, marginBottom: '26px', color: 'rgba(255,255,255,0.95)' }}>
              <span style={{ color: GREEN, marginRight: '8px' }}>→</span>What&apos;s your total budget for getting started?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {['Under $200 USD', '$200–$500 USD', '$500–$1K USD', '$1K–$3K USD', '$3K+ USD'].map((label, i) => (
                <ChoiceBtn key={label} label={label} keyLetter={KEYS[i]} selected={ans.q4 === ['under_200', '200-500', '500-1k', '1k-3k', '3k+'][i]} onClick={() => pick('q4', ['under_200', '200-500', '500-1k', '1k-3k', '3k+'][i])} />
              ))}
            </div>
          </div>
          {footer(true, isReady('q4'))}
        </div>
      )}

      {/* Q5 — Email */}
      {step === 5 && (
        <div>
          <div style={{ padding: '32px 28px 20px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: GREEN, fontSize: '15px', fontWeight: 800, borderRadius: '8px', marginBottom: '20px', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>5</div>
            <div style={{ fontSize: 'clamp(18px,4vw,26px)', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.25, marginBottom: '26px', color: 'rgba(255,255,255,0.95)' }}>
              <span style={{ color: GREEN, marginRight: '8px' }}>→</span>Got it — what&apos;s the best email to reach you at?
            </div>
            <input ref={emailRef} type="email" placeholder="name@example.com" autoComplete="email" style={inputStyle} />
          </div>
          {footer(true, Boolean(ans.email))}
        </div>
      )}

      {/* Q6 — Name + Phone */}
      {step === 6 && (
        <div>
          <div style={{ padding: '32px 28px 20px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: GREEN, fontSize: '15px', fontWeight: 800, borderRadius: '8px', marginBottom: '20px', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>6</div>
            <div style={{ fontSize: 'clamp(18px,4vw,26px)', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.25, marginBottom: '26px', color: 'rgba(255,255,255,0.95)' }}>
              <span style={{ color: GREEN, marginRight: '8px' }}>→</span>And your name and phone number?
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '13px', color: MUTED, fontWeight: 500, marginBottom: '8px', display: 'block' }}>First name</span>
                <input ref={firstRef} type="text" placeholder="Jane" autoComplete="given-name" style={inputStyle} />
              </div>
              <div>
                <span style={{ fontSize: '13px', color: MUTED, fontWeight: 500, marginBottom: '8px', display: 'block' }}>Last name</span>
                <input ref={lastRef} type="text" placeholder="Smith" autoComplete="family-name" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <span style={{ fontSize: '20px' }}>{COUNTRIES[countryIdx].f}</span>
                <span style={{ fontSize: '15px', fontWeight: 600, color: MUTED, paddingBottom: '12px', borderBottom: '2px solid rgba(255,255,255,0.14)', minWidth: '36px' }}>{COUNTRIES[countryIdx].c}</span>
                <select
                  value={countryIdx}
                  onChange={(e) => setCountryIdx(Number(e.target.value))}
                  style={{ position: 'absolute', opacity: 0, cursor: 'pointer', width: '100%', height: '100%', top: 0, left: 0, zIndex: 10 }}
                >
                  {COUNTRIES.map((co, i) => (
                    <option key={i} value={i}>{co.f} {co.n} ({co.c})</option>
                  ))}
                </select>
              </div>
              <input ref={phoneRef} type="tel" placeholder="555 123 4567" autoComplete="tel-national" style={{ ...inputStyle, flex: 1 }} />
            </div>
          </div>
          {footer(true, Boolean(ans.name))}
        </div>
      )}

      {/* Q7 — Contact Preference */}
      {step === 7 && (
        <div>
          <div style={{ padding: '32px 28px 20px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: GREEN, fontSize: '15px', fontWeight: 800, borderRadius: '8px', marginBottom: '20px', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>7</div>
            <div style={{ fontSize: 'clamp(18px,4vw,26px)', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.25, marginBottom: '26px', color: 'rgba(255,255,255,0.95)' }}>
              <span style={{ color: GREEN, marginRight: '8px' }}>→</span>Last step — how should we reach you?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              <ChoiceBtn label="WhatsApp (preferred)" keyLetter="A" selected={ans.q7 === 'whatsapp'} onClick={() => setAns((p) => ({ ...p, q7: 'whatsapp' }))} />
              <ChoiceBtn label="Text Message (iMessage / SMS)" keyLetter="B" selected={ans.q7 === 'sms'} onClick={() => setAns((p) => ({ ...p, q7: 'sms' }))} />
              <ChoiceBtn label="Email" keyLetter="C" selected={ans.q7 === 'email'} onClick={() => setAns((p) => ({ ...p, q7: 'email' }))} />
            </div>
          </div>
          {footer(true, isReady('q7'))}
        </div>
      )}
    </div>
  );
}

function launchConfetti() {
  const colors = ['var(--accent)', '#ffffff', '#a0ff60', '#00ff88'];
  for (let i = 0; i < 70; i++) {
    const el = document.createElement('div');
    const size = Math.random() * 8 + 4;
    el.style.cssText = [
      'position:fixed',
      `width:${size}px`,
      `height:${size}px`,
      `background:${colors[Math.floor(Math.random() * colors.length)]}`,
      `border-radius:${Math.random() > 0.5 ? '50%' : '2px'}`,
      `left:${Math.random() * 100}vw`,
      'top:-10px',
      'z-index:9999',
      'pointer-events:none',
      `opacity:${(Math.random() * 0.8 + 0.2).toFixed(2)}`,
      `animation:icConfetti ${(Math.random() * 1.5 + 1).toFixed(2)}s ${(Math.random() * 0.8).toFixed(2)}s ease-in forwards`,
    ].join(';');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
}
