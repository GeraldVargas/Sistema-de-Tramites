import React, { useMemo, useState } from 'react';
import ThemeSwitch from '../components/ThemeSwitch';
import './Dashboard.css';

// Importar logo
import logo from '../assets/images/logo_colca1.png';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type EstadoTramite = 'pendiente' | 'en_proceso' | 'completado' | 'rechazado';

interface Tramite {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  estado: EstadoTramite;
  numero: string;
  tipo: string;
}

interface DashboardProps {
  onLogout: () => void;
}

interface NuevoTramiteForm {
  titulo: string;
  descripcion: string;
  tipo: string;
}

const TIPOS_TRAMITE = ['Licencia', 'Permiso', 'Certificado', 'Registro', 'Otro'] as const;

const ESTADO_CONFIG: Record<EstadoTramite, { label: string; className: string }> = {
  pendiente: { label: 'Pendiente', className: 'estado-pendiente' },
  en_proceso: { label: 'En Proceso', className: 'estado-en-proceso' },
  completado: { label: 'Completado', className: 'estado-completado' },
  rechazado: { label: 'Rechazado', className: 'estado-rechazado' },
};

const TRAMITES_INICIALES: Tramite[] = [
  {
    id: 1,
    titulo: 'Licencia de Funcionamiento',
    descripcion: 'Solicitud de licencia para establecimiento comercial',
    fecha: '2026-06-28',
    estado: 'en_proceso',
    numero: 'TR-2026-001',
    tipo: 'Licencia',
  },
  {
    id: 2,
    titulo: 'Permiso de Construcción',
    descripcion: 'Permiso para construcción de vivienda unifamiliar',
    fecha: '2026-06-25',
    estado: 'pendiente',
    numero: 'TR-2026-002',
    tipo: 'Permiso',
  },
  {
    id: 3,
    titulo: 'Certificado de Salud',
    descripcion: 'Certificado para manipulación de alimentos',
    fecha: '2026-06-20',
    estado: 'completado',
    numero: 'TR-2026-003',
    tipo: 'Certificado',
  },
  {
    id: 4,
    titulo: 'Registro de Marca',
    descripcion: 'Registro de marca comercial en INDECOPI',
    fecha: '2026-06-15',
    estado: 'rechazado',
    numero: 'TR-2026-004',
    tipo: 'Registro',
  },
];

const FORM_INICIAL: NuevoTramiteForm = {
  titulo: '',
  descripcion: '',
  tipo: 'Licencia',
};

// ---------------------------------------------------------------------------
// Iconos (SVG en línea — sin emojis)
// ---------------------------------------------------------------------------

const IconTotal: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 2h6a1 1 0 011 1v2H8V3a1 1 0 011-1z" />
    <rect x="5" y="5" width="14" height="16" rx="2" />
    <path d="M9 12h6M9 16h6" />
  </svg>
);

const IconPending: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

const IconProcess: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 10-3.5 7.1" />
    <path d="M21 5v6h-6" />
  </svg>
);

const IconCompleted: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.5 2.5 4.5-5" />
  </svg>
);

const IconPlus: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const IconClose: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const IconEmpty: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M4 10h16M9 15h6" />
  </svg>
);

const IconLogout: React.FC = () => (
  <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showNewTramite, setShowNewTramite] = useState<boolean>(false);
  const [tramites, setTramites] = useState<Tramite[]>(TRAMITES_INICIALES);
  const [nuevoTramite, setNuevoTramite] = useState<NuevoTramiteForm>(FORM_INICIAL);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const stats = useMemo(
    () => ({
      total: tramites.length,
      pendientes: tramites.filter((t) => t.estado === 'pendiente').length,
      enProceso: tramites.filter((t) => t.estado === 'en_proceso').length,
      completados: tramites.filter((t) => t.estado === 'completado').length,
    }),
    [tramites]
  );

  const closeModal = () => {
    setShowNewTramite(false);
    setNuevoTramite(FORM_INICIAL);
  };

  const handleNewTramite = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoId = tramites.length + 1;
    const tramite: Tramite = {
      id: nuevoId,
      titulo: nuevoTramite.titulo,
      descripcion: nuevoTramite.descripcion,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'pendiente',
      numero: `TR-2026-${String(nuevoId).padStart(3, '0')}`,
      tipo: nuevoTramite.tipo,
    };
    setTramites((prev) => [tramite, ...prev]);
    closeModal();
  };

  return (
    <div className={`dashboard-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <img src={logo} alt="Logo" className="header-logo" />
            <h1 className="header-title">Sistema de Trámites</h1>
          </div>
          <div className="header-right">
            <ThemeSwitch isDark={isDarkMode} onToggle={toggleTheme} />
            <button onClick={onLogout} className="btn-glass btn-glass--danger btn-glass--logout" type="button">
              <span className="btn-glass-outer">
                <span className="btn-glass-inner">
                  <span className="btn-glass-icon">
                    <IconLogout />
                  </span>
                  <span className="btn-glass-label">Cerrar Sesión</span>
                </span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Stats Cards */}
        <section className="stats-grid" aria-label="Resumen de trámites">
          <div className="metric-card metric-card--total">
            <div className="metric-card-top">
              <div className="metric-card-notch" />
              <span className="metric-card-title">Total Trámites</span>
              <div className="metric-card-icon">
                <IconTotal />
              </div>
            </div>
            <div className="metric-card-bottom">
              <span className="metric-card-number">{stats.total}</span>
            </div>
          </div>

          <div className="metric-card metric-card--pending">
            <div className="metric-card-top">
              <div className="metric-card-notch" />
              <span className="metric-card-title">Pendientes</span>
              <div className="metric-card-icon">
                <IconPending />
              </div>
            </div>
            <div className="metric-card-bottom">
              <span className="metric-card-number">{stats.pendientes}</span>
            </div>
          </div>

          <div className="metric-card metric-card--process">
            <div className="metric-card-top">
              <div className="metric-card-notch" />
              <span className="metric-card-title">En Proceso</span>
              <div className="metric-card-icon">
                <IconProcess />
              </div>
            </div>
            <div className="metric-card-bottom">
              <span className="metric-card-number">{stats.enProceso}</span>
            </div>
          </div>

          <div className="metric-card metric-card--completed">
            <div className="metric-card-top">
              <div className="metric-card-notch" />
              <span className="metric-card-title">Completados</span>
              <div className="metric-card-icon">
                <IconCompleted />
              </div>
            </div>
            <div className="metric-card-bottom">
              <span className="metric-card-number">{stats.completados}</span>
            </div>
          </div>
        </section>

        {/* Actions Bar */}
        <div className="actions-bar">
          <h2 className="section-title">Mis Trámites</h2>
          <button className="btn-glass" onClick={() => setShowNewTramite(true)} type="button">
            <span className="btn-glass-outer">
              <span className="btn-glass-inner">
                <span className="btn-glass-icon">
                  <IconPlus />
                </span>
                <span className="btn-glass-label">Nuevo Trámite</span>
              </span>
            </span>
          </button>
        </div>

        {/* Modal Nuevo Trámite */}
        {showNewTramite && (
          <div className="modal-overlay" onClick={closeModal} role="presentation">
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-titulo"
            >
              <div className="modal-header">
                <h2 id="modal-titulo">Nuevo Trámite</h2>
                <button className="modal-close" onClick={closeModal} type="button" aria-label="Cerrar">
                  <IconClose />
                </button>
              </div>
              <form onSubmit={handleNewTramite}>
                <div className="form-group">
                  <label htmlFor="titulo">Título del Trámite</label>
                  <input
                    id="titulo"
                    type="text"
                    className="form-input"
                    placeholder="Ej: Licencia de Funcionamiento"
                    value={nuevoTramite.titulo}
                    onChange={(e) => setNuevoTramite({ ...nuevoTramite, titulo: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    className="form-textarea"
                    placeholder="Describe el trámite..."
                    value={nuevoTramite.descripcion}
                    onChange={(e) => setNuevoTramite({ ...nuevoTramite, descripcion: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="tipo">Tipo de Trámite</label>
                  <select
                    id="tipo"
                    className="form-select"
                    value={nuevoTramite.tipo}
                    onChange={(e) => setNuevoTramite({ ...nuevoTramite, tipo: e.target.value })}
                  >
                    {TIPOS_TRAMITE.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-submit">
                    Crear Trámite
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabla de Trámites */}
        <div className="table-container">
          {tramites.length === 0 ? (
            <div className="empty-state">
              <IconEmpty />
              <span className="empty-state-title">Aún no tienes trámites</span>
              <span className="empty-state-subtitle">
                Los trámites que registres aparecerán aquí. Empieza creando uno nuevo.
              </span>
            </div>
          ) : (
            <table className="tramites-table">
              <thead>
                <tr>
                  <th scope="col">N°</th>
                  <th scope="col">Título</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tramites.map((tramite) => {
                  const estado = ESTADO_CONFIG[tramite.estado];
                  return (
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
                        <span className={`estado-badge ${estado.className}`}>{estado.label}</span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-glass btn-glass--sm" type="button">
                            <span className="btn-glass-outer">
                              <span className="btn-glass-inner">
                                <span className="btn-glass-label">Ver</span>
                              </span>
                            </span>
                          </button>
                          <button className="btn-glass btn-glass--sm btn-glass--warning" type="button">
                            <span className="btn-glass-outer">
                              <span className="btn-glass-inner">
                                <span className="btn-glass-label">Editar</span>
                              </span>
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;