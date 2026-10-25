/** Monthly list prices. Annual billing is calculated once in pricing.ts. */
export const plans = [
  {
    id: 'free',
    name: 'FREE',
    description: 'Personal introduction',
    price: 0,
    credits: '500',
    users: '1',
    action: 'Start free',
    api: false,
    apiRequestsPerSecond: null,
  },
  {
    id: 'plus',
    name: 'PLUS',
    description: 'Research with API access',
    price: 50,
    credits: '25 000',
    users: '1',
    action: 'View Plus',
    api: true,
    apiRequestsPerSecond: 1,
  },
  {
    id: 'expert',
    name: 'EXPERT',
    description: 'Advanced search & full filters',
    price: 300,
    credits: '250 000',
    users: '1',
    action: 'View Expert',
    api: true,
    apiRequestsPerSecond: 2,
  },
  {
    id: 'business',
    name: 'BUSINESS',
    description: 'Team access & private scanning',
    price: 900,
    credits: '1 500 000',
    users: '5',
    action: 'View Business',
    api: true,
    apiRequestsPerSecond: 5,
  },
] as const;

export const businessPlan = plans[3];
