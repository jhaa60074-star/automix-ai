export const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    billingPeriod: 'forever',
    description: 'Perfect to explore AutrixGPT’s AI capabilities.',
    features: [
      'Basic AI Assistant',
      'Up to 10 file analyses/month',
      'Community Support',
      'Standard responses'
    ],
    ctaText: 'Get Started',
    ctaLink: '/signup',
    highlighted: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$49',
    billingPeriod: 'per month',
    description: 'For professionals automating their workflows.',
    features: [
      'Advanced AI Assistant',
      'Unlimited file analysis',
      'Up to 3 active automations',
      'Priority Email Support',
      'Early access to website connection'
    ],
    ctaText: 'Start 14-Day Trial',
    ctaLink: '/signup?plan=premium',
    highlighted: true
  },
  {
    id: 'business',
    name: 'Business',
    price: '$149',
    billingPeriod: 'per month',
    description: 'For growing teams requiring scale and security.',
    features: [
      'Everything in Premium',
      'Unlimited active automations',
      'Custom integrations',
      'Dedicated Account Manager',
      'SSO & Advanced Security'
    ],
    ctaText: 'Contact Sales',
    ctaLink: '/contact',
    highlighted: false
  }
];
