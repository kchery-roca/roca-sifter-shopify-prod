import React from 'react';
import { createRoot } from 'react-dom/client';
import CustomAddToCartButtonSifter from './customAddToCartButtonSifter';

function App() {
  return <div>Hello from React! Kris Chery</div>;
}

const el = document.getElementById('product-form-buttons-holder-react');
if (el) {
  createRoot(el).render(<CustomAddToCartButtonSifter />);
}