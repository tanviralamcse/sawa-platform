import React from 'react';
import { render, screen } from '@testing-library/react';
import ProviderOnboardingWizard from '../ProviderOnboardingWizard';

test('renders ProviderOnboardingWizard', () => {
  render(<ProviderOnboardingWizard />);
  expect(screen.getByText(/Provider Onboarding/i)).toBeInTheDocument();
});
