import React, { useState, ChangeEvent, FormEvent } from 'react';
import './Register.css';
import logo from '../assets/images/logo_colca1.png';

interface RegisterForm {
  nombre: string;
  ci: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterProps {
  onRegisterSuccess: () => void;
  onBackToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onBackToLogin }) => {
  const [formData, setFormData] = useState<RegisterForm>({
    nombre: '',
    ci: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Partial<RegisterForm>>({});
  const [registerError, setRegisterError] = useState<string>('');
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setRegisterError('');
    if (errors[name as keyof RegisterForm]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterForm> = {};

    if (!formData.nombre || formData.nombre.trim() === '') {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.ci || formData.ci.trim() === '') {
      newErrors.ci = 'La cédula de identidad es requerida';
    } else if (!/^[0-9]+$/.test(formData.ci)) {
      newErrors.ci = 'La cédula debe contener solo números';
    }

    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.password || formData.password.trim() === '') {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterError('');
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        const API_URL = 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.nombre,
            ci: formData.ci,
            email: formData.email,
            password: formData.password
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          setRegisterSuccess(true);
          setTimeout(() => {
            onRegisterSuccess();
          }, 2000);
        } else {
          setRegisterError(data.message || 'Error al registrar usuario');
        }
      } catch (error) {
        console.error('Error en registro:', error);
        setRegisterError('Error al conectar con el servidor');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="rain-bg"></div>

        <div className="register-card">
          <div className="logo-container">
            <img src={logo} alt="Logo Colca" className="logo-image" />
          </div>

          <h2 className="register-title">Crear Cuenta</h2>
          <p className="register-subtitle">Regístrate para acceder al sistema</p>

          {registerError && <div className="register-error">{registerError}</div>}
          
          {registerSuccess && (
            <div className="register-success">
              ✅ ¡Registro exitoso! Redirigiendo al login...
            </div>
          )}

          <form className="register-form" onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className="register-input-wrapper">
              <input
                type="text"
                name="nombre"
                className={`register-input ${errors.nombre ? 'register-input-error' : ''}`}
                placeholder="Nombre Completo"
                value={formData.nombre}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.nombre && <span className="register-error-message">{errors.nombre}</span>}
            </div>

            {/* Cédula */}
            <div className="register-input-wrapper">
              <input
                type="text"
                name="ci"
                className={`register-input ${errors.ci ? 'register-input-error' : ''}`}
                placeholder="Cédula de Identidad"
                value={formData.ci}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.ci && <span className="register-error-message">{errors.ci}</span>}
            </div>

            {/* Email */}
            <div className="register-input-wrapper">
              <input
                type="email"
                name="email"
                className={`register-input ${errors.email ? 'register-input-error' : ''}`}
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <span className="register-error-message">{errors.email}</span>}
            </div>

            {/* Contraseña */}
            <div className="register-input-wrapper password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`register-input password-input ${errors.password ? 'register-input-error' : ''}`}
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button 
                type="button"
                className="register-password-toggle"
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
              {errors.password && <span className="register-error-message">{errors.password}</span>}
            </div>

            {/* Confirmar Contraseña */}
            <div className="register-input-wrapper password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className={`register-input password-input ${errors.confirmPassword ? 'register-input-error' : ''}`}
                placeholder="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button 
                type="button"
                className="register-password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? (
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
              {errors.confirmPassword && <span className="register-error-message">{errors.confirmPassword}</span>}
            </div>

           <button
            type="submit"
            className="register-btn-glass"
            disabled={isLoading || registerSuccess}
            >
            <div className="register-btn-glass-outer">
                <div className="register-btn-glass-inner">
                <span className="register-btn-glass-label">
                    {isLoading ? "Registrando..." : "Crear Cuenta"}
                </span>
                </div>
            </div>
            </button>
          </form>

          <div className="register-footer">
            <p>
              ¿Ya tienes cuenta?{' '}
              <button 
                type="button" 
                className="register-back-link"
                onClick={onBackToLogin}
              >
                Iniciar Sesión
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="register-right">
        <div className="register-right-content">
          <h2>Sistema de Trámites</h2>
          <p>Crea tu cuenta y gestiona tus trámites fácilmente</p>
        </div>
      </div>
    </div>
  );
};

export default Register;