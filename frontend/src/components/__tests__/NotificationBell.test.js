import React from 'react';
import { render, screen } from '@testing-library/react';
import NotificationBell from '../NotificationBell';

test('renders NotificationBell', () => {
  render(<NotificationBell />);
  expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
});
