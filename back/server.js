const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Datos quemados de usuarios (simulando BD)
let usuarios = [
  {
    id: 1,
    usuario: 'admin',
    nombre: 'Administrador',
    ci: '1234567',
    email: 'admin@admin.com',
    password: 'admin',
    role: 'admin',
    googleId: null,
    registradoConGoogle: false
  }
];

// Almacenar sesiones temporales de Google
let googleSessions = {};

// ============================================
// BASE DE DATOS PARA TRÁMITES COMPLETA
// ============================================

let tramites = [
  // Ejemplo de trámite existente
  {
    id: 1,
    // Datos del solicitante
    solicitante: {
      ci: '12345678',
      nombre: 'Juan Perez',
      celular: '71234567',
      fechaNacimiento: '1990-01-15'
    },
    // Datos del apoderado (opcional)
    apoderado: null,
    // Documentos requeridos
    documentos: {
      folioReal: 'base64_string...',
      solicitud: 'base64_string...',
      plano: 'base64_string...',
      testimonioCompraVenta: null
    },
    // Datos del trámite (los que pides)
    tramiteDetalle: {
      id_tramite: 1,
      cite_tramite: 'CITE-2026-001',
      id_tipo_tramite: 1,
      tipo_tramite: 'Licencia',
      id_documento: 1001,
      estado_tramite: 'en_proceso',
      id_funcionario: 101,
      ubicacion: 'Oficina 301 - Área de Licencias',
      fojas: 25,
      num_resolucion: 456,
      fecha_resolucion: '2026-06-27',
      observacion: 'Documentación completa, en espera de firma',
      // Información adicional
      descripcion: 'Solicitud de licencia para establecimiento comercial',
      estado_reg: 'ACTIVO',
      cargo: 'Jefe de Licencias',
      email_empresa: 'comercial@empresa.com'
    },
    // Datos de pago
    precio: 150,
    comprobantePago: null,
    estado: 'pendiente', // pendiente, pago_pendiente, en_revision, completado, rechazado
    fechaCreacion: '2026-07-13T10:30:00',
    fechaActualizacion: '2026-07-13T10:30:00'
  }
];

// ============================================
// ENDPOINTS DE TRÁMITES
// ============================================

// Crear nuevo trámite
app.post('/api/tramites', (req, res) => {
  const { 
    solicitante, 
    apoderado, 
    documentos, 
    tramiteDetalle,
    cantidadHojas,
    precio
  } = req.body;

  // Validar campos obligatorios
  if (!solicitante || !solicitante.ci || !solicitante.nombre || 
      !solicitante.celular || !solicitante.fechaNacimiento) {
    return res.status(400).json({
      success: false,
      message: 'Faltan datos del solicitante'
    });
  }

  if (!documentos || !documentos.folioReal || !documentos.solicitud || !documentos.plano) {
    return res.status(400).json({
      success: false,
      message: 'Faltan documentos requeridos (Folio Real, Solicitud, Plano)'
    });
  }

  if (!tramiteDetalle) {
    return res.status(400).json({
      success: false,
      message: 'Faltan detalles del trámite'
    });
  }

  if (!cantidadHojas || cantidadHojas <= 0) {
    return res.status(400).json({
      success: false,
      message: 'La cantidad de hojas es obligatoria'
    });
  }

  // Crear nuevo trámite
  const nuevoTramite = {
    id: tramites.length + 1,
    solicitante: {
      ci: solicitante.ci,
      nombre: solicitante.nombre,
      celular: solicitante.celular,
      fechaNacimiento: solicitante.fechaNacimiento
    },
    apoderado: apoderado || null,
    documentos: {
      folioReal: documentos.folioReal,
      solicitud: documentos.solicitud,
      plano: documentos.plano,
      testimonioCompraVenta: documentos.testimonioCompraVenta || null
    },
    tramiteDetalle: {
      id_tramite: tramites.length + 1,
      cite_tramite: tramiteDetalle.cite_tramite || `CITE-2026-${String(tramites.length + 1).padStart(3, '0')}`,
      id_tipo_tramite: tramiteDetalle.id_tipo_tramite || 1,
      tipo_tramite: tramiteDetalle.tipo_tramite || 'Licencia',
      id_documento: tramiteDetalle.id_documento || 1000 + tramites.length + 1,
      estado_tramite: tramiteDetalle.estado_tramite || 'pendiente',
      id_funcionario: tramiteDetalle.id_funcionario || 101,
      ubicacion: tramiteDetalle.ubicacion || 'Colcapirhua',
      fojas: parseInt(cantidadHojas),
      num_resolucion: tramiteDetalle.num_resolucion || 0,
      fecha_resolucion: tramiteDetalle.fecha_resolucion || new Date().toISOString().split('T')[0],
      observacion: tramiteDetalle.observacion || 'Sin observación',
      descripcion: tramiteDetalle.descripcion || 'Descripción pendiente',
      estado_reg: tramiteDetalle.estado_reg || 'PENDIENTE',
      cargo: tramiteDetalle.cargo || 'Por asignar',
      email_empresa: tramiteDetalle.email_empresa || 'sin-email@empresa.com'
    },
    precio: precio || 150,
    comprobantePago: null,
    estado: 'pendiente',
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  };

  tramites.push(nuevoTramite);
  console.log(`✅ Nuevo trámite creado: ID ${nuevoTramite.id}`);

  res.json({
    success: true,
    message: 'Trámite creado exitosamente',
    tramite: nuevoTramite,
    qrData: {
      tramiteId: nuevoTramite.id,
      monto: nuevoTramite.precio,
      concepto: `Pago trámite #${nuevoTramite.id}`,
      beneficiario: 'Gobierno Municipal de Colcapirhua',
      qrString: `PAGO_TRAMITE|${nuevoTramite.id}|${nuevoTramite.precio}|COLCAPIRHUA|${nuevoTramite.solicitante.ci}`
    }
  });
});

// Obtener todos los trámites
app.get('/api/tramites', (req, res) => {
  res.json(tramites);
});

// Obtener un trámite por ID
app.get('/api/tramites/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tramite = tramites.find(t => t.id === id);
  
  if (!tramite) {
    return res.status(404).json({
      success: false,
      message: 'Trámite no encontrado'
    });
  }
  
  res.json(tramite);
});

// Subir comprobante de pago
app.post('/api/tramites/:id/comprobante', (req, res) => {
  const id = parseInt(req.params.id);
  const { comprobante } = req.body;
  
  const tramite = tramites.find(t => t.id === id);
  
  if (!tramite) {
    return res.status(404).json({
      success: false,
      message: 'Trámite no encontrado'
    });
  }
  
  if (!comprobante) {
    return res.status(400).json({
      success: false,
      message: 'El comprobante de pago es obligatorio'
    });
  }
  
  tramite.comprobantePago = comprobante;
  tramite.estado = 'pago_pendiente';
  tramite.fechaActualizacion = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Comprobante de pago subido exitosamente',
    tramite: tramite
  });
});

// Actualizar estado del trámite (para admin)
app.put('/api/tramites/:id/estado', (req, res) => {
  const id = parseInt(req.params.id);
  const { estado } = req.body;
  
  const tramite = tramites.find(t => t.id === id);
  
  if (!tramite) {
    return res.status(404).json({
      success: false,
      message: 'Trámite no encontrado'
    });
  }
  
  const estadosValidos = ['pendiente', 'pago_pendiente', 'en_revision', 'completado', 'rechazado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({
      success: false,
      message: 'Estado no válido'
    });
  }
  
  tramite.estado = estado;
  tramite.fechaActualizacion = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Estado del trámite actualizado',
    tramite: tramite
  });
});

// ============================================
// ENDPOINTS DE AUTENTICACIÓN
// ============================================

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const usuario = usuarios.find(u => 
    (u.email === email || u.usuario === email) && u.password === password
  );
  
  if (usuario) {
    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: usuario.id,
        usuario: usuario.usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        ci: usuario.ci,
        role: usuario.role || 'user'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Usuario o contraseña incorrectos'
    });
  }
});

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;

  const usuario = usuarios.find(u =>
    (u.email === email || u.usuario === email) &&
    u.password === password &&
    u.role === 'admin'
  );

  if (usuario) {
    res.json({
      success: true,
      message: 'Login de administrador exitoso',
      user: {
        id: usuario.id,
        usuario: usuario.usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        ci: usuario.ci,
        role: usuario.role
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Acceso denegado. Credenciales de administrador inválidas'
    });
  }
});

app.post('/api/register', (req, res) => {
  const { usuario, nombre, ci, email, password } = req.body;
  
  const usuarioExistente = usuarios.find(u => u.usuario === usuario);
  if (usuarioExistente) {
    return res.status(400).json({
      success: false,
      message: 'El nombre de usuario ya está registrado'
    });
  }
  
  const emailExistente = usuarios.find(u => u.email === email);
  if (emailExistente) {
    return res.status(400).json({
      success: false,
      message: 'El correo electrónico ya está registrado'
    });
  }
  
  const ciExistente = usuarios.find(u => u.ci === ci);
  if (ciExistente) {
    return res.status(400).json({
      success: false,
      message: 'La cédula de identidad ya está registrada'
    });
  }
  
  const newUser = {
    id: usuarios.length + 1,
    usuario,
    nombre,
    ci,
    email,
    password,
    role: 'user',
    googleId: null,
    registradoConGoogle: false
  };
  
  usuarios.push(newUser);
  
  console.log(`✅ Nuevo usuario registrado: ${usuario} (${nombre})`);
  
  res.json({
    success: true,
    message: 'Usuario registrado exitosamente',
    user: {
      id: newUser.id,
      usuario: newUser.usuario,
      nombre: newUser.nombre,
      email: newUser.email,
      ci: newUser.ci,
      role: newUser.role
    }
  });
});

app.post('/api/auth/google', (req, res) => {
  const { email, nombre, googleId } = req.body;
  
  let usuario = usuarios.find(u => u.email === email);
  
  if (usuario) {
    if (!usuario.googleId) {
      usuario.googleId = googleId;
      usuario.registradoConGoogle = true;
    }
    
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    googleSessions[sessionToken] = {
      email: usuario.email,
      nombre: usuario.nombre,
      googleId: usuario.googleId,
      userId: usuario.id,
      completado: true
    };
    
    res.json({
      success: true,
      requiresRegistration: false,
      sessionToken,
      user: {
        id: usuario.id,
        usuario: usuario.usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        ci: usuario.ci
      }
    });
  } else {
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    googleSessions[sessionToken] = {
      email,
      nombre,
      googleId,
      userId: null,
      completado: false
    };
    
    res.json({
      success: true,
      requiresRegistration: true,
      sessionToken,
      userData: {
        email,
        nombre
      }
    });
  }
});

app.post('/api/auth/google/complete', (req, res) => {
  const { sessionToken, nombre, ci } = req.body;
  
  const session = googleSessions[sessionToken];
  if (!session) {
    return res.status(400).json({
      success: false,
      message: 'Sesión inválida o expirada'
    });
  }
  
  const newUser = {
    id: usuarios.length + 1,
    usuario: session.email.split('@')[0],
    nombre: nombre || session.nombre,
    ci: ci,
    email: session.email,
    password: null,
    role: 'user',
    googleId: session.googleId,
    registradoConGoogle: true
  };
  
  usuarios.push(newUser);
  
  session.completado = true;
  session.userId = newUser.id;
  
  res.json({
    success: true,
    message: 'Usuario registrado exitosamente con Google',
    user: {
      id: newUser.id,
      usuario: newUser.usuario,
      nombre: newUser.nombre,
      email: newUser.email,
      ci: newUser.ci,
      role: newUser.role
    }
  });
});

app.post('/api/auth/google/verify', (req, res) => {
  const { sessionToken } = req.body;
  
  const session = googleSessions[sessionToken];
  if (!session) {
    return res.status(400).json({
      success: false,
      message: 'Sesión inválida'
    });
  }
  
  res.json({
    success: true,
    session: session
  });
});

app.get('/api/usuarios', (req, res) => {
  res.json(usuarios);
});

app.get('/api/admin/usuarios', (req, res) => {
  res.json(
    usuarios.map(({ password, googleId, ...usuario }) => usuario)
  );
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📋 Usuarios disponibles:`);
  usuarios.forEach(u => {
    console.log(`  - ${u.usuario} (${u.nombre})`);
  });
  console.log('\n🔑 Credenciales de prueba:');
  console.log('  - Usuario: admin');
  console.log('  - Contraseña: admin');
});