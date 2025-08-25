import React from 'react';
import { render, screen } from '@testing-library/react';
import MessagingThread from '../MessagingThread';

test('renders MessagingThread', () => {
  render(<MessagingThread />);
  expect(screen.getByText(/Messages/i)).toBeInTheDocument();
});
