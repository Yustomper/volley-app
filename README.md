
# Volley App 🏐

## Tecnologías Utilizadas
[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Neon](https://img.shields.io/badge/Neon-00A699?style=for-the-badge&logo=neon&logoColor=white)](https://neon.tech/)

Volley App es una aplicación de gestión de estadísticas para partidos de voleibol. Permite registrar puntos, jugadas, faltas y partidos ganados. El proyecto está compuesto por un backend en Django y un frontend en React.

## Estructura del Proyecto

- **Backend (volleyball-back)**: Implementado en Django con Django REST Framework (DRF), JWT para autenticación y Swagger para la documentación de API.
- **Frontend (volleyball-app)**: Desarrollado en React usando Vite como empaquetador y estilizado con TailwindCSS.
- **Base de Datos**: PostgreSQL Neon Cloud.

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


## Testing
Este proyecto incluye una suite de tests implementada con Django Test Framework para asegurar el correcto funcionamiento de la API y la lógica del backend. Para ejecutar los tests, usa el siguiente comando:


```
python manage.py test --keepdb
```

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
