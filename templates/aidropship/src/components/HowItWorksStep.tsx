import Image from 'next/image';
import { CheckIcon } from './icons';
import { cn } from '@/lib/utils';

interface HowItWorksStepProps {
  number: string;
  eyebrow: string;
  title: string;
  emphasis: string;
  description: string;
  chips: { label: string }[];
  image: { src: string; alt: string };
  visualType: 'screenshot' | 'mockup' | 'zoom-call';
  reverse?: boolean;
  className?: string;
}

export default function HowItWorksStep({
  number,
  eyebrow,
  title,
  emphasis,
  description,
  chips,
  image,
  visualType,
  reverse = false,
  className,
}: HowItWorksStepProps) {
  const wrapperStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '80px',
    alignItems: 'center',
    padding: '80px 0',
    minHeight: '500px',
  };

  const textColOrder = reverse ? 2 : 1;
  const visualColOrder = reverse ? 1 : 2;

  const nodeStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#6366f1',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '1px solid rgba(99,102,241,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
    backgroundColor: 'rgba(99,102,241,0.08)',
  };

  const eyebrowStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '2px',
    color: '#6366f1',
    textTransform: 'uppercase',
    marginBottom: '12px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 700,
    color: '#e8ecf1',
    lineHeight: 1.15,
    marginBottom: '16px',
  };

  const emphasisStyle: React.CSSProperties = {
    fontFamily: '"Instrument Serif", serif',
    fontStyle: 'italic',
    color: '#6366f1',
    fontWeight: 400,
  };

  const descStyle: React.CSSProperties = {
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#7f84a0',
    maxWidth: '480px',
    marginBottom: '24px',
  };

  const chipsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const chipStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const chipLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#e8ecf1',
  };

  const visualStyle: React.CSSProperties = {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 0 60px rgba(99,102,241,0.12)',
  };

  // Build title with emphasis word wrapped
  const titleParts = title.split(emphasis);
  const renderedTitle =
    titleParts.length === 2 ? (
      <>
        {titleParts[0]}
        <em style={emphasisStyle}>{emphasis}</em>
        {titleParts[1]}
      </>
    ) : (
      title
    );

  function renderVisual() {
    switch (visualType) {
      case 'screenshot':
        return (
          <div style={visualStyle}>
            <Image
              src={image.src}
              alt={image.alt}
              width={600}
              height={450}
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
          </div>
        );

      case 'mockup':
        return (
          <div style={visualStyle}>
            <Image
              src={image.src}
              alt={image.alt}
              width={600}
              height={450}
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
          </div>
        );

      case 'zoom-call':
        return (
          <div style={visualStyle}>
            {/* Titlebar */}
            <div
              style={{
                backgroundColor: '#1a1a1e',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#ff5f57',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#febc2e',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#28c840',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  color: '#9ca3af',
                  fontSize: '12px',
                  marginLeft: '8px',
                }}
              >
                Original Sound: On
              </span>
              <span
                style={{
                  color: '#9ca3af',
                  fontSize: '12px',
                  marginLeft: 'auto',
                }}
              >
                Recording · 42:18
              </span>
            </div>

            {/* Content */}
            <div style={{ position: 'relative' }}>
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={400}
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />
              {/* Live now badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    display: 'inline-block',
                  }}
                />
                <span style={{ color: '#fff', fontSize: '11px', fontWeight: 600 }}>
                  Live now · Daily coaching
                </span>
              </div>
              {/* YOU badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(99,102,241,0.9)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 700,
                }}
              >
                YOU
              </div>
            </div>

            {/* Toolbar */}
            <div
              style={{
                backgroundColor: '#1a1a1a',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  display: 'inline-block',
                }}
              />
              <span style={{ color: '#9ca3af', fontSize: '11px' }}>
                Mic
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className={cn(className)} style={wrapperStyle}>
      {/* Text column */}
      <div style={{ order: textColOrder }}>
        {/* Number badge */}
        <div style={nodeStyle}>{number}</div>

        {/* Eyebrow */}
        <div style={eyebrowStyle}>{eyebrow}</div>

        {/* Title */}
        <h2 style={titleStyle}>{renderedTitle}</h2>

        {/* Description */}
        <p style={descStyle}>{description}</p>

        {/* Feature chips */}
        <div style={chipsContainerStyle}>
          {chips.map((chip, i) => (
            <div key={i} style={chipStyle}>
              <CheckIcon color="#6366f1" width={13} height={13} />
              <span style={chipLabelStyle}>{chip.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visual column */}
      <div style={{ order: visualColOrder }}>{renderVisual()}</div>
    </div>
  );
}
