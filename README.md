
# Task Management Frontend

Frontend multi-página para el sistema de gestión de tareas con arquitectura modular y documentación JSDoc completa.

## Estructura del Proyecto

```
client/
├── .env                   # Variables de entorno
├── .gitignore            # Archivos ignorados por Git
├── package.json          # Dependencias y scripts del proyecto
├── index.html            # Página de inicio/landing
├── public/               # Páginas HTML y recursos estáticos
│   ├── auth.html         # Página de autenticación (login/registro)
│   ├── dashboard.html    # Dashboard principal con vistas Kanban/Lista
│   ├── create-task.html  # Crear nueva tarea
│   ├── create-task-demo.html # Demo de creación de tareas
│   ├── dashboard-demo.html   # Demo del dashboard
│   ├── forgot-password.html  # Recuperar contraseña
│   ├── profile.html      # Perfil de usuario y configuración
│   ├── reset-password.html   # Restablecer contraseña con token
│   ├── about.html        # Información del sistema y mapa de sitio
│   ├── style.css         # Estilos globales base
│   ├── css/              # Estilos CSS modulares
│   │   ├── variables.css # Variables CSS y tema
│   │   ├── auth.css      # Estilos de autenticación
│   │   ├── dashboard.css # Estilos del dashboard
│   │   ├── create-task.css # Estilos de creación de tareas
│   │   ├── profile.css   # Estilos del perfil
│   │   ├── about.css     # Estilos de la página about
│   │   ├── sidebar.css   # Estilos de navegación lateral
│   │   ├── modal.css     # Estilos de modales
│   │   ├── notifications.css # Estilos de notificaciones toast
│   │   └── date-time.css # Estilos de selectores de fecha/hora
│   ├── assets/           # Recursos multimedia
│   │   ├── logo.png      # Logo de la aplicación
│   │   └── mapaSitio.png # Mapa del sitio
│   └── src/              # Código fuente JavaScript
│       ├── api.js        # Cliente API principal con detección de entorno
│       ├── auth.js       # Lógica de autenticación simplificada
│       ├── main.js       # Entrada principal de la aplicación
│       ├── tasks.js      # Lógica de tareas simplificada
│       ├── mock-api.js   # Servicio de API simulado para desarrollo
│       └── js/           # Módulos JavaScript especializados
│           ├── auth.js            # Autenticación avanzada con validación
│           ├── create-task.js     # Creación de tareas con validación
│           ├── dashboard.js       # Dashboard con vistas Kanban/Lista
│           ├── forgot-password.js # Recuperación de contraseña
│           ├── profile.js         # Gestión de perfil y cuenta
│           ├── reset-password.js  # Restablecimiento de contraseña
│           ├── task-management.js # Gestión avanzada de tareas
│           ├── services/
│           │   └── api.js         # Servicio API especializado
│           └── utils/
│               ├── sidebar.js     # Navegación lateral
│               └── utils.js       # Utilidades generales
```


## Páginas y Funcionalidades

### 1. Página Principal (`index.html`)
- Página de bienvenida y entrada al sistema
- Redirección automática según estado de autenticación
- Diseño landing page con información del sistema

### 2. Autenticación (`auth.html`)
- **Login y registro unificados**: Alternancia dinámica entre modos
- **Validación avanzada**: Validación en tiempo real con feedback visual
- **Seguridad**: Validación de contraseñas robustas y emails
- **UX mejorada**: Animaciones, contadores de caracteres, estados de carga
- **Manejo de errores**: Mensajes específicos y recuperación automática
- **Redirección inteligente**: Detección de logout y manejo de sesiones

### 3. Recuperar Contraseña (`forgot-password.html`)
- **Solicitud de recuperación**: Formulario para enviar enlace por email
- **Validación de email**: Verificación en tiempo real
- **Feedback visual**: Mensajes de éxito/error con diseño atractivo
- **Navegación**: Enlaces de regreso al login

### 4. Restablecer Contraseña (`reset-password.html`)
- **Validación de token**: Verificación automática del token de URL
- **Formulario seguro**: Confirmación de contraseña y validación
- **Feedback**: Mensajes de éxito y error con redirección automática
- **Seguridad**: Validación robusta de contraseñas

### 5. Dashboard (`dashboard.html`)
- **Vistas múltiples**: Alternancia entre vista Kanban y Lista
- **Filtrado avanzado**: Por estado (todas, por hacer, en progreso, completadas)
- **Gestión completa**: Crear, editar, eliminar, marcar como completada
- **Visualización rica**: Fechas límite, colores por estado, contadores
- **Navegación lateral**: Sidebar con navegación a todas las secciones
- **Edición in-situ**: Modales de edición con validación completa

### 6. Crear Tarea (`create-task.html`)
- **Formulario avanzado**: Título, descripción, fecha límite, hora, estado
- **Validación en tiempo real**: Contadores de caracteres, validación de fechas
- **Experiencia fluida**: Modal de confirmación y redirección automática
- **Diseño responsive**: Adaptable a todos los dispositivos

### 7. Perfil (`profile.html`)
- **Gestión completa**: Visualización y edición de datos personales
- **Seguridad**: Validación de cambios y confirmaciones
- **Eliminación de cuenta**: Proceso seguro con confirmación múltiple
- **Navegación**: Sidebar integrado para navegación rápida

### 8. Acerca de (`about.html`)
- **Información del sistema**: Detalles del proyecto y desarrolladores
- **Mapa del sitio**: Visualización de la estructura de navegación
- **Diseño atractivo**: Layout moderno con información organizada

### Flujo de Usuario
1. **Acceso inicial**: Usuario accede a `index.html` → Redirección a `auth.html` si no autenticado
2. **Autenticación**: Login/registro en `auth.html` → Redirección a `dashboard.html`
3. **Dashboard principal**: Visualización de tareas, filtros, acciones CRUD
4. **Gestión de tareas**: Crear en `create-task.html`, editar mediante modales
5. **Perfil**: Acceso a `profile.html` para gestión de cuenta
6. **Recuperación**: `forgot-password.html` → Email → `reset-password.html` → Login
7. **Navegación**: Sidebar presente en todas las páginas principales
8. **Logout**: Cierre de sesión con limpieza completa y redirección

## Arquitectura JavaScript

### 📡 Servicios de Comunicación

#### API Service Principal (`src/api.js`)
- **Detección de entorno**: Automática entre desarrollo y producción
- **Gestión de endpoints**: URLs dinámicas según configuración
- **Autenticación completa**: Login, registro, verificación, logout
- **CRUD de tareas**: Crear, leer, actualizar, eliminar tareas
- **Gestión de perfil**: Obtener, actualizar, eliminar cuenta
- **Manejo de errores**: Captura y procesamiento centralizado

#### API Service Especializado (`src/js/services/api.js`)
- **Funcionalidades extendidas**: Endpoints adicionales
- **Validación avanzada**: Procesamiento de respuestas
- **Integración con utilidades**: Conexión con sistema de notificaciones

#### Mock API Service (`src/mock-api.js`)
- **Desarrollo offline**: Simulación completa de backend
- **Respuestas realistas**: Datos de prueba consistentes
- **Delays simulados**: Experiencia real de carga

### 🧩 Módulos Especializados

#### Autenticación (`src/js/auth.js`)
- **Validación robusta**: Tiempo real con feedback visual
- **Gestión de estados**: Login/registro, validación de campos
- **Seguridad**: Patrones de contraseña, validación de email
- **UX avanzada**: Contadores, animaciones, manejo de errores

#### Dashboard (`src/js/dashboard.js`)
- **Vistas múltiples**: Kanban y Lista con alternancia fluida
- **Filtrado dinámico**: Por estado con actualización automática
- **Gestión de tareas**: CRUD completo con validación
- **Renderizado eficiente**: Actualización selectiva de componentes

#### Gestión de Tareas (`src/js/task-management.js`)
- **Modales avanzados**: Edición y eliminación con confirmación
- **Validación completa**: Campos, fechas, límites de caracteres
- **Integración**: Comunicación con dashboard y API
- **UX optimizada**: Feedback inmediato y navegación fluida

#### Perfil de Usuario (`src/js/profile.js`)
- **Gestión completa**: Visualización, edición, eliminación de cuenta
- **Validación**: Datos personales y confirmaciones de seguridad
- **Seguridad**: Proceso de eliminación con múltiples confirmaciones
- **Estados**: Modo lectura/edición con transiciones suaves

### 🛠️ Utilidades y Helpers

#### Utils Generales (`src/js/utils/utils.js`)
- **Formateo**: Fechas, horas, números en formato local
- **Validación**: Formularios, emails, campos requeridos
- **Navegación**: Redirecciones, gestión de URLs
- **Notificaciones**: Sistema toast con prevención de duplicados
- **Autenticación**: Verificación de tokens y redirecciones

#### Sidebar (`src/js/utils/sidebar.js`)
- **Navegación lateral**: Menú responsive con animaciones
- **Estados activos**: Resaltado de sección actual
- **Gestión de usuario**: Información de perfil integrada
- **Responsividad**: Adaptación automática a dispositivos móviles


## 🎨 Arquitectura CSS

### Estructura Modular
- **`variables.css`**: Variables CSS globales, colores, tipografías, espaciados
- **`style.css`**: Estilos base y reset CSS
- **Módulos específicos**: Un archivo CSS por página/funcionalidad
- **`notifications.css`**: Sistema de notificaciones toast
- **`modal.css`**: Componentes modales reutilizables
- **`sidebar.css`**: Navegación lateral responsive

## 🚀 Características Principales

### 🏗️ Arquitectura
- **Multi-página SPA híbrida**: Cada funcionalidad en su propia página HTML
- **Modularidad extrema**: JavaScript y CSS organizados por responsabilidad
- **Documentación JSDoc completa**: Todos los archivos JS documentados en español
- **Separación de responsabilidades**: Servicios, utilidades, y lógica de negocio separados

### 🎯 Experiencia de Usuario
- **Responsive design**: Adaptación completa a móviles, tablets y desktop
- **Validación en tiempo real**: Feedback inmediato en todos los formularios
- **Notificaciones toast**: Sistema de mensajes no intrusivo
- **Estados de carga**: Indicadores visuales durante operaciones async
- **Navegación fluida**: Transiciones suaves entre páginas y estados

### 🔐 Seguridad y Autenticación
- **JWT con cookies**: Sistema seguro de autenticación
- **Validación robusta**: Contraseñas seguras, emails válidos
- **Recuperación de contraseña**: Flujo completo con tokens
- **Verificación de sesión**: Validación automática en cada página
- **Logout seguro**: Limpieza completa de datos y redirección

### 📊 Gestión de Tareas
- **Vistas múltiples**: Kanban board y vista de lista
- **Filtrado dinámico**: Por estado con actualización en tiempo real
- **CRUD completo**: Crear, leer, actualizar, eliminar con validación
- **Fechas y horarios**: Selector avanzado con validación de fechas futuras
- **Estados visuales**: Colores y badges para identificar estados de tareas

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Backend ejecutándose y accesible
- Navegador moderno con soporte ES6+
- Variables de entorno configuradas (`.env`)

### Pasos de Instalación
1. **Clonar el repositorio**
   ```bash
   git clone [repository-url]
   cd PI-ProyectoFrontend/client
   ```

2. **Configurar variables de entorno**
   ```bash
   # .env
   VITE_API_URL_LOCAL=http://localhost:3000/api
   VITE_API_URL_PROD=https://api.production.com
   ```

3. **Abrir en navegador**
   - Desarrollo: Abrir `index.html` directamente
   - Producción: Desplegar en Vercel, Netlify, etc.

4. **Navegación inicial**
   - Acceso a `index.html` → Redirección automática
   - Sistema detecta autenticación y redirige apropiadamente

## 💻 Tecnologías y Estándares

### Frontend
- **HTML5**: Semántico con ARIA para accesibilidad
- **CSS3**: Variables, Flexbox, Grid, animaciones
- **JavaScript ES6+**: Async/Await, Modules, Fetch API
- **JSDoc**: Documentación completa en español

### Herramientas de Desarrollo
- **Git**: Control de versiones con ramas de desarrollo
- **Environment Variables**: Configuración por entorno
- **Modular Architecture**: Separación clara de responsabilidades

### Estándares de Código
- **Naming Conventions**: camelCase para JS, kebab-case para CSS
- **Documentation**: JSDoc completo en todos los archivos
- **Error Handling**: Manejo robusto de errores en toda la aplicación
- **Responsive Design**: Mobile-first approach

## ✅ Funcionalidades Implementadas

### 🔑 Autenticación y Seguridad
- ✅ **Login/Registro unificado** con validación avanzada
- ✅ **Recuperación de contraseña** con flujo de email
- ✅ **Restablecimiento seguro** con validación de tokens
- ✅ **Verificación de sesión** automática
- ✅ **Logout completo** con limpieza de datos

### 📋 Gestión de Tareas
- ✅ **Dashboard dual**: Vista Kanban y Lista
- ✅ **CRUD completo**: Crear, editar, eliminar, completar
- ✅ **Filtrado avanzado** por estado
- ✅ **Validación completa** de formularios
- ✅ **Fechas límite** con validación temporal

### 👤 Gestión de Usuario
- ✅ **Perfil completo**: Visualización y edición
- ✅ **Eliminación de cuenta** con confirmación múltiple
- ✅ **Validación de datos** personales
- ✅ **Navegación integrada** con sidebar

### 🎨 Experiencia de Usuario
- ✅ **Diseño responsive** completo
- ✅ **Notificaciones toast** inteligentes
- ✅ **Estados de carga** visuales
- ✅ **Validación en tiempo real** con feedback
- ✅ **Navegación fluida** entre páginas
- ✅ **Accesibilidad** con ARIA labels

### 📚 Documentación y Calidad
- ✅ **JSDoc completo** en español
- ✅ **Código modular** y reutilizable
- ✅ **Manejo de errores** robusto
- ✅ **Configuración por entorno**
- ✅ **Estructura escalable**