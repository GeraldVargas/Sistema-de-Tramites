import React, { useState } from 'react';
import ThemeSwitch from '../components/ThemeSwitch';
import Footer from '../components/Footer';
import './Dashboard.css';
import NuevoTramite from './NuevoTramite';

// Importar logo
import logo from '../assets/images/logo_colca1.png';

// Tipos para los trámites
interface Tramite {
  id_tramite: number;
  id_tipo_tramite: number;
  cite_tramite: string;
  id_documento: number;
  estado_tramite: 'pendiente' | 'en_proceso' | 'completado' | 'rechazado';
  id_funcionario: number;
  ubicacion: string;
  fojas: number;
  num_resolucion: number;
  fecha_resolucion: string;
  observacion: string;
  detalle?: TramiteDetalle;
}

interface TramiteDetalle {
  id_tramite: number;
  cite_tramite: string;
  descripcion: string;
  estado_reg: string;
  cargo: string;
  email_empresa: string;
}

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showNewTramite, setShowNewTramite] = useState<boolean>(false);
  const [showDetalles, setShowDetalles] = useState<boolean>(false);
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null);
  
  const [tramites, setTramites] = useState<Tramite[]>([
    {
      id_tramite: 1,
      id_tipo_tramite: 1,
      cite_tramite: 'CITE-2026-001',
      id_documento: 1001,
      estado_tramite: 'en_proceso',
      id_funcionario: 101,
      ubicacion: 'Oficina 301 - Área de Licencias',
      fojas: 25,
      num_resolucion: 456,
      fecha_resolucion: '2026-06-28',
      observacion: 'Documentación completa, en espera de firma',
      detalle: {
        id_tramite: 1,
        cite_tramite: 'CITE-2026-001',
        descripcion: 'Solicitud de licencia para establecimiento comercial',
        estado_reg: 'ACTIVO',
        cargo: 'Jefe de Licencias',
        email_empresa: 'comercial@empresa.com'
      }
    },
    {
      id_tramite: 2,
      id_tipo_tramite: 2,
      cite_tramite: 'CITE-2026-002',
      id_documento: 1002,
      estado_tramite: 'pendiente',
      id_funcionario: 102,
      ubicacion: 'Oficina 205 - Área de Construcción',
      fojas: 40,
      num_resolucion: 0,
      fecha_resolucion: '2026-06-25',
      observacion: 'Esperando revisión de planos',
      detalle: {
        id_tramite: 2,
        cite_tramite: 'CITE-2026-002',
        descripcion: 'Permiso para construcción de vivienda unifamiliar',
        estado_reg: 'PENDIENTE',
        cargo: 'Ingeniero Civil',
        email_empresa: 'constructora@proyecto.com'
      }
    },
    {
      id_tramite: 3,
      id_tipo_tramite: 3,
      cite_tramite: 'CITE-2026-003',
      id_documento: 1003,
      estado_tramite: 'completado',
      id_funcionario: 103,
      ubicacion: 'Oficina 102 - Área de Salud',
      fojas: 15,
      num_resolucion: 789,
      fecha_resolucion: '2026-06-20',
      observacion: 'Certificado emitido correctamente',
      detalle: {
        id_tramite: 3,
        cite_tramite: 'CITE-2026-003',
        descripcion: 'Certificado para manipulación de alimentos',
        estado_reg: 'COMPLETADO',
        cargo: 'Médico Inspector',
        email_empresa: 'alimentos@empresa.com'
      }
    },
    {
      id_tramite: 4,
      id_tipo_tramite: 4,
      cite_tramite: 'CITE-2026-004',
      id_documento: 1004,
      estado_tramite: 'rechazado',
      id_funcionario: 104,
      ubicacion: 'Oficina 150 - Área de Registros',
      fojas: 30,
      num_resolucion: 0,
      fecha_resolucion: '2026-06-15',
      observacion: 'Documentación incompleta, solicitar subsanación',
      detalle: {
        id_tramite: 4,
        cite_tramite: 'CITE-2026-004',
        descripcion: 'Registro de marca comercial en INDECOPI',
        estado_reg: 'RECHAZADO',
        cargo: 'Especialista en Propiedad Intelectual',
        email_empresa: 'marca@empresa.com'
      }
    }
  ]);

  // Estado para el nuevo trámite con todos los campos de ambas tablas
  const [nuevoTramite, setNuevoTramite] = useState({
    // Campos de tramites
    id_tipo_tramite: 1,
    cite_tramite: '',
    id_documento: 0,
    estado_tramite: 'pendiente' as 'pendiente' | 'en_proceso' | 'completado' | 'rechazado',
    id_funcionario: 0,
    ubicacion: '',
    fojas: 0,
    num_resolucion: 0,
    fecha_resolucion: '',
    observacion: '',
    // Campos de tramites_detalle
    descripcion: '',
    estado_reg: 'PENDIENTE',
    cargo: '',
    email_empresa: ''
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
    
    const newId = tramites.length + 1;
    
    const newTramite: Tramite = {
      id_tramite: newId,
      id_tipo_tramite: nuevoTramite.id_tipo_tramite,
      cite_tramite: nuevoTramite.cite_tramite || `CITE-2026-${String(newId).padStart(3, '0')}`,
      id_documento: nuevoTramite.id_documento || 1000 + newId,
      estado_tramite: nuevoTramite.estado_tramite,
      id_funcionario: nuevoTramite.id_funcionario || 101,
      ubicacion: nuevoTramite.ubicacion || 'Por asignar',
      fojas: nuevoTramite.fojas || 0,
      num_resolucion: nuevoTramite.num_resolucion || 0,
      fecha_resolucion: nuevoTramite.fecha_resolucion || new Date().toISOString().split('T')[0],
      observacion: nuevoTramite.observacion || 'Sin observación',
      detalle: {
        id_tramite: newId,
        cite_tramite: nuevoTramite.cite_tramite || `CITE-2026-${String(newId).padStart(3, '0')}`,
        descripcion: nuevoTramite.descripcion || 'Descripción pendiente',
        estado_reg: nuevoTramite.estado_reg || 'PENDIENTE',
        cargo: nuevoTramite.cargo || 'Por asignar',
        email_empresa: nuevoTramite.email_empresa || 'sin-email@empresa.com'
      }
    };
    
    setTramites([newTramite, ...tramites]);
    setShowNewTramite(false);
    
    // Resetear el formulario
    setNuevoTramite({
      id_tipo_tramite: 1,
      cite_tramite: '',
      id_documento: 0,
      estado_tramite: 'pendiente',
      id_funcionario: 0,
      ubicacion: '',
      fojas: 0,
      num_resolucion: 0,
      fecha_resolucion: '',
      observacion: '',
      descripcion: '',
      estado_reg: 'PENDIENTE',
      cargo: '',
      email_empresa: ''
    });
  };

  const handleVerDetalles = (tramite: Tramite) => {
    setSelectedTramite(tramite);
    setShowDetalles(true);
  };

  const stats = {
    total: tramites.length,
    pendientes: tramites.filter(t => t.estado_tramite === 'pendiente').length,
    enProceso: tramites.filter(t => t.estado_tramite === 'en_proceso').length,
    completados: tramites.filter(t => t.estado_tramite === 'completado').length
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
        {/* Stats Cards */}
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

        {/* Modal Nuevo Trámite - Versión anterior (para mantener compatibilidad) */}
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
              
              <div className="modal-body">
                <form id="nuevoTramiteForm" onSubmit={handleNewTramite}>
                  {/* Sección: Datos del Trámite */}
                  <div className="form-section">
                    <h3 className="form-section-title">Datos del Trámite</h3>
                    
                    <div className="form-group">
                      <label>Tipo de Trámite *</label>
                      <select
                        className="form-select"
                        value={nuevoTramite.id_tipo_tramite}
                        onChange={(e) => setNuevoTramite({...nuevoTramite, id_tipo_tramite: parseInt(e.target.value)})}
                        required
                      >
                        <option value="1">Licencia</option>
                        <option value="2">Permiso</option>
                        <option value="3">Certificado</option>
                        <option value="4">Registro</option>
                        <option value="5">Otro</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>CITE</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ej: CITE-2026-001"
                        value={nuevoTramite.cite_tramite}
                        onChange={(e) => setNuevoTramite({...nuevoTramite, cite_tramite: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>ID Documento</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="ID del documento"
                        value={nuevoTramite.id_documento}
                        onChange={(e) => setNuevoTramite({...nuevoTramite, id_documento: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Estado del Trámite *</label>
                      <select
                        className="form-select"
                        value={nuevoTramite.estado_tramite}
                        onChange={(e) => setNuevoTramite({...nuevoTramite, estado_tramite: e.target.value as 'pendiente' | 'en_proceso' | 'completado' | 'rechazado'})}
                        required
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="completado">Completado</option>
                        <option value="rechazado">Rechazado</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>ID Funcionario</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="ID del funcionario"
                        value={nuevoTramite.id_funcionario}
                        onChange={(e) => setNuevoTramite({...nuevoTramite, id_funcionario: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Ubicación</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ej: Oficina 301 - Área de Licencias"
                        value={nuevoTramite.ubicacion}
                        onChange={(e) => setNuevoTramite({...nuevoTramite, ubicacion: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Fojas</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Número de fojas"
                        value={nuevoTramite.fojas}
                        onChange={(e) => setNuevoTramite({...nuevoTramite, fojas: parseInt(e.target.value) || 0})}
                        min="0"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Número de Resolución</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Número de resolución"
                        value={nuevoTramite.num_resolucion}
                        onChange={(e) => setNuevoTramite({...nuevoTramite, num_resolucion: parseInt(e.target.value) || 0})}
                        min="0"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Fecha de Resolución</label>
                      <input
                        type="date"
                        className="form-input"
                        value={nuevoTramite.fecha_resolucion}
                        onChange={(e) => setNuevoTramite({...nuevoTramite, fecha_resolucion: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Observación</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Observaciones del trámite..."
                        value={nuevoTramite.observacion}
                        onChange={(e) => setNuevoTramite({...nuevoTramite, observacion: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Separador */}
                  <div className="form-divider"></div>

                  {/* Sección: Detalles del Trámite */}
                  <div className="form-section">
                    <h3 className="form-section-title">Detalles del Trámite</h3>
                    
                    <div className="form-group">
                      <label>Descripción *</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Descripción detallada del trámite..."
                        value={nuevoTramite.descripcion}
                        onChange={(e) => setNuevoTramite({...nuevoTramite, descripcion: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Estado de Registro</label>
                      <select
                        className="form-select"
                        value={nuevoTramite.estado_reg}
                        onChange={(e) => setNuevoTramite({...nuevoTramite, estado_reg: e.target.value})}
                      >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="ACTIVO">ACTIVO</option>
                        <option value="COMPLETADO">COMPLETADO</option>
                        <option value="RECHAZADO">RECHAZADO</option>
                        <option value="EN_REVISION">EN REVISIÓN</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Cargo del Funcionario</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ej: Jefe de Licencias"
                        value={nuevoTramite.cargo}
                        onChange={(e) => setNuevoTramite({...nuevoTramite, cargo: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Email Empresa</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="Ej: empresa@correo.com"
                        value={nuevoTramite.email_empresa}
                        onChange={(e) => setNuevoTramite({...nuevoTramite, email_empresa: e.target.value})}
                      />
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowNewTramite(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit" form="nuevoTramiteForm">
                  Crear Trámite
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Detalles */}
        {showDetalles && selectedTramite && (
          <div className="modal-overlay" onClick={() => setShowDetalles(false)}>
            <div className="modal-content modal-detalles" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Detalles del Trámite</h2>
                <button className="modal-close" onClick={() => setShowDetalles(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              
              <div className="modal-body">
                <div className="detalles-grid">
                  <div className="detalle-item">
                    <span className="detalle-label">ID Trámite:</span>
                    <span className="detalle-valor">{selectedTramite.id_tramite}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">CITE:</span>
                    <span className="detalle-valor">{selectedTramite.cite_tramite}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">Tipo Trámite:</span>
                    <span className="detalle-valor">
                      {selectedTramite.id_tipo_tramite === 1 ? 'Licencia' :
                       selectedTramite.id_tipo_tramite === 2 ? 'Permiso' :
                       selectedTramite.id_tipo_tramite === 3 ? 'Certificado' :
                       selectedTramite.id_tipo_tramite === 4 ? 'Registro' : 'Otro'}
                    </span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">ID Documento:</span>
                    <span className="detalle-valor">{selectedTramite.id_documento}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">Estado:</span>
                    <span className={`estado-badge ${getEstadoColor(selectedTramite.estado_tramite)}`}>
                      {getEstadoTexto(selectedTramite.estado_tramite)}
                    </span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">ID Funcionario:</span>
                    <span className="detalle-valor">{selectedTramite.id_funcionario}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">Ubicación:</span>
                    <span className="detalle-valor">{selectedTramite.ubicacion}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">Fojas:</span>
                    <span className="detalle-valor">{selectedTramite.fojas}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">N° Resolución:</span>
                    <span className="detalle-valor">{selectedTramite.num_resolucion || '-'}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">Fecha Resolución:</span>
                    <span className="detalle-valor">
                      {selectedTramite.fecha_resolucion ? new Date(selectedTramite.fecha_resolucion).toLocaleDateString('es-ES') : '-'}
                    </span>
                  </div>
                  <div className="detalle-item full-width">
                    <span className="detalle-label">Observación:</span>
                    <span className="detalle-valor">{selectedTramite.observacion || 'Sin observación'}</span>
                  </div>
                  
                  {/* Sección de tramites_detalle */}
                  <div className="detalles-divider">
                    <span>Información Adicional</span>
                  </div>
                  
                  {selectedTramite.detalle ? (
                    <>
                      <div className="detalle-item full-width">
                        <span className="detalle-label">Descripción:</span>
                        <span className="detalle-valor">{selectedTramite.detalle.descripcion}</span>
                      </div>
                      <div className="detalle-item">
                        <span className="detalle-label">Estado Registro:</span>
                        <span className="detalle-valor">{selectedTramite.detalle.estado_reg}</span>
                      </div>
                      <div className="detalle-item">
                        <span className="detalle-label">Cargo:</span>
                        <span className="detalle-valor">{selectedTramite.detalle.cargo}</span>
                      </div>
                      <div className="detalle-item">
                        <span className="detalle-label">Email Empresa:</span>
                        <span className="detalle-valor">{selectedTramite.detalle.email_empresa}</span>
                      </div>
                    </>
                  ) : (
                    <div className="detalle-item full-width">
                      <span className="detalle-valor" style={{color: 'var(--text-muted)'}}>
                        No hay información adicional disponible
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowDetalles(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de Trámites */}
        <div className="table-container">
          <table className="tramites-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>CITE</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Ubicación</th>
                <th>Fojas</th>
                <th>N° Resolución</th>
                <th>Fecha Res.</th>
                <th>Observación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tramites.map((tramite) => (
                <tr key={tramite.id_tramite}>
                  <td className="numero-col">{tramite.id_tramite}</td>
                  <td className="cite-col">{tramite.cite_tramite}</td>
                  <td>
                    <span className="tipo-badge">
                      {tramite.id_tipo_tramite === 1 ? 'Licencia' :
                       tramite.id_tipo_tramite === 2 ? 'Permiso' :
                       tramite.id_tipo_tramite === 3 ? 'Certificado' :
                       tramite.id_tipo_tramite === 4 ? 'Registro' : 'Otro'}
                    </span>
                  </td>
                  <td>
                    <span className={`estado-badge ${getEstadoColor(tramite.estado_tramite)}`}>
                      {getEstadoTexto(tramite.estado_tramite)}
                    </span>
                  </td>
                  <td className="ubicacion-col" title={tramite.ubicacion}>
                    {tramite.ubicacion}
                  </td>
                  <td className="fojas-col">{tramite.fojas}</td>
                  <td>{tramite.num_resolucion || '-'}</td>
                  <td>
                    {tramite.fecha_resolucion ? 
                      new Date(tramite.fecha_resolucion).toLocaleDateString('es-ES') : 
                      '-'
                    }
                  </td>
                  <td className="observacion-col" title={tramite.observacion}>
                    <div className="tramite-observacion">
                      {tramite.observacion}
                    </div>
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
                      <button 
                        className="btn-glass btn-glass--sm btn-glass--info"
                        onClick={() => handleVerDetalles(tramite)}
                      >
                        <span className="btn-glass-outer">
                          <span className="btn-glass-inner">
                            <span className="btn-glass-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                              </svg>
                            </span>
                            <span className="btn-glass-label">Detalles</span>
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

      {/* Nuevo Trámite - Componente completo con QR y comprobante */}
      {showNewTramite && (
        <NuevoTramite 
          onTramiteCreado={() => {
            setShowNewTramite(false);
            // Aquí puedes agregar lógica para recargar la lista de trámites
            alert('✅ Trámite creado exitosamente');
          }}
          onCancelar={() => setShowNewTramite(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;