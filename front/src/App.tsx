import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import AdminLogin from './pages/AdminLogin';
import './App.css';

const App: React.FC = () => {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setPathname(to);
  };

  if (pathname.startsWith('/admin')) {
    return (
      <div className="App">
        <AdminLogin onBackToUserLogin={() => navigate('/')} />
      </div>
    );
  }

  return (
    <div className="App">
      <Login onGoToAdminLogin={() => navigate('/admin')} />
    </div>
  );
};

export default App;