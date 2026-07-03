import React, { useState, ChangeEvent, FormEvent } from 'react';
import ThemeSwitch from './ThemeSwitch';
import './Login.css';

// Importar el logo
import logo from '../assets/images/logo_colca1.png';

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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Limpiar errores al escribir
    setLoginError('');
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};

    if (!formData.email) {
      newErrors.email = 'El usuario es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError('');
    
    if (validateForm()) {
      // Validar credenciales
      if (formData.email === 'admin' && formData.password === 'admin') {
        console.log('Login exitoso');
        setIsLoggedIn(true);
        if (onLogin) {
          onLogin(true);
        }
      } else {
        setLoginError('Usuario o contraseña incorrectos');
        // Limpiar campos
        setFormData({
          email: '',
          password: ''
        });
      }
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Si está logueado, mostrar pantalla "En proceso"
  if (isLoggedIn) {
    return (
      <div className={`login-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className={`rain-bg ${isDarkMode ? 'rain-dark' : 'rain-light'}`}></div>
        <ThemeSwitch isDark={isDarkMode} onToggle={toggleTheme} />
        <div className="in-progress-container">
          <div className={`in-progress-card ${isDarkMode ? 'container-dark' : 'container-light'}`}>
            <div className="in-progress-icon">🚀</div>
            <h1 className={`in-progress-title ${isDarkMode ? 'text-dark' : 'text-light'}`}>
              En Proceso
            </h1>
            <p className={`in-progress-subtitle ${isDarkMode ? 'text-dark' : 'text-light'}`}>
              Estamos trabajando en el sistema
            </p>
            <div className="loading-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
            <button 
              className="logout-button"
              onClick={() => {
                setIsLoggedIn(false);
                setFormData({ email: '', password: '' });
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`login-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className={`rain-bg ${isDarkMode ? 'rain-dark' : 'rain-light'}`}></div>
      
      <ThemeSwitch isDark={isDarkMode} onToggle={toggleTheme} />
      
      <div className={`container ${isDarkMode ? 'container-dark' : 'container-light'}`}>
        {/* Logo - Sin título */}
        <div className="logo-container">
          <img src={logo} alt="Logo Colca" className="logo-image" />
        </div>

        {loginError && <div className="login-error">{loginError}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            className="input"
            placeholder="Usuario"
            value={formData.email}
            onChange={handleChange}
            autoComplete="username"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="input password-input"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
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
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}

          <div className="forgot-password">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>

        <div className="social-account-container">
          <span className="title">O inicia sesión con</span>
          <div className="social-accounts">
            <button className="social-button" aria-label="Google">
              <svg className="svg" viewBox="0 0 24 24" width="20" height="20">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>

            <button className="social-button" aria-label="Facebook">
              <svg className="svg" viewBox="0 0 24 24" width="20" height="20">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
              </svg>
            </button>

            <button className="social-button" aria-label="Twitter">
              <svg className="svg" viewBox="0 0 24 24" width="20" height="20">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#000000"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="agreement">
          <a href="#">Términos y condiciones</a>
        </div>
      </div>
    </div>
  );
};

export default Login;