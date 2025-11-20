import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/Auth/AuthForm';
import { MemberDashboard } from './components/Dashboard/MemberDashboard';
import { ResetPassword } from './components/Auth/ResetPassword';
import { supabase } from './lib/supabase';

function AppContent() {
  const { user, loading } = useAuth();
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    const checkRecoveryMode = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');

      if (accessToken && type === 'recovery') {
        setIsPasswordRecovery(true);
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: hashParams.get('refresh_token') || '',
        });
      }
    };

    checkRecoveryMode();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (isPasswordRecovery) {
    return <ResetPassword />;
  }

  // Bypass login - always show dashboard
  return <MemberDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
