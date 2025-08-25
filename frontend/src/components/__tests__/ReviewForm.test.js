import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewForm from '../ReviewForm';

test('renders review form', () => {
  render(<ReviewForm role="Buyer" />);
  expect(screen.getByText(/submit a review/i)).toBeInTheDocument();
});
