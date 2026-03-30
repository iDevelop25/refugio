# Refugio - Un mensaje para tu corazon

> **Demo en vivo**: [https://refugio-seven.vercel.app](https://refugio-seven.vercel.app)

Aplicacion web de inspiracion biblica que ofrece versiculos personalizados segun tu estado emocional, junto con mensajes de aliento y un espacio para compartir testimonios.

## Caracteristicas

- **Seleccion emocional**: Elige entre 6 estados (triste, ansioso, enojado, solo, desanimado, agradecido)
- **Versiculos personalizados**: Mensajes biblicos aleatorios con palabras de aliento para cada emocion
- **Testimonios**: Espacio para compartir y leer experiencias de la comunidad
- **Galeria de inspiracion**: Imagenes con temas biblicos
- **Estadisticas y logs**: Endpoints de monitoreo del sistema

## Patrones de diseno implementados

### Singleton - ServicioDatos
Centraliza todos los datos (mensajes y comentarios) en una unica instancia, garantizando una sola fuente de verdad en toda la aplicacion.

### Observer - Sistema de eventos
Cuando se solicita un mensaje o se crea un comentario, el sistema notifica automaticamente a los observadores suscritos:
- **LoggerObserver**: Registra cada evento con marca de tiempo
- **EstadisticasObserver**: Cuenta mensajes solicitados, comentarios creados y emociones mas consultadas

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript
- **Deploy**: Vercel

## Instalacion

```bash
git clone https://github.com/iDevelop25/refugio.git
cd refugio
npm install
node server.js
```

Abrir en el navegador: `http://localhost:3000`

## Endpoints API

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/mensaje?emocion=triste` | Obtener mensaje segun emocion |
| GET | `/api/comentarios` | Listar todos los comentarios |
| POST | `/api/comentarios` | Crear un comentario |
| GET | `/api/estadisticas` | Ver estadisticas del sistema |
| GET | `/api/logs` | Ver registro de actividad |

## Autor

**Johannes Jose Moreno Torres**

Proyecto academico - Patrones de Desarrollo de Software | Asturias Corporacion Universitaria
