
# Task Management Frontend

Frontend multi-página para el sistema de gestión de tareas.

## Estructura del Proyecto

```
client/
├── public/                # Páginas HTML y recursos estáticos
│   ├── auth.html          # Página de autenticación
│   ├── dashboard.html     # Dashboard principal
│   ├── create-task.html   # Crear nueva tarea
│   ├── forgot-password.html # Recuperar contraseña
│   ├── profile.html       # Perfil de usuario
│   ├── reset-password.html # Restablecer contraseña
│   ├── about.html         # Información del sistema
│   ├── ...                # Otras páginas
│   ├── css/               # Estilos CSS
│   ├── assets/            # Imágenes y recursos
│   └── style.css          # Estilos globales
├── src/                   # Código fuente JS
│   ├── api.js             # Cliente API principal
│   ├── auth.js            # Lógica de autenticación
│   ├── main.js            # Entrada principal
│   ├── tasks.js           # Lógica de tareas
│   ├── js/
│   │   ├── auth.js
│   │   ├── create-task.js
│   │   ├── dashboard.js
│   │   ├── forgot-password.js
│   │   ├── profile.js
│   │   ├── reset-password.js
│   │   ├── task-management.js
│   │   ├── services/
│   │   │   └── api.js
│   │   └── utils/
│   │       ├── sidebar.js
│   │       └── utils.js
└── index.html             # Página de inicio
```


## Páginas y Flujo de Funcionalidades

### 1. Autenticación (`auth.html`)
- Login y registro de usuarios
- Validación de formularios y feedback visual
- Manejo de errores y mensajes
- Redirección automática al dashboard tras login
- Enlace a recuperación de contraseña

### 2. Recuperar Contraseña (`forgot-password.html`)
- Formulario para solicitar enlace de recuperación
- Mensaje de éxito/error tras enviar email
- Redirección a login tras recuperación

### 3. Restablecer Contraseña (`reset-password.html`)
- Formulario para ingresar nueva contraseña
- Validación y feedback visual
- Redirección automática al login tras éxito

### 4. Dashboard (`dashboard.html`)
- Lista de tareas del usuario
- Filtros por estado (todas, por hacer, haciendo, hecho)
- Acciones CRUD en tareas (crear, editar, eliminar)
- Navegación a crear tarea y perfil
- Visualización de tareas en modo Kanban y lista

### 5. Crear Tarea (`create-task.html`)
- Formulario de nueva tarea
- Validación en tiempo real y contador de caracteres
- Modal de confirmación
- Redirección automática al dashboard tras crear

### 6. Perfil (`profile.html`)
- Visualización y edición de datos de usuario
- Cambio de contraseña desde el perfil

### 7. Sobre (`about.html`)
- Información del sistema y desarrolladores

### Flujo General
1. El usuario accede a `index.html` y es redirigido a `auth.html` si no está autenticado.
2. Tras login/registro exitoso, es redirigido a `dashboard.html`.
3. Desde el dashboard puede navegar a crear tarea, perfil, o cerrar sesión.
4. Si olvida la contraseña, accede a `forgot-password.html` y sigue el proceso de recuperación.
5. Todas las páginas usan JS modular desde `src/js` y estilos desde `public/css`.


## Servicios JavaScript

### API Service (`src/js/services/api.js`)
Maneja toda la comunicación con el backend:
- Autenticación (login/registro, recuperación, cambio de contraseña)
- CRUD de tareas
- Manejo de cookies y tokens
- Control de errores y feedback

### Utils (`src/js/utils/utils.js`)
Funciones auxiliares:
- Validación de formularios
- Formateo de fechas
- Manejo de modales y navegación
- Utilitarias comunes


## Características

- **Multi-página**: Cada funcionalidad tiene su propia página HTML
- **Modular**: JavaScript organizados por funcionalidad y servicios
- **Responsive**: Diseño adaptable a dispositivos móviles
- **Autenticación**: Sistema basado en cookies JWT y recuperación de contraseña
- **Validación**: Validación de formularios en tiempo real y feedback visual
- **UX**: Modales, contadores de caracteres, mensajes de éxito/error y navegación fluida


## Instalación y Uso

1. Asegura que el backend esté ejecutándose y accesible
2. Abre `index.html` en un navegador web (o despliega en Vercel para producción)
3. El sistema redirige automáticamente a la página de autenticación si no hay sesión
4. Navega entre las páginas usando los enlaces y botones del sistema


## Tecnologías

- HTML5
- CSS3 (Variables CSS, Flexbox, Grid)
- JavaScript ES6+ (Async/Await, Fetch API, Modularización)
- Diseño responsive sin frameworks


## Funcionalidades

- ✅ Sistema de autenticación completo y recuperación de contraseña
- ✅ Dashboard con filtros y visualización Kanban/lista
- ✅ Crear, editar y eliminar tareas
- ✅ Marcar tareas como completadas
- ✅ Validación de formularios y feedback visual
- ✅ Manejo de errores y mensajes
- ✅ Navegación entre páginas y perfil
- ✅ Diseño responsive y experiencia de usuario mejorada