import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import { store } from './store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const script = document.createElement("script");
script.src = "https://dashboard.sandbox.irembopay.com/assets/payment/inline.js";
script.async = true;
document.head.appendChild(script);

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position='top-center' richColors />
      </QueryClientProvider>
    </Provider>
);
