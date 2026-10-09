import { useId } from 'react';
import type { BillingPeriod } from '../../content/pricing';

/** Production APCOSYS control without the website's locale-provider coupling. */
export function BillingSwitch({ value, onChange }: {
  value: BillingPeriod;
  onChange: (value: BillingPeriod) => void;
}) {
  const name = useId();
  return (
    <fieldset className="billing-switch">
      <legend className="sr-only">Billing period</legend>
      <div className="segmented" data-period={value}>
        {(['annually', 'monthly'] as const).map(period => (
          <label key={period}>
            <input type="radio" name={name} value={period}
              checked={value === period} onChange={() => onChange(period)}/>
            <span>{period === 'annually' ? 'Annually' : 'Monthly'}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
