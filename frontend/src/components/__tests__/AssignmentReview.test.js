import React from 'react';
import { render, screen } from '@testing-library/react';
import AssignmentReview from '../AssignmentReview';

test('renders AssignmentReview', () => {
  render(<AssignmentReview />);
  expect(screen.getByText(/Review Applications/i)).toBeInTheDocument();
});
