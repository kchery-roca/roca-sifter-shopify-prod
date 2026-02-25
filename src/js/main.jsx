import React from 'react';
import { createRoot } from 'react-dom/client';
import CustomAddToCartButtonSifter from './customAddToCartButtonSifter';
import SifterDashboard from './sifterDashBoard';

function App() {
  return <div>Hello from React! Kris Chery</div>;
}

const el = document.getElementById('product-form-buttons-holder-react');
if (el) {
  createRoot(el).render(<CustomAddToCartButtonSifter />);
}

document.addEventListener('DOMContentLoaded', () => {
  const el2 = document.getElementById('sifter-dashboard');
  if (el2) {
    createRoot(el2).render(<SifterDashboard />);
  }
});
