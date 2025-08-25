import React from 'react';
import { render, screen } from '@testing-library/react';
import AppShell from '../AppShell';

test('renders AppShell with navigation', () => {
  render(<AppShell>Content</AppShell>);
  expect(screen.getByText(/SAWA Platform/i)).toBeInTheDocument();
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
});
