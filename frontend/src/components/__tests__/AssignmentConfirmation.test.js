import React from 'react';
import { render, screen } from '@testing-library/react';
import AssignmentConfirmation from '../AssignmentConfirmation';

test('renders AssignmentConfirmation', () => {
  render(<AssignmentConfirmation />);
  expect(screen.getByText(/Assignment Status/i)).toBeInTheDocument();
});
