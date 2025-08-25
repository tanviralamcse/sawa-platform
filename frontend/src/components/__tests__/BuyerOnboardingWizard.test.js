import React from 'react';
import { render, screen } from '@testing-library/react';
import BuyerOnboardingWizard from '../BuyerOnboardingWizard';

test('renders BuyerOnboardingWizard', () => {
  render(<BuyerOnboardingWizard />);
  expect(screen.getByText(/Buyer Onboarding/i)).toBeInTheDocument();
});
