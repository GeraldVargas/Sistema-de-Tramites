import React, { useState, ChangeEvent, FormEvent } from 'react';
import './Login.css';
import logo from '../assets/images/logo_colca1.png';
import Dashboard from '../pages/Dashboard';
import Register from '../pages/Register';

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
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showGooglePopup, setShowGooglePopup] = useState<boolean>(false);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError('');
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        const API_URL = 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          console.log('Login exitoso:', data.user);
          setIsLoggedIn(true);
          if (onLogin) {
            onLogin(true);
          }
        } else {
          setLoginError(data.message || 'Usuario o contraseña incorrectos');
          setFormData({
            email: '',
            password: ''
          });
          setErrors({});
        }
      } catch (error) {
        console.error('Error en login:', error);
        setLoginError('Error al conectar con el servidor');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoToRegister = () => {
    setShowRegister(true);
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    setLoginError('¡Registro exitoso! Ahora puedes iniciar sesión.');
  };

  const handleForgotPassword = () => {
    alert('Funcionalidad de recuperación de contraseña\n\nPor favor, contacta con el administrador del sistema.');
  };

  // Google Login - Simula el popup de selección de cuenta
  const handleGoogleLogin = () => {
    setShowGooglePopup(true);
  };

  // Simular selección de cuenta de Google
  const handleSelectGoogleAccount = (email: string, nombre: string) => {
    setShowGooglePopup(false);
    setIsLoading(true);
    
    // Simular datos de Google
    const googleData = {
      email: email,
      nombre: nombre,
      googleId: `google_${Date.now()}`
    };
    
    // Enviar al backend
    fetch('http://localhost:5000/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(googleData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        if (data.requiresRegistration) {
          // Si es nuevo usuario, mostrar mensaje y redirigir a registro
          alert(`Bienvenido ${data.userData.nombre}!\n\nPor favor, completa tu registro.`);
          // Aquí podrías redirigir a registro con datos precargados
          // Por ahora, simplemente mostramos el mensaje
          setLoginError('Cuenta de Google no registrada. Por favor, regístrate primero.');
        } else {
          // Usuario ya existe - login directo
          console.log('Login con Google exitoso:', data.user);
          setIsLoggedIn(true);
          if (onLogin) {
            onLogin(true);
          }
        }
      }
    })
    .catch(error => {
      console.error('Error en Google Login:', error);
      setLoginError('Error al iniciar sesión con Google');
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  if (isLoggedIn) {
    return <Dashboard onLogout={() => {
      setIsLoggedIn(false);
      setFormData({ email: '', password: '' });
    }} />;
  }

  if (showRegister) {
    return (
      <Register 
        onRegisterSuccess={handleRegisterSuccess}
        onBackToLogin={handleBackToLogin}
      />
    );
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

            <div className="forgot-password-link">
              <button 
                type="button" 
                className="forgot-password-btn"
                onClick={handleForgotPassword}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button 
              type="submit" 
              className="btn-glass"
              disabled={isLoading}
            >
              <span className="btn-glass-outer">
                <span className="btn-glass-inner">
                  <span className="btn-glass-label">
                    {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                  </span>
                </span>
              </span>
            </button>
          </form>

          <div className="register-link-section">
            <p className="register-link-text">
              ¿No tienes cuenta?{' '}
              <button 
                type="button" 
                className="register-link-btn"
                onClick={handleGoToRegister}
              >
                Crear cuenta
              </button>
            </p>
          </div>

          <div className="google-login-section">
            <div className="google-divider">
              <span>O inicia sesión con</span>
            </div>
            <button 
              type="button" 
              className="google-login-btn"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Iniciar sesión con Google</span>
            </button>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-right-content">
          <h2>Sistema de Trámites</h2>
          <p>Plataforma de gestión de trámites municipales</p>
        </div>
      </div>

      {/* Popup de Google - Simula selección de cuenta */}
      {showGooglePopup && (
        <div className="google-popup-overlay" onClick={() => setShowGooglePopup(false)}>
          <div className="google-popup" onClick={(e) => e.stopPropagation()}>
            <div className="google-popup-header">
              <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" alt="Google" className="google-popup-logo" />
              <button className="google-popup-close" onClick={() => setShowGooglePopup(false)}>✕</button>
            </div>
            <div className="google-popup-body">
              <h3>Selecciona una cuenta</h3>
              <p>Continúa con tu cuenta de Google</p>
              <div className="google-accounts">
                <button 
                  className="google-account-btn"
                  onClick={() => handleSelectGoogleAccount('usuario.google@gmail.com', 'Usuario Google')}
                >
                  <div className="google-account-avatar">G</div>
                  <div className="google-account-info">
                    <span className="google-account-name">Usuario Google</span>
                    <span className="google-account-email">usuario.google@gmail.com</span>
                  </div>
                </button>
                <button 
                  className="google-account-btn"
                  onClick={() => handleSelectGoogleAccount('test@gmail.com', 'Test User')}
                >
                  <div className="google-account-avatar">T</div>
                  <div className="google-account-info">
                    <span className="google-account-name">Test User</span>
                    <span className="google-account-email">test@gmail.com</span>
                  </div>
                </button>
              </div>
              <button className="google-add-account">➕ Agregar otra cuenta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;