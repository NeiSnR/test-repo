import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { CouponProvider } from './context/CouponContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CouponProvider>
      <App />
    </CouponProvider>
  </StrictMode>
);