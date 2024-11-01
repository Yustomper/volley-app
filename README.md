
# Volley App 🏐

[![Django](https://img.shields.io/badge/Django-4.0.5-green)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/Django%20Rest%20Framework-3.13.1-red)](https://www.django-rest-framework.org/)
[![JWT](https://img.shields.io/badge/JWT-JSON%20Web%20Tokens-yellow)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-API%20Docs-brightgreen)](https://swagger.io/)
[![React](https://img.shields.io/badge/React-18.0.0-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-2.9-purple)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-06B6D4)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.0-blue)](https://www.postgresql.org/)

Volley App es una aplicación de gestión de estadísticas para partidos de voleibol. Permite registrar puntos, jugadas, faltas y partidos ganados. El proyecto está compuesto por un backend en Django y un frontend en React.

## Estructura del Proyecto

- **Backend (volleyball-back)**: Implementado en Django con Django REST Framework (DRF), JWT para autenticación y Swagger para la documentación de API.
- **Frontend (volleyball-app)**: Desarrollado en React usando Vite como empaquetador y estilizado con TailwindCSS.
- **Base de Datos**: PostgreSQL alojada en Atlas.

## Tecnologías Utilizadas

### Frontend:
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)

### Backend:
- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [JWT (JSON Web Tokens)](https://jwt.io/)
- [Swagger](https://swagger.io/)

### Base de Datos:
- [PostgreSQL](https://www.postgresql.org/)

### Deploy:
- **Backend**: [Render](https://render.com/)
- **Frontend**: [Vercel](https://vercel.com/)
- **Base de Datos**: [Atlas](https://www.mongodb.com/atlas/database)

## API Endpoints

### Autenticación (Auth)

| Método | Endpoint           | Descripción                                |
|--------|--------------------|--------------------------------------------|
| POST   | `/api/auth/login/` | Iniciar sesión y obtener un token JWT.    |
| POST   | `/api/auth/register/` | Registrar un nuevo usuario.               |
| POST   | `/api/auth/logout/` | Cerrar sesión (opcional, si se implementa). |

### Gestión de Equipos (Team)

| Método | Endpoint           | Descripción                                 |
|--------|--------------------|---------------------------------------------|
| GET    | `/api/teams/`      | Obtener todos los equipos con paginación, búsqueda y ordenamiento. |
| POST   | `/api/teams/`      | Crear un nuevo equipo.                      |
| GET    | `/api/teams/{id}/` | Obtener los detalles de un equipo específico. |
| PUT    | `/api/teams/{id}/` | Actualizar un equipo existente.             |
| DELETE | `/api/teams/{id}/` | Eliminar un equipo específico.              |

### Gestión de Jugadores (Players)

| Método | Endpoint                   | Descripción                                 |
|--------|----------------------------|---------------------------------------------|
| GET    | `/api/teams/players/`      | Obtener todos los jugadores con paginación, búsqueda y ordenamiento. |
| POST   | `/api/teams/players/`      | Crear un nuevo jugador.                    |
| GET    | `/api/teams/players/{id}/` | Obtener los detalles de un jugador específico. |
| PUT    | `/api/teams/players/{id}/` | Actualizar los detalles de un jugador.     |
| DELETE | `/api/teams/players/{id}/` | Eliminar un jugador específico.             |

### Operaciones de Jugadores en Equipos

| Método | Endpoint                       | Descripción                                      |
|--------|--------------------------------|--------------------------------------------------|
| DELETE | `/api/teams/{teamId}/players/{playerId}/` | Eliminar un jugador de un equipo específico.    |

---

## Instalación

### 1. Clonar el Repositorio

Clona el proyecto desde GitHub:

```
git clone https://github.com/Yustomper/volley-app.git
```

### 2. Configuración del Backend (Django)

2.1 Navegar a la carpeta del backend:
```
cd volleyball-back
```

2.2 Crear y activar el entorno virtual:
```
python -m venv venv
# En Linux: source venv/bin/activate 
# En Windows: venv\Scripts\activate
```

2.3 Instalar las dependencias:
```
pip install -r requirements.txt
```

2.4 Configurar las variables de entorno:
Crea un archivo .env en la carpeta volleyball-back con las siguientes variables:
```
SECRET_KEY=<tu_clave_secreta>
DEBUG=True
DATABASE_URL=postgresql://<usuario>:<contraseña>@<host>/<nombre_bd>
```

2.5 Aplicar las migraciones:
```
python manage.py migrate
```

2.6 Ejecutar el servidor de desarrollo:
```
python manage.py runserver
```
El backend estará disponible en http://127.0.0.1:8000/.

### 3. Configuración del Frontend (React)

3.1 Navegar a la carpeta del frontend:
```
cd ../volleyball-app
```

3.2 Instalar las dependencias:
```
npm install
```

3.3 Ejecutar el servidor de desarrollo:
```
npm run dev
```
El frontend estará disponible en http://localhost:3000/.

## Despliegue

**Backend:** El backend está desplegado en Render. Puedes acceder al proyecto a través de la URL de Render.

**Frontend:** El frontend está desplegado en Vercel. Puedes acceder a la aplicación a través de la URL de Vercel.

**Base de Datos:** La base de datos PostgreSQL está alojada en Atlas. Asegúrate de configurar correctamente la conexión a la base de datos en tu entorno de despliegue.
