import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Weather from './Weather';

// Basic rendering test to make sure Weather renders correctly
test('renders Weather component', () => {
  render(<Weather />);
  expect(screen.getByText(/Weather Information/i)).toBeInTheDocument();
});

// Button click test
test('shows modal when year button is clicked', async () => {
  render(<Weather />);
  fireEvent.click(screen.getByText(/Year-to-Date/i));
  expect(await screen.findByText(/Year-to-Date Weather Data/i)).toBeInTheDocument();
});



