import React from 'react';
import { render, screen } from '@testing-library/react';
import UserProfileRatings from '../UserProfileRatings';

test('renders UserProfileRatings', () => {
  render(<UserProfileRatings average={4.5} count={10} />);
  expect(screen.getByText(/Average Rating/i)).toBeInTheDocument();
});
