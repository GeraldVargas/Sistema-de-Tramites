const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Datos quemados de usuarios (simulando BD)
let usuarios = [
  {
    id: 1,
    nombre: 'Admin',
    ci: '1234567',
    email: 'admin@admin.com',
    password: 'admin',
    googleId: null,
    registradoConGoogle: false
  }
];

// Almacenar sesiones temporales de Google
let googleSessions = {};

// ============================================
// ENDPOINTS DE AUTENTICACIÓN
// ============================================

// Login con usuario/contraseña
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const usuario = usuarios.find(u => 
    u.email === email && u.password === password
  );
  
  if (usuario) {
    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        ci: usuario.ci
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Usuario o contraseña incorrectos'
    });
  }
});

// Iniciar login con Google
app.post('/api/auth/google', (req, res) => {
  const { email, nombre, googleId } = req.body;
  
  // Verificar si el usuario ya existe
  let usuario = usuarios.find(u => u.email === email);
  
  if (usuario) {
    // Usuario existe, verificar si tiene googleId
    if (!usuario.googleId) {
      // Actualizar usuario existente con googleId
      usuario.googleId = googleId;
      usuario.registradoConGoogle = true;
    }
    
    // Crear sesión temporal para el registro
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
        nombre: usuario.nombre,
        email: usuario.email,
        ci: usuario.ci
      }
    });
  } else {
    // Nuevo usuario - requiere completar registro
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

// Completar registro de usuario con Google
app.post('/api/auth/google/complete', (req, res) => {
  const { sessionToken, nombre, ci } = req.body;
  
  const session = googleSessions[sessionToken];
  if (!session) {
    return res.status(400).json({
      success: false,
      message: 'Sesión inválida o expirada'
    });
  }
  
  // Crear nuevo usuario
  const newUser = {
    id: usuarios.length + 1,
    nombre: nombre || session.nombre,
    ci: ci,
    email: session.email,
    password: null,
    googleId: session.googleId,
    registradoConGoogle: true
  };
  
  usuarios.push(newUser);
  
  // Actualizar sesión
  session.completado = true;
  session.userId = newUser.id;
  
  res.json({
    success: true,
    message: 'Usuario registrado exitosamente',
    user: {
      id: newUser.id,
      nombre: newUser.nombre,
      email: newUser.email,
      ci: newUser.ci
    }
  });
});

// Verificar sesión de Google
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

// Obtener todos los usuarios (para debug)
app.get('/api/usuarios', (req, res) => {
  res.json(usuarios);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📋 Usuarios disponibles:`);
  usuarios.forEach(u => {
    console.log(`  - ${u.nombre} (${u.email})`);
  });
});