import React from 'react';
import { render, screen } from '@testing-library/react';
import ApplicationForm from '../ApplicationForm';

test('renders ApplicationForm', () => {
  render(<ApplicationForm />);
  expect(screen.getByText(/Apply to Service Request/i)).toBeInTheDocument();
});
