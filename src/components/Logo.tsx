import logoUrl from '@/assets/images/logo/LogoWordmark.svg';
import { cn } from '@/lib/utils';

/**
 * Логотип FamilyDent (wordmark). Красится через currentColor:
 * задайте text-* класс на родителе или самом компоненте.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="FamilyDent"
      className={cn('inline-block bg-current', className)}
      style={{
        aspectRatio: '196 / 40',
        maskImage: `url(${logoUrl})`,
        WebkitMaskImage: `url(${logoUrl})`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskPosition: 'left center',
        WebkitMaskPosition: 'left center',
      }}
    />
  );
}
