import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import './AdminLogin.css';
import logo from '../assets/images/logo_colca1.png';
import AdminPanel from './AdminPanel';

interface AdminLoginForm {
  email: string;
  password: string;
}

interface AdminLoginProps {
  onBackToUserLogin?: () => void;
}

interface AdminUser {
  id: number;
  usuario: string;
  nombre: string;
  email: string;
  ci: string;
  role: string;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToUserLogin }) => {
  const [formData, setFormData] = useState<AdminLoginForm>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        setAdminUser(data.user);
        return;
      }

      setError(data.message || 'No se pudo iniciar sesión como administrador');
    } catch (requestError) {
      console.error('Error en login admin:', requestError);
      setError('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setAdminUser(null);
    setFormData({ email: '', password: '' });
  };

  if (adminUser) {
    return (
      <AdminPanel
        adminUser={adminUser}
        onLogout={handleLogout}
        onBackToUserLogin={onBackToUserLogin}
      />
    );
  }

  return (
    <div className="admin-login-shell">
      <div className="admin-login-panel admin-login-panel--left">
        <div className="admin-login-branding">
          <img src={logo} alt="Logo Colca" className="admin-login-logo" />
          <div>
            <p className="admin-login-kicker">Acceso restringido</p>
            <h1>Panel de Administración</h1>
            <p className="admin-login-copy">
              Ingreso exclusivo para gestionar usuarios, revisar trámites y supervisar el sistema.
            </p>
          </div>
        </div>
      </div>

      <div className="admin-login-panel admin-login-panel--right">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <span className="admin-login-badge">/admin</span>
            <h2>Iniciar sesión como administrador</h2>
            <p>Usa tus credenciales de administrador para acceder al panel.</p>
          </div>

          {error && <div className="admin-login-error">{error}</div>}

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label className="admin-login-field">
              <span>Usuario o correo</span>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@admin.com"
                autoComplete="username"
              />
            </label>

            <label className="admin-login-field">
              <span>Contraseña</span>
              <div className="admin-login-password-row">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="admin-login-toggle"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </label>

            <button className="admin-login-submit" type="submit" disabled={isLoading}>
              {isLoading ? 'Validando...' : 'Entrar al panel'}
            </button>
          </form>

          <div className="admin-login-footer">
            <button type="button" className="admin-login-link" onClick={onBackToUserLogin}>
              Volver al acceso de usuarios
            </button>
            <span>Credencial de prueba: admin / admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
