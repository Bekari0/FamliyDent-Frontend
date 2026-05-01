import { cn } from '@/lib/utils';
import LogoIcon from '@/assets/images/logo/Logo.svg?react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  withShadow?: boolean;
}

export function Logo({ className, showText = true, size = 'md', withShadow = false }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoIcon className={cn(sizeClasses[size], withShadow && "drop-shadow-lg")} />
      {showText && (
        <span className={cn("font-display font-bold", textSize[size], "text-slate-900")}>
          Family<span className="text-primary">Dent</span>
        </span>
      )}
    </div>
  );
}