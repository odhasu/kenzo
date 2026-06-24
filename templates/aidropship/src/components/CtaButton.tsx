'use client';

import { ArrowRightIcon } from './icons';
import { cn } from '@/lib/utils';

interface CtaButtonProps {
  variant?: 'primary' | 'nav';
  children: React.ReactNode;
  showArrow?: boolean;
  className?: string;
}

export default function CtaButton({
  variant = 'primary',
  children,
  showArrow = false,
  className,
}: CtaButtonProps) {
  const isPrimary = variant === 'primary';

  const baseStyle: React.CSSProperties = {
    backgroundColor: '#6366f1',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  };

  const variantStyle: React.CSSProperties = isPrimary
    ? {
        borderRadius: '12px',
        padding: '16px 32px',
        fontSize: '16px',
        fontWeight: 700,
        transition:
          'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }
    : {
        borderRadius: '8px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: 600,
        transition: 'color 0.2s, background-color 0.2s, border-color 0.2s',
      };

  return (
    <button
      className={cn(className)}
      style={{ ...baseStyle, ...variantStyle }}
      onMouseEnter={(e) => {
        if (isPrimary) {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow =
            '0 8px 30px rgba(99, 102, 241, 0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (isPrimary) {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '';
        }
      }}
    >
      {children}
      {showArrow && <ArrowRightIcon width={14} height={14} />}
    </button>
  );
}
