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

interface Tramite {
  id: number;
  solicitante: {
    ci: string;
    nombre: string;
    celular: string;
    fechaNacimiento: string;
  };
  apoderado: any;
  documentos: any;
  tramiteDetalle: {
    id_tramite: number;
    cite_tramite: string;
    id_tipo_tramite: number;
    tipo_tramite: string;
    id_documento: number;
    estado_tramite: string;
    id_funcionario: number;
    ubicacion: string;
    fojas: number;
    num_resolucion: number;
    fecha_resolucion: string;
    observacion: string;
    descripcion: string;
    estado_reg: string;
    cargo: string;
    email_empresa: string;
  };
  ubicacion: string;
  cantidadHojas: number;
  estado: string;
  precio: number;
  comprobantePago: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
}

interface AdminPanelProps {
  adminUser: AdminUser;
  onLogout: () => void;
  onBackToUserLogin?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ adminUser, onLogout, onBackToUserLogin }) => {
  const [usuarios, setUsuarios] = useState<AdminUser[]>([]);
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'usuarios' | 'tramites'>('tramites');
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState<Tramite | null>(null);

  const loadData = async () => {
    try {
      const [usuariosRes, tramitesRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/usuarios'),
        fetch('http://localhost:5000/api/tramites')
      ]);
      
      const usuariosData = await usuariosRes.json();
      const tramitesData = await tramitesRes.json();
      
      setUsuarios(usuariosData);
      setTramites(tramitesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setUsuarios([]);
      setTramites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalUsuarios = usuarios.length;
  const totalAdmins = usuarios.filter(usuario => usuario.role === 'admin').length;
  const totalRegulares = usuarios.filter(usuario => usuario.role !== 'admin').length;

  const totalTramites = tramites.length;
  const pendientes = tramites.filter(t => t.estado === 'pendiente').length;
  const pagosPendientes = tramites.filter(t => t.estado === 'pago_pendiente').length;
  const enRevision = tramites.filter(t => t.estado === 'en_revision').length;
  const completados = tramites.filter(t => t.estado === 'completado').length;
  const rechazados = tramites.filter(t => t.estado === 'rechazado').length;

  const getEstadoColor = (estado: string) => {
    switch(estado) {
      case 'pendiente': return 'estado-pendiente';
      case 'pago_pendiente': return 'estado-pago-pendiente';
      case 'en_revision': return 'estado-en-proceso';
      case 'completado': return 'estado-completado';
      case 'rechazado': return 'estado-rechazado';
      default: return '';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch(estado) {
      case 'pendiente': return 'Pendiente';
      case 'pago_pendiente': return 'Pago Pendiente';
      case 'en_revision': return 'En Revisión';
      case 'completado': return 'Completado';
      case 'rechazado': return 'Rechazado';
      default: return estado;
    }
  };

  const handleCambiarEstado = async (tramiteId: number, nuevoEstado: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tramites/${tramiteId}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      const data = await response.json();
      if (data.success) {
        alert(`✅ Estado actualizado a: ${getEstadoTexto(nuevoEstado)}`);
        loadData();
        setTramiteSeleccionado(null);
      } else {
        alert(data.message || 'Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  };

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
              Desde aquí puedes revisar el estado del sistema, administrar usuarios y gestionar trámites.
            </p>
          </div>
        </section>

        {/* Tabs - Manteniendo el estilo original */}
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'tramites' ? 'active' : ''}`}
            onClick={() => setActiveTab('tramites')}
          >
            📋 Trámites ({totalTramites})
          </button>
          <button 
            className={`admin-tab ${activeTab === 'usuarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('usuarios')}
          >
            👥 Usuarios ({totalUsuarios})
          </button>
        </div>

        {activeTab === 'tramites' && (
          <>
            {/* Stats - Manteniendo el estilo de 3 columnas como original */}
            <section className="admin-panel-stats">
              <article className="admin-stat-card">
                <span>Total Trámites</span>
                <strong>{totalTramites}</strong>
              </article>
              <article className="admin-stat-card">
                <span>Pendientes</span>
                <strong style={{ color: '#d99e00' }}>{pendientes}</strong>
              </article>
              <article className="admin-stat-card">
                <span>Pago Pendiente</span>
                <strong style={{ color: '#ff6b35' }}>{pagosPendientes}</strong>
              </article>
              <article className="admin-stat-card">
                <span>En Revisión</span>
                <strong style={{ color: '#2196f3' }}>{enRevision}</strong>
              </article>
              <article className="admin-stat-card">
                <span>Completados</span>
                <strong style={{ color: '#43a047' }}>{completados}</strong>
              </article>
              <article className="admin-stat-card">
                <span>Rechazados</span>
                <strong style={{ color: '#f44336' }}>{rechazados}</strong>
              </article>
            </section>

            <section className="admin-panel-table-card">
              <div className="admin-panel-table-header">
                <h3>Lista de Trámites</h3>
                <p>{loading ? 'Cargando...' : `${totalTramites} trámites registrados`}</p>
              </div>

              <div className="admin-panel-table-wrap">
                <table className="admin-panel-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Solicitante</th>
                      <th>CI</th>
                      <th>Tipo</th>
                      <th>CITE</th>
                      <th>Estado</th>
                      <th>Comprobante</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tramites.map(tramite => (
                      <tr key={tramite.id}>
                        <td>#{tramite.id}</td>
                        <td>{tramite.solicitante.nombre}</td>
                        <td>{tramite.solicitante.ci}</td>
                        <td>{tramite.tramiteDetalle?.tipo_tramite || 'No definido'}</td>
                        <td>{tramite.tramiteDetalle?.cite_tramite || 'N/A'}</td>
                        <td>
                          <span className={`admin-role-badge ${getEstadoColor(tramite.estado)}`}>
                            {getEstadoTexto(tramite.estado)}
                          </span>
                        </td>
                        <td>
                          {tramite.comprobantePago ? (
                            <span style={{ color: '#43a047', fontWeight: 600 }}>✅ Subido</span>
                          ) : (
                            <span style={{ color: '#f44336', fontWeight: 600 }}>❌ No subido</span>
                          )}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button 
                              className="btn-glass btn-glass--sm btn-glass--info"
                              onClick={() => setTramiteSeleccionado(tramite)}
                            >
                              Ver
                            </button>
                            {tramite.estado === 'pago_pendiente' && (
                              <button 
                                className="btn-glass btn-glass--sm btn-glass--warning"
                                onClick={() => handleCambiarEstado(tramite.id, 'en_revision')}
                              >
                                Revisar
                              </button>
                            )}
                            {tramite.estado === 'en_revision' && (
                              <>
                                <button 
                                  className="btn-glass btn-glass--sm"
                                  style={{ 
                                    '--glass-bg': 'rgba(46, 125, 50, 0.85)',
                                    '--glass-label-from': '#2e7d32',
                                    '--glass-icon-color': '#2e7d32'
                                  } as any}
                                  onClick={() => handleCambiarEstado(tramite.id, 'completado')}
                                >
                                  Aprobar
                                </button>
                                <button 
                                  className="btn-glass btn-glass--sm btn-glass--danger"
                                  onClick={() => handleCambiarEstado(tramite.id, 'rechazado')}
                                >
                                  Rechazar
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!loading && tramites.length === 0 && (
                      <tr>
                        <td colSpan={8} className="admin-panel-empty">
                          No hay trámites para mostrar.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeTab === 'usuarios' && (
          <>
            {/* Stats de usuarios - Manteniendo el estilo original */}
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
                            {usuario.role === 'admin' ? 'Administrador' : 'Usuario'}
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
          </>
        )}
      </main>

      {/* Modal de detalles del trámite */}
      {tramiteSeleccionado && (
        <div className="modal-overlay" onClick={() => setTramiteSeleccionado(null)}>
          <div className="modal-content modal-detalles" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles del Trámite #{tramiteSeleccionado.id}</h2>
              <button className="modal-close" onClick={() => setTramiteSeleccionado(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detalles-grid">
                <div className="detalle-item">
                  <span className="detalle-label">Solicitante</span>
                  <span className="detalle-valor">{tramiteSeleccionado.solicitante.nombre}</span>
                </div>
                <div className="detalle-item">
                  <span className="detalle-label">CI</span>
                  <span className="detalle-valor">{tramiteSeleccionado.solicitante.ci}</span>
                </div>
                <div className="detalle-item">
                  <span className="detalle-label">Celular</span>
                  <span className="detalle-valor">{tramiteSeleccionado.solicitante.celular}</span>
                </div>
                <div className="detalle-item">
                  <span className="detalle-label">Fecha Nac.</span>
                  <span className="detalle-valor">{tramiteSeleccionado.solicitante.fechaNacimiento}</span>
                </div>
                
                {tramiteSeleccionado.apoderado && (
                  <>
                    <div className="detalles-divider">
                      <span>Apoderado</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">Nombre</span>
                      <span className="detalle-valor">{tramiteSeleccionado.apoderado.nombre}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">CI</span>
                      <span className="detalle-valor">{tramiteSeleccionado.apoderado.ci}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">Celular</span>
                      <span className="detalle-valor">{tramiteSeleccionado.apoderado.celular}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">Doc. Poder</span>
                      <span className="detalle-valor" style={{ color: '#4a9eff' }}>
                        {tramiteSeleccionado.apoderado.documentoPoder ? '✅ Subido' : '❌ No subido'}
                      </span>
                    </div>
                  </>
                )}

                <div className="detalles-divider">
                  <span>Datos del Trámite</span>
                </div>
                
                {tramiteSeleccionado.tramiteDetalle && (
                  <>
                    <div className="detalle-item">
                      <span className="detalle-label">ID Trámite</span>
                      <span className="detalle-valor">{tramiteSeleccionado.tramiteDetalle.id_tramite}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">CITE</span>
                      <span className="detalle-valor">{tramiteSeleccionado.tramiteDetalle.cite_tramite}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">Tipo</span>
                      <span className="detalle-valor">{tramiteSeleccionado.tramiteDetalle.tipo_tramite}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">ID Documento</span>
                      <span className="detalle-valor">{tramiteSeleccionado.tramiteDetalle.id_documento}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">Estado</span>
                      <span className={`estado-badge ${getEstadoColor(tramiteSeleccionado.estado)}`}>
                        {getEstadoTexto(tramiteSeleccionado.estado)}
                      </span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">ID Funcionario</span>
                      <span className="detalle-valor">{tramiteSeleccionado.tramiteDetalle.id_funcionario}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">Ubicación</span>
                      <span className="detalle-valor">{tramiteSeleccionado.tramiteDetalle.ubicacion}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">Fojas</span>
                      <span className="detalle-valor">{tramiteSeleccionado.tramiteDetalle.fojas}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">N° Resolución</span>
                      <span className="detalle-valor">{tramiteSeleccionado.tramiteDetalle.num_resolucion || '-'}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">Fecha Resolución</span>
                      <span className="detalle-valor">
                        {tramiteSeleccionado.tramiteDetalle.fecha_resolucion ? 
                          new Date(tramiteSeleccionado.tramiteDetalle.fecha_resolucion).toLocaleDateString('es-ES') : 
                          '-'
                        }
                      </span>
                    </div>
                    <div className="detalle-item full-width">
                      <span className="detalle-label">Observación</span>
                      <span className="detalle-valor">{tramiteSeleccionado.tramiteDetalle.observacion || 'Sin observación'}</span>
                    </div>
                    
                    <div className="detalles-divider">
                      <span>Información Adicional</span>
                    </div>
                    
                    <div className="detalle-item full-width">
                      <span className="detalle-label">Descripción</span>
                      <span className="detalle-valor">{tramiteSeleccionado.tramiteDetalle.descripcion}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">Estado Registro</span>
                      <span className="detalle-valor">{tramiteSeleccionado.tramiteDetalle.estado_reg}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">Cargo</span>
                      <span className="detalle-valor">{tramiteSeleccionado.tramiteDetalle.cargo}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">Email Empresa</span>
                      <span className="detalle-valor">{tramiteSeleccionado.tramiteDetalle.email_empresa}</span>
                    </div>
                  </>
                )}

                <div className="detalles-divider">
                  <span>Pago</span>
                </div>
                <div className="detalle-item">
                  <span className="detalle-label">Precio</span>
                  <span className="detalle-valor" style={{ color: '#2e7d32', fontWeight: 700 }}>
                    Bs. {tramiteSeleccionado.precio}
                  </span>
                </div>
                <div className="detalle-item">
                  <span className="detalle-label">Comprobante</span>
                  <span className="detalle-valor" style={{ color: tramiteSeleccionado.comprobantePago ? '#43a047' : '#f44336' }}>
                    {tramiteSeleccionado.comprobantePago ? '✅ Subido' : '❌ No subido'}
                  </span>
                </div>
                <div className="detalle-item full-width">
                  <span className="detalle-label">Fecha Creación</span>
                  <span className="detalle-valor">
                    {new Date(tramiteSeleccionado.fechaCreacion).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setTramiteSeleccionado(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;