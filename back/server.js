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
// ENDPOINTS DE AUTENTICACIÓN
// ============================================

// Login con usuario/contraseña
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Buscar por usuario (email) o por nombre de usuario
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

// Login exclusivo para administradores
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

// Registro de nuevo usuario
app.post('/api/register', (req, res) => {
  const { usuario, nombre, ci, email, password } = req.body;
  
  // Verificar si el usuario ya existe
  const usuarioExistente = usuarios.find(u => u.usuario === usuario);
  if (usuarioExistente) {
    return res.status(400).json({
      success: false,
      message: 'El nombre de usuario ya está registrado'
    });
  }
  
  // Verificar si el email ya existe
  const emailExistente = usuarios.find(u => u.email === email);
  if (emailExistente) {
    return res.status(400).json({
      success: false,
      message: 'El correo electrónico ya está registrado'
    });
  }
  
  // Verificar si el CI ya existe
  const ciExistente = usuarios.find(u => u.ci === ci);
  if (ciExistente) {
    return res.status(400).json({
      success: false,
      message: 'La cédula de identidad ya está registrada'
    });
  }
  
  // Crear nuevo usuario
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

// Iniciar login con Google (simulado con ventana emergente)
app.post('/api/auth/google', (req, res) => {
  const { email, nombre, googleId } = req.body;
  
  // Verificar si el usuario ya existe
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
    usuario: session.email.split('@')[0], // Generar usuario desde email
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

// Obtener usuarios para el panel administrador
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