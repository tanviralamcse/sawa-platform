import React from 'react';
import { render, screen } from '@testing-library/react';
import FileUpload from '../FileUpload';

test('renders file upload input', () => {
  render(<FileUpload />);
  expect(screen.getByLabelText(/upload files/i)).toBeInTheDocument();
});
