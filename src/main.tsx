import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  document.getElementById('root')!.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #111827; color: white; font-family: system-ui;">
      <div style="text-align: center;">
        <h1>CopyTrader Pro</h1>
        <p>Loading application...</p>
      </div>
    </div>
  `;
}
