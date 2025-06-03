import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders FactShare title in Navbar', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const titleElement = screen.getByText(/FactShare/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders Verify, Trust, Share motto in Navbar', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const mottoElement = screen.getByText(/Verify, Trust, Share/i);
  expect(mottoElement).toBeInTheDocument();
});