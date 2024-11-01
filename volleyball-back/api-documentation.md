# API de Voleibol - Documentación

## Descripción
Esta API permite gestionar equipos y partidos de voleibol, incluyendo la creación de equipos, programación de partidos, actualización de puntajes y seguimiento del rendimiento de los jugadores.

## Índice
- [Endpoints](#endpoints)
  - [Equipos](#equipos)
  - [Partidos](#partidos)
  - [Gestión de Partidos](#gestión-de-partidos)
  - [Puntuación y Rendimiento](#puntuación-y-rendimiento)
- [Estructuras JSON](#estructuras-json)
- [Notas y Validaciones](#notas-y-validaciones)

## Endpoints

### Equipos

#### Crear un Equipo
- **Método**: POST
- **Ruta**: `/api/teams/`
- **Descripción**: Crea un nuevo equipo con sus jugadores
- **Ejemplo de payload**:
```json
{
    "name": "Equipo A",
    "gender": "M",
    "players": [
        {
            "name": "Jugador 1",
            "jersey_number": 1,
            "position": "CE",
            "is_holding": true
        },
        {
            "name": "Jugador 2",
            "jersey_number": 2,
            "position": "PR",
            "is_holding": false
        }
    ]
}
```

### Partidos

#### Crear un Partido
- **Método**: POST
- **Ruta**: `/api/matches/`
- **Descripción**: Programa un nuevo partido
- **Ejemplo de payload**:
```json
{
    "home_team_id": 1,
    "away_team_id": 2,
    "date": "2024-10-28T15:00:00Z",
    "location": "Estadio Central",
    "latitude": 34.0522,
    "longitude": -118.2437,
    "status": "upcoming"
}
```

### Gestión de Partidos

#### Iniciar Partido
- **Método**: POST
- **Ruta**: `/api/matches/{match_id}/start_match/`
- **Descripción**: Inicia un partido programado
- **Payload**: No requiere

#### Finalizar Partido
- **Método**: POST
- **Ruta**: `/api/matches/{match_id}/end_match/`
- **Descripción**: Finaliza un partido en curso
- **Payload**: No requiere

#### Suspender Partido
- **Método**: POST
- **Ruta**: `/api/matches/{match_id}/suspend_match/`
- **Descripción**: Suspende un partido en curso
- **Payload**: No requiere

#### Reprogramar Partido
- **Método**: POST
- **Ruta**: `/api/matches/{match_id}/reschedule_match/`
- **Descripción**: Reprograma un partido para una nueva fecha
- **Ejemplo de payload**:
```json
{
    "new_date": "2024-10-30T18:00:00Z"
}
```

### Puntuación y Rendimiento

#### Actualizar Puntaje de Set
- **Método**: PATCH
- **Ruta**: `/api/matches/{match_id}/update_score/`
- **Descripción**: Actualiza el puntaje de un set específico
- **Ejemplo de payload**:
```json
{
    "set_number": 1,
    "home_score": 10,
    "away_score": 8
}
```

#### Actualizar Rendimiento del Jugador
- **Método**: PATCH
- **Ruta**: `/api/matches/{match_id}/update_player_performance/`
- **Descripción**: Actualiza las estadísticas de rendimiento de un jugador
- **Ejemplo de payload**:
```json
{
    "player_id": 5,
    "spike_points": 3,
    "block_points": 1,
    "aces": 2,
    "errors": 0
}
```

#### Actualizar Tiempos Fuera
- **Método**: POST
- **Ruta**: `/api/matches/{match_id}/sets/{set_id}/update_timeouts/`
- **Descripción**: Actualiza los tiempos fuera utilizados por un equipo en un set
- **Ejemplo de payload**:
```json
{
    "team": "home"  // o "away"
  
}
```

## Notas y Validaciones

### Gestión de PlayerPerformance
- Al actualizar el rendimiento de un jugador, el sistema suma automáticamente los puntos basados en:
  - Puntos por remate (spike)
  - Puntos por bloqueo (block)
  - Puntos por servicio directo (ace)

### Control de Tiempos Fuera
- Cada equipo tiene un número limitado de tiempos fuera por set
- Se debe validar que no se excedan los tiempos fuera permitidos
- El endpoint `update_timeouts` gestiona este control

### Estados de Partido
Los estados posibles para un partido son:
- `upcoming`: Partido programado
- `live`: Partido en curso
- `finished`: Partido finalizado
- `suspended`: Partido suspendido

