import React from 'react';
import { render, screen } from '@testing-library/react';
import ServiceRequestWizard from '../ServiceRequestWizard';

test('renders ServiceRequestWizard', () => {
  render(<ServiceRequestWizard />);
  expect(screen.getByText(/Service Request/i)).toBeInTheDocument();
});
