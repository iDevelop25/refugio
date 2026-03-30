const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// =====================================================
// PATRON OBSERVER - Sistema de eventos del sistema
// =====================================================

// Interfaz base: cualquier observador debe implementar actualizar()
class EventoObserver {
  actualizar(evento, datos) {
    throw new Error("El metodo actualizar() debe ser implementado");
  }
}

// Subject: gestiona la lista de observadores y emite notificaciones
class SistemaEventos {
  constructor() {
    this.observadores = [];
  }

  suscribir(observador) {
    this.observadores.push(observador);
  }

  desuscribir(observador) {
    this.observadores = this.observadores.filter(o => o !== observador);
  }

  notificar(evento, datos) {
    for (const obs of this.observadores) {
      obs.actualizar(evento, datos);
    }
  }
}

// Observador concreto: Registro de actividad (Logger)
class LoggerObserver extends EventoObserver {
  constructor() {
    super();
    this.registros = [];
  }

  actualizar(evento, datos) {
    const entrada = {
      timestamp: new Date().toISOString(),
      evento: evento,
      detalle: datos
    };
    this.registros.push(entrada);
    console.log(`[LOG] ${entrada.timestamp} | ${evento} | ${JSON.stringify(datos)}`);
  }

  obtenerRegistros() {
    return this.registros;
  }
}

// Observador concreto: Contador de estadisticas
class EstadisticasObserver extends EventoObserver {
  constructor() {
    super();
    this.contadores = {
      mensajesSolicitados: 0,
      comentariosCreados: 0,
      emocionesSolicitadas: {}
    };
  }

  actualizar(evento, datos) {
    if (evento === "mensaje_solicitado") {
      this.contadores.mensajesSolicitados++;
      const emocion = datos.emocion;
      this.contadores.emocionesSolicitadas[emocion] =
        (this.contadores.emocionesSolicitadas[emocion] || 0) + 1;
    } else if (evento === "comentario_creado") {
      this.contadores.comentariosCreados++;
    }
  }

  obtenerEstadisticas() {
    return this.contadores;
  }
}

// =====================================================
// PATRON SINGLETON - Servicio centralizado de datos
// =====================================================

class ServicioDatos {
  constructor() {
    if (ServicioDatos.instancia) {
      return ServicioDatos.instancia;
    }

    // Sistema de eventos (Observer) integrado
    this.eventos = new SistemaEventos();

    // Datos en memoria
    this.comentarios = [];
    this.mensajes = {
      triste: [
        {
          versiculo: "Salmo 34:18",
          texto: "Cercano esta el Senor a los quebrantados de corazon; y salva a los contritos de espiritu.",
          aliento: "Tu tristeza no es el final de tu historia. Dios esta mas cerca de ti ahora que nunca. Dejalo sanar tu corazon."
        },
        {
          versiculo: "Apocalipsis 21:4",
          texto: "Enjugara Dios toda lagrima de los ojos de ellos; y ya no habra muerte, ni habra mas llanto, ni clamor, ni dolor.",
          aliento: "Cada lagrima que derramas es vista por Dios. Viene un dia donde el dolor sera solo un recuerdo lejano."
        },
        {
          versiculo: "Salmo 30:5",
          texto: "Porque un momento sera su ira, pero su favor dura toda la vida. Por la noche durara el lloro, y a la manana vendra la alegria.",
          aliento: "Esta noche oscura tendra su amanecer. Aguanta un poco mas, la alegria esta en camino."
        },
        {
          versiculo: "Mateo 5:4",
          texto: "Bienaventurados los que lloran, porque ellos recibiran consolacion.",
          aliento: "Tu dolor tiene un proposito. Dios promete consolarte personalmente. No estas solo en esto."
        }
      ],
      ansioso: [
        {
          versiculo: "Filipenses 4:6-7",
          texto: "Por nada esteis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oracion y ruego, con accion de gracias.",
          aliento: "Respira profundo. Dios ya esta trabajando en aquello que te preocupa. Suelta la carga y confia."
        },
        {
          versiculo: "1 Pedro 5:7",
          texto: "Echando toda vuestra ansiedad sobre el, porque el tiene cuidado de vosotros.",
          aliento: "No fuiste disenado para cargar ese peso. Entregaselo a quien puede sostener el universo entero."
        },
        {
          versiculo: "Isaias 41:10",
          texto: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo.",
          aliento: "La ansiedad te dice que todo saldra mal. Dios te dice: Yo estoy contigo. Confia en Su voz."
        },
        {
          versiculo: "Mateo 6:34",
          texto: "No os afaneis por el dia de manana, porque el dia de manana traera su afan. Basta a cada dia su propio mal.",
          aliento: "Hoy es el unico dia que necesitas enfrentar. Manana tendra su propia gracia. Vive un paso a la vez."
        }
      ],
      enojado: [
        {
          versiculo: "Proverbios 15:1",
          texto: "La blanda respuesta quita la ira; mas la palabra aspera hace subir el furor.",
          aliento: "Tu enojo es valido, pero no dejes que te controle. Respira, y responde con la sabiduria que Dios te da."
        },
        {
          versiculo: "Efesios 4:26",
          texto: "Airaos, pero no pequeis; no se ponga el sol sobre vuestro enojo.",
          aliento: "Sentir enojo es humano. Lo importante es que hacer con el. No dejes que el sol se ponga con esa carga."
        },
        {
          versiculo: "Santiago 1:19-20",
          texto: "Todo hombre sea pronto para oir, tardo para hablar, tardo para airarse; porque la ira del hombre no obra la justicia de Dios.",
          aliento: "Antes de reaccionar, haz una pausa. Escucha mas, habla menos. La calma es tu mayor fortaleza."
        },
        {
          versiculo: "Salmo 37:8",
          texto: "Deja la ira, y desecha el enojo; no te excites en manera alguna a hacer lo malo.",
          aliento: "Suelta eso que te quema por dentro. La paz de Dios es mas poderosa que cualquier ofensa."
        }
      ],
      solo: [
        {
          versiculo: "Deuteronomio 31:6",
          texto: "Esforzaos y cobrad animo; no temais, ni tengais miedo, porque Jehova tu Dios es el que va contigo; no te dejara, ni te desamparara.",
          aliento: "Puedes sentirte solo, pero nunca lo estas realmente. El Creador del universo camina a tu lado."
        },
        {
          versiculo: "Salmo 23:4",
          texto: "Aunque ande en valle de sombra de muerte, no temere mal alguno, porque tu estaras conmigo.",
          aliento: "En los momentos mas oscuros y solitarios, hay Alguien que nunca se va de tu lado. El esta aqui."
        },
        {
          versiculo: "Mateo 28:20",
          texto: "He aqui yo estoy con vosotros todos los dias, hasta el fin del mundo.",
          aliento: "Jesus no dijo 'estare' sino 'estoy'. En este preciso momento, El esta contigo. No lo dudes."
        },
        {
          versiculo: "Salmo 68:6",
          texto: "Dios hace habitar en familia a los desamparados.",
          aliento: "Dios conoce tu necesidad de compania. El esta preparando personas y momentos especiales para ti."
        }
      ],
      desanimado: [
        {
          versiculo: "Josue 1:9",
          texto: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehova tu Dios estara contigo.",
          aliento: "El desanimo es temporal, pero el proposito que Dios tiene para ti es eterno. Levantate, guerrero."
        },
        {
          versiculo: "Isaias 40:31",
          texto: "Los que esperan a Jehova tendran nuevas fuerzas; levantaran alas como las aguilas; correran, y no se cansaran; caminaran, y no se fatigaran.",
          aliento: "Tus fuerzas se renovaran. Solo espera en El. Las aguilas no vuelan en medio de la tormenta, esperan a que pase."
        },
        {
          versiculo: "Jeremias 29:11",
          texto: "Porque yo se los pensamientos que tengo acerca de vosotros, dice Jehova, pensamientos de paz, y no de mal, para daros el fin que esperais.",
          aliento: "Dios tiene un plan para ti, y es bueno. Lo que hoy parece un fracaso, manana sera parte de tu testimonio."
        },
        {
          versiculo: "2 Corintios 4:8-9",
          texto: "Estamos atribulados en todo, mas no angustiados; en apuros, mas no desesperados; perseguidos, mas no desamparados; derribados, pero no destruidos.",
          aliento: "Puedes caer, pero no estas destruido. Cada vez que te levantas, te haces mas fuerte. Sigue adelante."
        }
      ],
      agradecido: [
        {
          versiculo: "Salmo 118:24",
          texto: "Este es el dia que hizo Jehova; nos gozaremos y alegraremos en el.",
          aliento: "Que hermoso es un corazon agradecido. Sigue celebrando cada bendicion, por pequena que parezca."
        },
        {
          versiculo: "1 Tesalonicenses 5:18",
          texto: "Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesus.",
          aliento: "La gratitud transforma tu perspectiva. Sigue dando gracias, porque aun lo mejor esta por venir."
        },
        {
          versiculo: "Salmo 107:1",
          texto: "Alabad a Jehova, porque el es bueno; porque para siempre es su misericordia.",
          aliento: "Tu gratitud es musica para el cielo. Nunca dejes de reconocer la bondad de Dios en tu vida."
        },
        {
          versiculo: "Filipenses 1:3",
          texto: "Doy gracias a mi Dios siempre que me acuerdo de vosotros.",
          aliento: "Un corazon agradecido contagia alegria. Comparte esa gratitud con quienes te rodean hoy."
        }
      ]
    };

    ServicioDatos.instancia = this;
  }

  // Obtener la instancia unica (Singleton)
  static obtenerInstancia() {
    if (!ServicioDatos.instancia) {
      new ServicioDatos();
    }
    return ServicioDatos.instancia;
  }

  // Obtener mensaje aleatorio por emocion
  obtenerMensaje(emocion) {
    if (!emocion || !this.mensajes[emocion]) {
      return null;
    }
    const lista = this.mensajes[emocion];
    const mensaje = lista[Math.floor(Math.random() * lista.length)];

    // Notificar a los observadores
    this.eventos.notificar("mensaje_solicitado", {
      emocion: emocion,
      versiculo: mensaje.versiculo
    });

    return mensaje;
  }

  // Obtener todos los comentarios
  obtenerComentarios() {
    return this.comentarios;
  }

  // Agregar un nuevo comentario
  agregarComentario(nombre, mensaje) {
    if (!nombre || !mensaje) {
      return null;
    }

    const nuevoComentario = {
      id: Date.now(),
      nombre: nombre.trim(),
      mensaje: mensaje.trim(),
      fecha: new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    this.comentarios.unshift(nuevoComentario);

    // Notificar a los observadores
    this.eventos.notificar("comentario_creado", {
      id: nuevoComentario.id,
      nombre: nuevoComentario.nombre
    });

    return nuevoComentario;
  }
}

// =====================================================
// INICIALIZACION - Conectar patrones
// =====================================================

// Crear instancia unica del servicio (Singleton)
const servicio = ServicioDatos.obtenerInstancia();

// Crear observadores y suscribirlos al sistema de eventos (Observer)
const logger = new LoggerObserver();
const estadisticas = new EstadisticasObserver();

servicio.eventos.suscribir(logger);
servicio.eventos.suscribir(estadisticas);

// =====================================================
// RUTAS API
// =====================================================

// Obtener mensaje segun emocion
app.get("/api/mensaje", (req, res) => {
  const emocion = req.query.emocion;
  const mensaje = servicio.obtenerMensaje(emocion);

  if (!mensaje) {
    return res.status(400).json({ error: "Emocion no valida" });
  }

  res.json(mensaje);
});

// Obtener todos los comentarios
app.get("/api/comentarios", (req, res) => {
  res.json(servicio.obtenerComentarios());
});

// Agregar un comentario
app.post("/api/comentarios", (req, res) => {
  const { nombre, mensaje } = req.body;

  if (!nombre || !mensaje) {
    return res.status(400).json({ error: "Nombre y mensaje son requeridos" });
  }

  const nuevoComentario = servicio.agregarComentario(nombre, mensaje);
  res.status(201).json(nuevoComentario);
});

// Obtener estadisticas del sistema (Observer)
app.get("/api/estadisticas", (req, res) => {
  res.json(estadisticas.obtenerEstadisticas());
});

// Obtener registros de actividad (Observer)
app.get("/api/logs", (req, res) => {
  res.json(logger.obtenerRegistros());
});

// --- Iniciar servidor ---
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
