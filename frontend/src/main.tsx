import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Analytics } from './components/Analytics/analytics.tsx';
import './index.css';
import { StaffDashboard } from './components/Staff/StaffDashboard.tsx';
import { MemberDashboard } from './components/Dashboard/MemberDashboard.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    {/* <Analytics /> */}
    <StaffDashboard />
  </StrictMode>
);
