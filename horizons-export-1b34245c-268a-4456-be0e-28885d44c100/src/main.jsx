import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { Toaster } from '@/components/ui/toaster';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <AdminAuthProvider>
      <App />
      <Toaster />
    </AdminAuthProvider>
  </BrowserRouter>
);
