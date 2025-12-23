'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface FeatureTileProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  optimizedFor?: 'mobile' | 'chromebook' | 'both';
}

export function FeatureTile({
  href,
  icon: Icon,
  title,
  description,
  badge,
  optimizedFor = 'both'
}: FeatureTileProps) {
  return (
    <Link href={href} className="block">
      <div className="feature-tile relative group">
        {/* Optimization badge */}
        {optimizedFor !== 'both' && (
          <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${
            optimizedFor === 'mobile'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {optimizedFor === 'mobile' ? '📱' : '💻'}
          </span>
        )}

        {/* Badge (e.g., notification count) */}
        {badge && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {badge}
          </span>
        )}

        <div className="flex flex-col items-center text-center gap-3 py-2">
          <div className="w-14 h-14 rounded-xl bg-oat-200/50 flex items-center justify-center group-hover:bg-oat-300/50 transition-colors">
            <Icon className="w-7 h-7 text-oat-700" />
          </div>
          <div>
            <h3 className="font-semibold text-oat-900">{title}</h3>
            <p className="text-sm text-oat-600 mt-1">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
