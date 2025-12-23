'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', hoverable = false, onClick }: GlassCardProps) {
  const baseClasses = 'glass-card';
  const hoverClasses = hoverable ? 'cursor-pointer hover:bg-oat-100/90 hover:shadow-glass-lg hover:-translate-y-1 transition-all duration-300' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function GlassCardSmall({ children, className = '', hoverable = false, onClick }: GlassCardProps) {
  const baseClasses = 'glass-card-sm';
  const hoverClasses = hoverable ? 'cursor-pointer hover:bg-oat-100/90 hover:shadow-glass-lg transition-all duration-200' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
