import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

//tests the App component to make sure it renders correctly and contains correct content
test('renders Collin\'s Onboarding Project title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Collin's Onboarding Project/i);
  expect(titleElement).toBeInTheDocument(); //checks if the title element is in the document
});