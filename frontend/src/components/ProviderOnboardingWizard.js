import React, { useState } from 'react';

const steps = [
  'Personal/Company Info',
  'Contact Info',
  'Certifications & Training',
  'Technological Skills',
  'Services & Pricing',
  'Portfolio & Documentation',
];

export default function ProviderOnboardingWizard() {
  const [step, setStep] = useState(0);
  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div>
      <h2>Provider Onboarding: {steps[step]}</h2>
      {/* Form fields for each step go here */}
      <div>
        {step > 0 && <button onClick={prev}>Back</button>}
        {step < steps.length - 1 ? (
          <button onClick={next}>Next</button>
        ) : (
          <button>Submit</button>
        )}
      </div>
    </div>
  );
}
