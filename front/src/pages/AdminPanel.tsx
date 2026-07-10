import React, { useEffect, useState } from 'react';
import './AdminPanel.css';
import logo from '../assets/images/logo_colca1.png';

interface AdminUser {
  id: number;
  usuario: string;
  nombre: string;
  email: string;
  ci: string;
  role: string;
}

interface AdminPanelProps {
  adminUser: AdminUser;
  onLogout: () => void;
  onBackToUserLogin?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ adminUser, onLogout, onBackToUserLogin }) => {
  const [usuarios, setUsuarios] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/usuarios');
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error cargando usuarios del admin:', error);
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsuarios();
  }, []);

  const totalUsuarios = usuarios.length;
  const totalAdmins = usuarios.filter(usuario => usuario.role === 'admin').length;
  const totalRegulares = usuarios.filter(usuario => usuario.role !== 'admin').length;

  return (
    <div className="admin-panel-shell">
      <header className="admin-panel-header">
        <div className="admin-panel-brand">
          <img src={logo} alt="Logo Colca" className="admin-panel-logo" />
          <div>
            <p className="admin-panel-kicker">Panel administrativo</p>
            <h1>Sistema de Trámites</h1>
          </div>
        </div>

        <div className="admin-panel-actions">
          <span className="admin-panel-user">{adminUser.nombre}</span>
          <button type="button" className="admin-panel-secondary" onClick={onBackToUserLogin}>
            Ir al login de usuarios
          </button>
          <button type="button" className="admin-panel-primary" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="admin-panel-main">
        <section className="admin-panel-hero">
          <div>
            <span className="admin-panel-badge">Rol: {adminUser.role}</span>
            <h2>Bienvenido, {adminUser.nombre}</h2>
            <p>
              Desde aquí puedes revisar el estado del sistema y administrar la base de usuarios.
            </p>
          </div>
        </section>

        <section className="admin-panel-stats">
          <article className="admin-stat-card">
            <span>Total de usuarios</span>
            <strong>{totalUsuarios}</strong>
          </article>
          <article className="admin-stat-card">
            <span>Administradores</span>
            <strong>{totalAdmins}</strong>
          </article>
          <article className="admin-stat-card">
            <span>Usuarios regulares</span>
            <strong>{totalRegulares}</strong>
          </article>
        </section>

        <section className="admin-panel-table-card">
          <div className="admin-panel-table-header">
            <h3>Usuarios registrados</h3>
            <p>{loading ? 'Cargando usuarios...' : 'Listado actualizado desde el backend'}</p>
          </div>

          <div className="admin-panel-table-wrap">
            <table className="admin-panel-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>CI</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.usuario}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.ci}</td>
                    <td>
                      <span className={`admin-role-badge admin-role-badge--${usuario.role}`}>
                        {usuario.role}
                      </span>
                    </td>
                  </tr>
                ))}
                {!loading && usuarios.length === 0 && (
                  <tr>
                    <td colSpan={6} className="admin-panel-empty">
                      No hay usuarios para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;
