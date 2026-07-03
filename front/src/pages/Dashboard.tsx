import React, { useState } from 'react';
import ThemeSwitch from '../components/ThemeSwitch';
import './Dashboard.css';

// Importar logo
import logo from '../assets/images/logo_colca1.png';

// Tipos para los trámites
interface Tramite {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'rechazado';
  numero: string;
  tipo: string;
}

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showNewTramite, setShowNewTramite] = useState<boolean>(false);
  const [tramites, setTramites] = useState<Tramite[]>([
    {
      id: 1,
      titulo: 'Licencia de Funcionamiento',
      descripcion: 'Solicitud de licencia para establecimiento comercial',
      fecha: '2026-06-28',
      estado: 'en_proceso',
      numero: 'TR-2026-001',
      tipo: 'Licencia'
    },
    {
      id: 2,
      titulo: 'Permiso de Construcción',
      descripcion: 'Permiso para construcción de vivienda unifamiliar',
      fecha: '2026-06-25',
      estado: 'pendiente',
      numero: 'TR-2026-002',
      tipo: 'Permiso'
    },
    {
      id: 3,
      titulo: 'Certificado de Salud',
      descripcion: 'Certificado para manipulación de alimentos',
      fecha: '2026-06-20',
      estado: 'completado',
      numero: 'TR-2026-003',
      tipo: 'Certificado'
    },
    {
      id: 4,
      titulo: 'Registro de Marca',
      descripcion: 'Registro de marca comercial en INDECOPI',
      fecha: '2026-06-15',
      estado: 'rechazado',
      numero: 'TR-2026-004',
      tipo: 'Registro'
    }
  ]);

  const [nuevoTramite, setNuevoTramite] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'Licencia'
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getEstadoColor = (estado: string) => {
    switch(estado) {
      case 'pendiente': return 'estado-pendiente';
      case 'en_proceso': return 'estado-en-proceso';
      case 'completado': return 'estado-completado';
      case 'rechazado': return 'estado-rechazado';
      default: return '';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch(estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_proceso': return 'En Proceso';
      case 'completado': return 'Completado';
      case 'rechazado': return 'Rechazado';
      default: return estado;
    }
  };

  const handleNewTramite = (e: React.FormEvent) => {
    e.preventDefault();
    const newTramite: Tramite = {
      id: tramites.length + 1,
      titulo: nuevoTramite.titulo,
      descripcion: nuevoTramite.descripcion,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'pendiente',
      numero: `TR-2026-${String(tramites.length + 1).padStart(3, '0')}`,
      tipo: nuevoTramite.tipo
    };
    setTramites([newTramite, ...tramites]);
    setShowNewTramite(false);
    setNuevoTramite({ titulo: '', descripcion: '', tipo: 'Licencia' });
  };

  const stats = {
    total: tramites.length,
    pendientes: tramites.filter(t => t.estado === 'pendiente').length,
    enProceso: tramites.filter(t => t.estado === 'en_proceso').length,
    completados: tramites.filter(t => t.estado === 'completado').length
  };

  return (
    <div className={`dashboard-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className={`rain-bg ${isDarkMode ? 'rain-dark' : 'rain-light'}`}></div>
      
      {/* Header */}
      <header className={`dashboard-header ${isDarkMode ? 'header-dark' : 'header-light'}`}>
        <div className="header-content">
          <div className="header-left">
            <img src={logo} alt="Logo" className="header-logo" />
            <h1 className="header-title">Sistema de Trámites</h1>
          </div>
          <div className="header-right">
            <ThemeSwitch isDark={isDarkMode} onToggle={toggleTheme} />
            <button onClick={onLogout} className="logout-btn">
              <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className={`stat-card ${isDarkMode ? 'stat-dark' : 'stat-light'}`}>
            <div className="stat-icon total-icon">📋</div>
            <div className="stat-info">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Trámites</span>
            </div>
          </div>
          <div className={`stat-card ${isDarkMode ? 'stat-dark' : 'stat-light'}`}>
            <div className="stat-icon pending-icon">⏳</div>
            <div className="stat-info">
              <span className="stat-number">{stats.pendientes}</span>
              <span className="stat-label">Pendientes</span>
            </div>
          </div>
          <div className={`stat-card ${isDarkMode ? 'stat-dark' : 'stat-light'}`}>
            <div className="stat-icon process-icon">🔄</div>
            <div className="stat-info">
              <span className="stat-number">{stats.enProceso}</span>
              <span className="stat-label">En Proceso</span>
            </div>
          </div>
          <div className={`stat-card ${isDarkMode ? 'stat-dark' : 'stat-light'}`}>
            <div className="stat-icon completed-icon">✅</div>
            <div className="stat-info">
              <span className="stat-number">{stats.completados}</span>
              <span className="stat-label">Completados</span>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="actions-bar">
          <div className="actions-left">
            <h2 className="section-title">Mis Trámites</h2>
          </div>
          <div className="actions-right">
            <button 
              className="btn-new-tramite"
              onClick={() => setShowNewTramite(true)}
            >
              <span className="btn-icon">+</span>
              Nuevo Trámite
            </button>
          </div>
        </div>

        {/* Modal Nuevo Trámite */}
        {showNewTramite && (
          <div className="modal-overlay" onClick={() => setShowNewTramite(false)}>
            <div className={`modal-content ${isDarkMode ? 'modal-dark' : 'modal-light'}`} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Nuevo Trámite</h2>
                <button className="modal-close" onClick={() => setShowNewTramite(false)}>×</button>
              </div>
              <form onSubmit={handleNewTramite}>
                <div className="form-group">
                  <label>Título del Trámite</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej: Licencia de Funcionamiento"
                    value={nuevoTramite.titulo}
                    onChange={(e) => setNuevoTramite({...nuevoTramite, titulo: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe el trámite..."
                    value={nuevoTramite.descripcion}
                    onChange={(e) => setNuevoTramite({...nuevoTramite, descripcion: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Trámite</label>
                  <select
                    className="form-select"
                    value={nuevoTramite.tipo}
                    onChange={(e) => setNuevoTramite({...nuevoTramite, tipo: e.target.value})}
                  >
                    <option value="Licencia">Licencia</option>
                    <option value="Permiso">Permiso</option>
                    <option value="Certificado">Certificado</option>
                    <option value="Registro">Registro</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowNewTramite(false)}>Cancelar</button>
                  <button type="submit" className="btn-submit">Crear Trámite</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabla de Trámites */}
        <div className="table-container">
          <table className={`tramites-table ${isDarkMode ? 'table-dark' : 'table-light'}`}>
            <thead>
              <tr>
                <th>N°</th>
                <th>Título</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tramites.map((tramite) => (
                <tr key={tramite.id}>
                  <td className="numero-col">{tramite.numero}</td>
                  <td>
                    <div className="tramite-titulo">
                      <strong>{tramite.titulo}</strong>
                      <span className="tramite-descripcion">{tramite.descripcion}</span>
                    </div>
                  </td>
                  <td>
                    <span className="tipo-badge">{tramite.tipo}</span>
                  </td>
                  <td>{new Date(tramite.fecha).toLocaleDateString('es-ES')}</td>
                  <td>
                    <span className={`estado-badge ${getEstadoColor(tramite.estado)}`}>
                      {getEstadoTexto(tramite.estado)}
                    </span>
                  </td>
                  <td>
                    <button className="btn-ver">Ver</button>
                    <button className="btn-editar">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;