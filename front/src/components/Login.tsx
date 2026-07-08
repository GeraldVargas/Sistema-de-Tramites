import React, { useState, ChangeEvent, FormEvent } from 'react';
import './Login.css';

// Importar el logo
import logo from '../assets/images/logo_colca1.png';
// Importar Dashboard de forma estática (evita el error de 'require' en TypeScript)
import Dashboard from '../pages/Dashboard';

interface LoginForm {
  email: string;
  password: string;
}

interface LoginProps {
  onLogin?: (success: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setLoginError('');
    if (errors[name as keyof LoginForm]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};

    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'El usuario es requerido';
    }

    if (!formData.password || formData.password.trim() === '') {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError('');
    
    if (validateForm()) {
      if (formData.email === 'admin' && formData.password === 'admin') {
        console.log('Login exitoso');
        setIsLoggedIn(true);
        if (onLogin) {
          onLogin(true);
        }
      } else {
        setLoginError('Usuario o contraseña incorrectos');
        setFormData({
          email: '',
          password: ''
        });
        setErrors({});
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isLoggedIn) {
    return <Dashboard onLogout={() => {
      setIsLoggedIn(false);
      setFormData({ email: '', password: '' });
    }} />;
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="rain-bg"></div>

        <div className="login-card">
          <div className="logo-container">
            <img src={logo} alt="Logo Colca" className="logo-image" />
          </div>

          {loginError && <div className="login-error">{loginError}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-input-container">
              <input
                type="text"
                name="email"
                className={`login-floating-input ${errors.email ? 'login-input-error' : ''}`}
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                autoComplete="username"
              />
              <div className="login-topline"></div>
              <label className="login-input-label">Usuario</label>
              <div className="login-underline"></div>
              {errors.email && <span className="login-error-message">{errors.email}</span>}
            </div>

            <div className="login-input-container password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`login-floating-input password-input ${errors.password ? 'login-input-error' : ''}`}
                placeholder=" "
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <div className="login-topline"></div>
              <label className="login-input-label">Contraseña</label>
              <div className="login-underline"></div>
              <button 
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
              {errors.password && <span className="login-error-message">{errors.password}</span>}
            </div>

            <button type="submit" className="btn-glass">
              <span className="btn-glass-outer">
                <span className="btn-glass-inner">
                  <span className="btn-glass-label">Iniciar Sesión</span>
                </span>
              </span>
            </button>
          </form>

          <div className="social-wrapper">
            <ul className="social-icons-list">
              <li className="social-icon facebook">
                <span className="social-tooltip">Facebook</span>
                <a 
                  href="https://www.facebook.com/municipiodecolcapirhua" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </li>
              <li className="social-icon twitter">
                <span className="social-tooltip">YouTube</span>
                <a 
                  href="https://www.youtube.com/@gamdecolcapirhua" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </li>
              <li className="social-icon instagram">
                <span className="social-tooltip">Instagram</span>
                <a 
                  href="https://www.instagram.com/alcaldiadecolcapirhua" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-right-content">
          <h2>Sistema de Trámites</h2>
        
        </div>
      </div>
    </div>
  );
};

export default Login;