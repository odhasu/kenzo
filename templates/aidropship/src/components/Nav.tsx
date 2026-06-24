import { type ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { SparkIcon } from './icons';

interface NavProps {
  children?: ReactNode;
  className?: string;
}

function Nav({ children, className }: NavProps) {
  return (
    <nav
      className={cn(
        'h-16 w-full relative z-10 flex items-center bg-transparent px-6 md:px-12 lg:px-16',
        children ? 'justify-between' : 'justify-center',
        className
      )}
      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}
    >
      <a
        href="#hero"
        className="flex items-center gap-[6px] no-underline"
        style={{ fontSize: 16, fontWeight: 400, color: '#e8ecf1' }}
      >
        <SparkIcon width={16} height={16} color="#6366f1" />
        <span style={{ fontWeight: 600 }}>AI</span>
        {' Dropshipping'}
        {' Builder'}
      </a>
      {children}
    </nav>
  );
}

export default Nav;
