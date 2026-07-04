import React, { useState } from 'react';
import ThemeSwitch from '../components/ThemeSwitch';
import Footer from '../components/Footer';
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Stats Cards - versión mejorada con SVG */}
        <div className="stats-grid">
          <div className="metric-card metric-card--total">
            <div className="metric-card-top">
              <div className="metric-card-notch"></div>
              <span className="metric-card-title">Total</span>
              <div className="metric-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>
            </div>
            <div className="metric-card-bottom">
              <span className="metric-card-number">{stats.total}</span>
            </div>
          </div>

          <div className="metric-card metric-card--pending">
            <div className="metric-card-top">
              <div className="metric-card-notch"></div>
              <span className="metric-card-title">Pendientes</span>
              <div className="metric-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
            </div>
            <div className="metric-card-bottom">
              <span className="metric-card-number">{stats.pendientes}</span>
            </div>
          </div>

          <div className="metric-card metric-card--process">
            <div className="metric-card-top">
              <div className="metric-card-notch"></div>
              <span className="metric-card-title">En Proceso</span>
              <div className="metric-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2v4M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M22 12h-4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
            </div>
            <div className="metric-card-bottom">
              <span className="metric-card-number">{stats.enProceso}</span>
            </div>
          </div>

          <div className="metric-card metric-card--completed">
            <div className="metric-card-top">
              <div className="metric-card-notch"></div>
              <span className="metric-card-title">Completados</span>
              <div className="metric-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
            </div>
            <div className="metric-card-bottom">
              <span className="metric-card-number">{stats.completados}</span>
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
              className="btn-glass"
              onClick={() => setShowNewTramite(true)}
            >
              <span className="btn-glass-outer">
                <span className="btn-glass-inner">
                  <span className="btn-glass-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                  <span className="btn-glass-label">Nuevo Trámite</span>
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Modal Nuevo Trámite */}
        {showNewTramite && (
          <div className="modal-overlay" onClick={() => setShowNewTramite(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Nuevo Trámite</h2>
                <button className="modal-close" onClick={() => setShowNewTramite(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
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
          <table className="tramites-table">
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
                    <div className="table-actions">
                      <button className="btn-glass btn-glass--sm btn-glass--warning">
                        <span className="btn-glass-outer">
                          <span className="btn-glass-inner">
                            <span className="btn-glass-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </span>
                            <span className="btn-glass-label">Ver</span>
                          </span>
                        </span>
                      </button>
                      <button className="btn-glass btn-glass--sm">
                        <span className="btn-glass-outer">
                          <span className="btn-glass-inner">
                            <span className="btn-glass-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                              </svg>
                            </span>
                            <span className="btn-glass-label">Editar</span>
                          </span>
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <Footer onLogout={onLogout} isDarkMode={isDarkMode} />
      </main>
    </div>
  );
};

export default Dashboard;