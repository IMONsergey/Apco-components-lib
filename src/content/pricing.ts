/** Annual prices use a 20% discount relative to twelve monthly payments. */
export type BillingPeriod = 'monthly' | 'annually';
export const ANNUAL_DISCOUNT_PERCENT = 20;
export function calculatePrice(monthlyDollars: number, period: BillingPeriod) {
  if (!Number.isFinite(monthlyDollars) || monthlyDollars < 0)
    throw new RangeError('Invalid monthly price');
  const baseCents = Math.round(monthlyDollars * 100);
  const monthlyCents =
    period === 'annually'
      ? Math.round((baseCents * (100 - ANNUAL_DISCOUNT_PERCENT)) / 100)
      : baseCents;
  return {
    monthly: monthlyCents / 100,
    total: (monthlyCents * (period === 'annually' ? 12 : 1)) / 100,
  };
}
export const formatPrice = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
