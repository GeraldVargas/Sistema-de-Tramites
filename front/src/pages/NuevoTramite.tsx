import React, { useState, useRef } from 'react';
import './NuevoTramite.css';
import QRCodeGenerator from '../components/QRCodeGenerator';
import logo from '../assets/images/logo_colca1.png';

interface NuevoTramiteProps {
  onTramiteCreado: () => void;
  onCancelar: () => void;
}

interface SolicitanteData {
  ci: string;
  nombre: string;
  celular: string;
  fechaNacimiento: string;
}

interface ApoderadoData {
  ci: string;
  nombre: string;
  celular: string;
  fechaNacimiento: string;
  documentoPoder: File | null;
}

interface TramiteDetalleData {
  cite_tramite: string;
  id_tipo_tramite: number;
  tipo_tramite: string;
  id_documento: number;
  estado_tramite: string;
  id_funcionario: number;
  ubicacion: string;
  num_resolucion: number;
  fecha_resolucion: string;
  observacion: string;
  descripcion: string;
  estado_reg: string;
  cargo: string;
  email_empresa: string;
}

const NuevoTramite: React.FC<NuevoTramiteProps> = ({ onTramiteCreado, onCancelar }) => {
  // Estado para los datos del solicitante
  const [solicitante, setSolicitante] = useState<SolicitanteData>({
    ci: '',
    nombre: '',
    celular: '',
    fechaNacimiento: ''
  });

  // Estado para los datos del apoderado
  const [apoderado, setApoderado] = useState<ApoderadoData>({
    ci: '',
    nombre: '',
    celular: '',
    fechaNacimiento: '',
    documentoPoder: null
  });

  // Estado para el checkbox de apoderado
  const [tieneApoderado, setTieneApoderado] = useState(false);

  // Estado para los documentos
  const [documentos, setDocumentos] = useState({
    folioReal: null as File | null,
    solicitud: null as File | null,
    plano: null as File | null,
    testimonioCompraVenta: null as File | null
  });

  // Estado para los detalles del trámite
  const [tramiteDetalle, setTramiteDetalle] = useState<TramiteDetalleData>({
    cite_tramite: '',
    id_tipo_tramite: 1,
    tipo_tramite: 'Licencia',
    id_documento: 0,
    estado_tramite: 'pendiente',
    id_funcionario: 0,
    ubicacion: 'Colcapirhua',
    num_resolucion: 0,
    fecha_resolucion: '',
    observacion: '',
    descripcion: '',
    estado_reg: 'PENDIENTE',
    cargo: '',
    email_empresa: ''
  });

  // Estado para cantidad de hojas
  const [cantidadHojas, setCantidadHojas] = useState(1);

  // Estado para errores y carga
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [tramiteCreado, setTramiteCreado] = useState<any>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [comprobantePago, setComprobantePago] = useState<File | null>(null);
  const [subiendoComprobante, setSubiendoComprobante] = useState(false);

  // Referencias para los inputs de archivos
  const fileInputs = {
    folioReal: useRef<HTMLInputElement>(null),
    solicitud: useRef<HTMLInputElement>(null),
    plano: useRef<HTMLInputElement>(null),
    testimonioCompraVenta: useRef<HTMLInputElement>(null),
    documentoPoder: useRef<HTMLInputElement>(null),
    comprobantePago: useRef<HTMLInputElement>(null)
  };

  // Función para convertir archivo a base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Manejar cambio de archivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, campo: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (campo === 'folioReal') {
        setDocumentos(prev => ({ ...prev, folioReal: file }));
      } else if (campo === 'solicitud') {
        setDocumentos(prev => ({ ...prev, solicitud: file }));
      } else if (campo === 'plano') {
        setDocumentos(prev => ({ ...prev, plano: file }));
      } else if (campo === 'testimonioCompraVenta') {
        setDocumentos(prev => ({ ...prev, testimonioCompraVenta: file }));
      } else if (campo === 'documentoPoder') {
        setApoderado(prev => ({ ...prev, documentoPoder: file }));
      }
    }
  };

  // Manejar cambio de comprobante de pago
  const handleComprobanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setComprobantePago(file);
    }
  };

  // Validar formulario
  const validarFormulario = (): boolean => {
    const nuevosErrors: Record<string, string> = {};

    // Validar solicitante
    if (!solicitante.ci) nuevosErrors.ci = 'La cédula es obligatoria';
    if (!solicitante.nombre) nuevosErrors.nombre = 'El nombre es obligatorio';
    if (!solicitante.celular) nuevosErrors.celular = 'El celular es obligatorio';
    if (!solicitante.fechaNacimiento) nuevosErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';

    // Validar documentos requeridos
    if (!documentos.folioReal) nuevosErrors.folioReal = 'El Folio Real es obligatorio';
    if (!documentos.solicitud) nuevosErrors.solicitud = 'La Solicitud es obligatoria';
    if (!documentos.plano) nuevosErrors.plano = 'El Plano es obligatorio';

    // Validar cantidad de hojas
    if (!cantidadHojas || cantidadHojas < 1) {
      nuevosErrors.cantidadHojas = 'La cantidad de hojas debe ser mayor a 0';
    }

    // Validar detalles del trámite
    if (!tramiteDetalle.descripcion) nuevosErrors.descripcion = 'La descripción es obligatoria';
    if (!tramiteDetalle.cargo) nuevosErrors.cargo = 'El cargo es obligatorio';
    if (!tramiteDetalle.email_empresa) nuevosErrors.email_empresa = 'El email de la empresa es obligatorio';

    // Validar apoderado si está marcado
    if (tieneApoderado) {
      if (!apoderado.ci) nuevosErrors.apoderadoCi = 'La cédula del apoderado es obligatoria';
      if (!apoderado.nombre) nuevosErrors.apoderadoNombre = 'El nombre del apoderado es obligatorio';
      if (!apoderado.celular) nuevosErrors.apoderadoCelular = 'El celular del apoderado es obligatorio';
      if (!apoderado.fechaNacimiento) nuevosErrors.apoderadoFecha = 'La fecha de nacimiento del apoderado es obligatoria';
      if (!apoderado.documentoPoder) nuevosErrors.documentoPoder = 'El Documento de Poder es obligatorio';
    }

    setErrors(nuevosErrors);
    return Object.keys(nuevosErrors).length === 0;
  };

  // Crear trámite
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setIsLoading(true);

    try {
      // Convertir archivos a base64
      const folioRealBase64 = await fileToBase64(documentos.folioReal!);
      const solicitudBase64 = await fileToBase64(documentos.solicitud!);
      const planoBase64 = await fileToBase64(documentos.plano!);
      let testimonioBase64 = null;
      if (documentos.testimonioCompraVenta) {
        testimonioBase64 = await fileToBase64(documentos.testimonioCompraVenta);
      }

      let apoderadoData = null;
      if (tieneApoderado && apoderado.documentoPoder) {
        const poderBase64 = await fileToBase64(apoderado.documentoPoder);
        apoderadoData = {
          ci: apoderado.ci,
          nombre: apoderado.nombre,
          celular: apoderado.celular,
          fechaNacimiento: apoderado.fechaNacimiento,
          documentoPoder: poderBase64
        };
      }

      const tramiteData = {
        solicitante: {
          ci: solicitante.ci,
          nombre: solicitante.nombre,
          celular: solicitante.celular,
          fechaNacimiento: solicitante.fechaNacimiento
        },
        apoderado: apoderadoData,
        documentos: {
          folioReal: folioRealBase64,
          solicitud: solicitudBase64,
          plano: planoBase64,
          testimonioCompraVenta: testimonioBase64
        },
        tramiteDetalle: {
          cite_tramite: tramiteDetalle.cite_tramite,
          id_tipo_tramite: tramiteDetalle.id_tipo_tramite,
          tipo_tramite: tramiteDetalle.tipo_tramite,
          id_documento: tramiteDetalle.id_documento || 1000 + Date.now(),
          estado_tramite: tramiteDetalle.estado_tramite,
          id_funcionario: tramiteDetalle.id_funcionario || 101,
          ubicacion: tramiteDetalle.ubicacion,
          num_resolucion: tramiteDetalle.num_resolucion || 0,
          fecha_resolucion: tramiteDetalle.fecha_resolucion || new Date().toISOString().split('T')[0],
          observacion: tramiteDetalle.observacion || 'Sin observación',
          descripcion: tramiteDetalle.descripcion,
          estado_reg: tramiteDetalle.estado_reg,
          cargo: tramiteDetalle.cargo,
          email_empresa: tramiteDetalle.email_empresa
        },
        cantidadHojas: cantidadHojas,
        precio: 150
      };

      const response = await fetch('http://localhost:5000/api/tramites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tramiteData)
      });

      const data = await response.json();

      if (data.success) {
        setTramiteCreado(data.tramite);
        setQrData(data.qrData);
      } else {
        alert(data.message || 'Error al crear el trámite');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  // Subir comprobante de pago
  const handleSubirComprobante = async () => {
    if (!comprobantePago) {
      alert('Por favor, selecciona un comprobante de pago');
      return;
    }

    setSubiendoComprobante(true);

    try {
      const comprobanteBase64 = await fileToBase64(comprobantePago);
      
      const response = await fetch(`http://localhost:5000/api/tramites/${tramiteCreado.id}/comprobante`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comprobante: comprobanteBase64 })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Comprobante de pago subido exitosamente');
        onTramiteCreado();
      } else {
        alert(data.message || 'Error al subir el comprobante');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    } finally {
      setSubiendoComprobante(false);
    }
  };

  // Si el trámite ya fue creado, mostrar QR y opción de subir comprobante
  if (tramiteCreado) {
    const detalle = tramiteCreado.tramiteDetalle;
    return (
      <div className="nuevo-tramite-container">
        <div className="nuevo-tramite-card">
          <div className="nuevo-tramite-header">
            <img src={logo} alt="Logo Colca" className="nuevo-tramite-logo" />
            <h2>✅ Trámite Creado Exitosamente</h2>
            <p className="tramite-id">ID: #{tramiteCreado.id}</p>
          </div>

          {/* Mostrar todos los detalles del trámite */}
          <div className="tramite-detalle-completo">
            <h3>Detalles del Trámite</h3>
            <div className="detalles-grid">
              <div className="detalle-item">
                <span className="detalle-label">ID Trámite:</span>
                <span className="detalle-valor">{detalle.id_tramite}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">CITE:</span>
                <span className="detalle-valor">{detalle.cite_tramite}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Tipo Trámite:</span>
                <span className="detalle-valor">{detalle.tipo_tramite}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">ID Documento:</span>
                <span className="detalle-valor">{detalle.id_documento}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Estado:</span>
                <span className={`estado-badge ${detalle.estado_tramite === 'pendiente' ? 'estado-pendiente' : ''}`}>
                  {detalle.estado_tramite === 'pendiente' ? 'Pendiente' : 
                   detalle.estado_tramite === 'en_proceso' ? 'En Proceso' :
                   detalle.estado_tramite === 'completado' ? 'Completado' : 'Rechazado'}
                </span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">ID Funcionario:</span>
                <span className="detalle-valor">{detalle.id_funcionario}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Ubicación:</span>
                <span className="detalle-valor">{detalle.ubicacion}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Fojas:</span>
                <span className="detalle-valor">{detalle.fojas}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">N° Resolución:</span>
                <span className="detalle-valor">{detalle.num_resolucion || '-'}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Fecha Resolución:</span>
                <span className="detalle-valor">
                  {detalle.fecha_resolucion ? new Date(detalle.fecha_resolucion).toLocaleDateString('es-ES') : '-'}
                </span>
              </div>
              <div className="detalle-item full-width">
                <span className="detalle-label">Observación:</span>
                <span className="detalle-valor">{detalle.observacion || 'Sin observación'}</span>
              </div>
              
              <div className="detalles-divider">
                <span>Información Adicional</span>
              </div>
              
              <div className="detalle-item full-width">
                <span className="detalle-label">Descripción:</span>
                <span className="detalle-valor">{detalle.descripcion}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Estado Registro:</span>
                <span className="detalle-valor">{detalle.estado_reg}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Cargo:</span>
                <span className="detalle-valor">{detalle.cargo}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Email Empresa:</span>
                <span className="detalle-valor">{detalle.email_empresa}</span>
              </div>
            </div>
          </div>

          <div className="qr-section">
            <h3>📱 Escanea el QR para realizar el pago</h3>
            <div className="qr-container">
              <QRCodeGenerator 
                value={qrData?.qrString || `Tramite #${tramiteCreado.id}`}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="qr-info">
              <strong>Beneficiario:</strong> Gobierno Municipal de Colcapirhua<br />
              <strong>Concepto:</strong> Pago trámite #{tramiteCreado.id}<br />
              <strong>Monto:</strong> Bs. {tramiteCreado.precio}
            </p>
          </div>

          <div className="comprobante-section">
            <h3>📤 Subir Comprobante de Depósito</h3>
            <p className="comprobante-info">
              Una vez realizado el pago, sube el comprobante para que el administrador pueda aprobar tu trámite.
            </p>
            
            <div className="file-upload">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleComprobanteChange}
                ref={fileInputs.comprobantePago}
                className="file-input"
                id="comprobante-input"
              />
              <label htmlFor="comprobante-input" className="file-label">
                {comprobantePago ? (
                  <span>📎 {comprobantePago.name}</span>
                ) : (
                  <span>📤 Seleccionar comprobante</span>
                )}
              </label>
            </div>

            <div className="acciones">
              <button 
                className="btn-subir-comprobante"
                onClick={handleSubirComprobante}
                disabled={!comprobantePago || subiendoComprobante}
              >
                {subiendoComprobante ? 'Subiendo...' : 'Subir Comprobante'}
              </button>
              <button 
                className="btn-cancelar"
                onClick={onCancelar}
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de creación de trámite
  return (
    <div className="nuevo-tramite-container">
      <div className="nuevo-tramite-card">
        <div className="nuevo-tramite-header">
          <img src={logo} alt="Logo Colca" className="nuevo-tramite-logo" />
          <h2>📋 Nuevo Trámite</h2>
          <p>Completa todos los campos para registrar tu trámite</p>
        </div>

        <form className="nuevo-tramite-form" onSubmit={handleSubmit}>
          {/* Datos del Solicitante */}
          <div className="form-section">
            <h3 className="section-title">👤 Datos del Solicitante</h3>
            
            <div className="form-group">
              <label>CI *</label>
              <input
                type="text"
                className={`form-input ${errors.ci ? 'input-error' : ''}`}
                placeholder="Ej: 1234567"
                value={solicitante.ci}
                onChange={(e) => setSolicitante({...solicitante, ci: e.target.value})}
              />
              {errors.ci && <span className="error-message">{errors.ci}</span>}
            </div>

            <div className="form-group">
              <label>Nombre Completo *</label>
              <input
                type="text"
                className={`form-input ${errors.nombre ? 'input-error' : ''}`}
                placeholder="Ej: Juan Perez"
                value={solicitante.nombre}
                onChange={(e) => setSolicitante({...solicitante, nombre: e.target.value})}
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label>Número de Celular *</label>
              <input
                type="tel"
                className={`form-input ${errors.celular ? 'input-error' : ''}`}
                placeholder="Ej: 71234567"
                value={solicitante.celular}
                onChange={(e) => setSolicitante({...solicitante, celular: e.target.value})}
              />
              {errors.celular && <span className="error-message">{errors.celular}</span>}
            </div>

            <div className="form-group">
              <label>Fecha de Nacimiento *</label>
              <input
                type="date"
                className={`form-input ${errors.fechaNacimiento ? 'input-error' : ''}`}
                value={solicitante.fechaNacimiento}
                onChange={(e) => setSolicitante({...solicitante, fechaNacimiento: e.target.value})}
              />
              {errors.fechaNacimiento && <span className="error-message">{errors.fechaNacimiento}</span>}
            </div>
          </div>

          {/* Apoderado */}
          <div className="form-section">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="tieneApoderado"
                checked={tieneApoderado}
                onChange={(e) => setTieneApoderado(e.target.checked)}
              />
              <label htmlFor="tieneApoderado">El trámite es realizado por un apoderado</label>
            </div>

            {tieneApoderado && (
              <div className="apoderado-fields">
                <h4>Datos del Apoderado</h4>
                
                <div className="form-group">
                  <label>CI del Apoderado *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.apoderadoCi ? 'input-error' : ''}`}
                    placeholder="Ej: 7654321"
                    value={apoderado.ci}
                    onChange={(e) => setApoderado({...apoderado, ci: e.target.value})}
                  />
                  {errors.apoderadoCi && <span className="error-message">{errors.apoderadoCi}</span>}
                </div>

                <div className="form-group">
                  <label>Nombre del Apoderado *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.apoderadoNombre ? 'input-error' : ''}`}
                    placeholder="Ej: Maria Lopez"
                    value={apoderado.nombre}
                    onChange={(e) => setApoderado({...apoderado, nombre: e.target.value})}
                  />
                  {errors.apoderadoNombre && <span className="error-message">{errors.apoderadoNombre}</span>}
                </div>

                <div className="form-group">
                  <label>Celular del Apoderado *</label>
                  <input
                    type="tel"
                    className={`form-input ${errors.apoderadoCelular ? 'input-error' : ''}`}
                    placeholder="Ej: 76543210"
                    value={apoderado.celular}
                    onChange={(e) => setApoderado({...apoderado, celular: e.target.value})}
                  />
                  {errors.apoderadoCelular && <span className="error-message">{errors.apoderadoCelular}</span>}
                </div>

                <div className="form-group">
                  <label>Fecha de Nacimiento del Apoderado *</label>
                  <input
                    type="date"
                    className={`form-input ${errors.apoderadoFecha ? 'input-error' : ''}`}
                    value={apoderado.fechaNacimiento}
                    onChange={(e) => setApoderado({...apoderado, fechaNacimiento: e.target.value})}
                  />
                  {errors.apoderadoFecha && <span className="error-message">{errors.apoderadoFecha}</span>}
                </div>

                <div className="form-group">
                  <label>Documento de Poder (PDF o Imagen) *</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'documentoPoder')}
                    ref={fileInputs.documentoPoder}
                    className="file-input"
                  />
                  {apoderado.documentoPoder && (
                    <span className="file-name">📎 {apoderado.documentoPoder.name}</span>
                  )}
                  {errors.documentoPoder && <span className="error-message">{errors.documentoPoder}</span>}
                </div>
              </div>
            )}
          </div>

          {/* Documentos */}
          <div className="form-section">
            <h3 className="section-title">📄 Documentos Requeridos</h3>
            
            <div className="form-group">
              <label>Folio Real o Matrícula *</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, 'folioReal')}
                ref={fileInputs.folioReal}
                className="file-input"
                id="folioReal-input"
              />
              <label htmlFor="folioReal-input" className="file-label">
                {documentos.folioReal ? (
                  <span>📎 {documentos.folioReal.name}</span>
                ) : (
                  <span>📤 Seleccionar Folio Real</span>
                )}
              </label>
              {errors.folioReal && <span className="error-message">{errors.folioReal}</span>}
            </div>

            <div className="form-group">
              <label>Solicitud del Trámite *</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, 'solicitud')}
                ref={fileInputs.solicitud}
                className="file-input"
                id="solicitud-input"
              />
              <label htmlFor="solicitud-input" className="file-label">
                {documentos.solicitud ? (
                  <span>📎 {documentos.solicitud.name}</span>
                ) : (
                  <span>📤 Seleccionar Solicitud</span>
                )}
              </label>
              {errors.solicitud && <span className="error-message">{errors.solicitud}</span>}
            </div>

            <div className="form-group">
              <label>Plano *</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, 'plano')}
                ref={fileInputs.plano}
                className="file-input"
                id="plano-input"
              />
              <label htmlFor="plano-input" className="file-label">
                {documentos.plano ? (
                  <span>📎 {documentos.plano.name}</span>
                ) : (
                  <span>📤 Seleccionar Plano</span>
                )}
              </label>
              {errors.plano && <span className="error-message">{errors.plano}</span>}
            </div>

            <div className="form-group">
              <label>Testimonio de Compra y Venta (Opcional)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, 'testimonioCompraVenta')}
                ref={fileInputs.testimonioCompraVenta}
                className="file-input"
                id="testimonio-input"
              />
              <label htmlFor="testimonio-input" className="file-label">
                {documentos.testimonioCompraVenta ? (
                  <span>📎 {documentos.testimonioCompraVenta.name}</span>
                ) : (
                  <span>📤 Seleccionar Testimonio (Opcional)</span>
                )}
              </label>
            </div>
          </div>

          {/* Detalles del Trámite */}
          <div className="form-section">
            <h3 className="section-title">📋 Detalles del Trámite</h3>
            
            <div className="form-group">
              <label>CITE</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej: CITE-2026-001"
                value={tramiteDetalle.cite_tramite}
                onChange={(e) => setTramiteDetalle({...tramiteDetalle, cite_tramite: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Tipo de Trámite *</label>
              <select
                className="form-select"
                value={tramiteDetalle.id_tipo_tramite}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  const tipos = ['', 'Licencia', 'Permiso', 'Certificado', 'Registro', 'Otro'];
                  setTramiteDetalle({
                    ...tramiteDetalle,
                    id_tipo_tramite: value,
                    tipo_tramite: tipos[value] || 'Otro'
                  });
                }}
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
              <label>ID Documento</label>
              <input
                type="number"
                className="form-input"
                placeholder="ID del documento"
                value={tramiteDetalle.id_documento || ''}
                onChange={(e) => setTramiteDetalle({...tramiteDetalle, id_documento: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="form-group">
              <label>Estado del Trámite *</label>
              <select
                className="form-select"
                value={tramiteDetalle.estado_tramite}
                onChange={(e) => setTramiteDetalle({...tramiteDetalle, estado_tramite: e.target.value})}
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
                value={tramiteDetalle.id_funcionario || ''}
                onChange={(e) => setTramiteDetalle({...tramiteDetalle, id_funcionario: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="form-group">
              <label>Ubicación</label>
              <input
                type="text"
                className="form-input"
                value="Colcapirhua"
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label>Cantidad total de hojas (Fojas) *</label>
              <input
                type="number"
                className={`form-input ${errors.cantidadHojas ? 'input-error' : ''}`}
                placeholder="Ej: 10"
                min="1"
                value={cantidadHojas}
                onChange={(e) => setCantidadHojas(parseInt(e.target.value) || 1)}
              />
              {errors.cantidadHojas && <span className="error-message">{errors.cantidadHojas}</span>}
            </div>

            <div className="form-group">
              <label>Número de Resolución</label>
              <input
                type="number"
                className="form-input"
                placeholder="Número de resolución"
                value={tramiteDetalle.num_resolucion || ''}
                onChange={(e) => setTramiteDetalle({...tramiteDetalle, num_resolucion: parseInt(e.target.value) || 0})}
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Fecha de Resolución</label>
              <input
                type="date"
                className="form-input"
                value={tramiteDetalle.fecha_resolucion}
                onChange={(e) => setTramiteDetalle({...tramiteDetalle, fecha_resolucion: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Observación</label>
              <textarea
                className="form-textarea"
                placeholder="Observaciones del trámite..."
                value={tramiteDetalle.observacion}
                onChange={(e) => setTramiteDetalle({...tramiteDetalle, observacion: e.target.value})}
              />
            </div>
          </div>

          {/* Información Adicional */}
          <div className="form-section">
            <h3 className="section-title">ℹ️ Información Adicional</h3>
            
            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                className={`form-textarea ${errors.descripcion ? 'input-error' : ''}`}
                placeholder="Descripción detallada del trámite..."
                value={tramiteDetalle.descripcion}
                onChange={(e) => setTramiteDetalle({...tramiteDetalle, descripcion: e.target.value})}
                required
              />
              {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
            </div>

            <div className="form-group">
              <label>Estado de Registro</label>
              <select
                className="form-select"
                value={tramiteDetalle.estado_reg}
                onChange={(e) => setTramiteDetalle({...tramiteDetalle, estado_reg: e.target.value})}
              >
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="ACTIVO">ACTIVO</option>
                <option value="COMPLETADO">COMPLETADO</option>
                <option value="RECHAZADO">RECHAZADO</option>
                <option value="EN_REVISION">EN REVISIÓN</option>
              </select>
            </div>

            <div className="form-group">
              <label>Cargo del Funcionario *</label>
              <input
                type="text"
                className={`form-input ${errors.cargo ? 'input-error' : ''}`}
                placeholder="Ej: Jefe de Licencias"
                value={tramiteDetalle.cargo}
                onChange={(e) => setTramiteDetalle({...tramiteDetalle, cargo: e.target.value})}
              />
              {errors.cargo && <span className="error-message">{errors.cargo}</span>}
            </div>

            <div className="form-group">
              <label>Email Empresa *</label>
              <input
                type="email"
                className={`form-input ${errors.email_empresa ? 'input-error' : ''}`}
                placeholder="Ej: empresa@correo.com"
                value={tramiteDetalle.email_empresa}
                onChange={(e) => setTramiteDetalle({...tramiteDetalle, email_empresa: e.target.value})}
              />
              {errors.email_empresa && <span className="error-message">{errors.email_empresa}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancelar" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="submit" className="btn-crear" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Trámite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoTramite;