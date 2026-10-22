const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const QRCode = require('qrcode');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Obtener la IP local de red para que los celulares se conecten si es en local
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const LOCAL_IP = getLocalIp();
const RENDER_HOSTNAME = process.env.RENDER_EXTERNAL_HOSTNAME;
const JOIN_URL = RENDER_HOSTNAME ? `https://${RENDER_HOSTNAME}` : (process.env.RENDER_EXTERNAL_URL || process.env.PUBLIC_URL || `http://${LOCAL_IP}:${PORT}`);

// Banco de Casos de Inspección (Temas 3.2, 3.3 y 3.4)
const QUESTIONS = [
  {
    id: 1,
    caseTag: "TEMA 3.4 — INERCIA DEL SPRINT (SHIM & LEE, 2026)",
    title: "Transferencia Bancaria Exprés sin Reglas de Excepción",
    story: "Como cuentahabiente, deseo transferir fondos a cualquier banco al instante para evitar esperas de 24 horas.",
    context: "Durante el Sprint Planning, el PO presenta la historia sin definir límites por transacción ni contingencia ante demoras del banco central. Por urgencia de completar los puntos de velocidad de la iteración, el equipo propone codificar ya.",
    dilemma: "¿Qué disposición técnica debe dictaminar la compuerta de inspección?",
    timeLimit: 25,
    options: [
      { key: "GO", label: "[ GO ] Aprobar desarrollo para no reducir la cadencia del sprint." },
      { key: "PIVOT", label: "[ PIVOT ] Redirigir a modelado de reglas antes de admitir al sprint." },
      { key: "KILL", label: "[ KILL ] Cancelar la transferencia bancaria por inviable tecnológicamente." }
    ],
    correct: "PIVOT",
    justification: "Disposición canónica: PIVOT. El estudio de Shim & Lee (2026) en IEEE Access demuestra que el 34.8% de los ítems candidatos a entrega presentan incertidumbre severa por 'inercia del sprint'. Codificar sin reglas claras genera deuda técnica masiva y retrabajo evitable."
  },
  {
    id: 2,
    caseTag: "TEMA 3.3 — REGLAS DE NEGOCIO EN DMN 1.5 (POLÍTICA UNIQUE)",
    title: "Dictamen de Cirugía Cardiovascular en Sala de Urgencias",
    story: "Como Médico Dictaminador, deseo ingresar el código del paciente para dictaminar el porcentaje de cobertura financiera en segundos.",
    context: "Se formula una tabla DMN 1.5 con política Unique (U): Regla 1 (Edad > 65 -> 100% Cobertura) y Regla 2 (Exclusión cardiaca = Verdadero -> 0% Cobertura). Ingresa un paciente de 72 años con exclusión médica activa.",
    dilemma: "¿Qué ocurre en tiempo de ejecución en el motor DMN y cuál es la compuerta requerida?",
    timeLimit: 25,
    options: [
      { key: "GO", label: "[ GO ] El motor otorga 100% respetando el orden secuencial de la tabla." },
      { key: "PIVOT", label: "[ PIVOT ] Falla fatal por traslape; la política Unique prohíbe ambigüedades." },
      { key: "KILL", label: "[ KILL ] El motor calcula el promedio matemático y asigna 50% de cobertura." }
    ],
    correct: "PIVOT",
    justification: "Disposición canónica: PIVOT. En el estándar OMG DMN 1.5, la política Unique (U) exige que exactamente una fila coincida con los predicados. Un traslape arroja excepción fatal de consistencia. Debe desambiguarse la precedencia antes de programar."
  },
  {
    id: 3,
    caseTag: "TEMA 3.2 — ARTEFACTOS RAD Y PROTOTIPADO EVOLUTIVO",
    title: "Omisión Normativa Descubierta en Taller JAD Bancario",
    story: "Como analista de crédito, deseo capturar solicitudes de préstamo de nómina para autorizarlas en menos de 10 minutos.",
    context: "En una sesión JAD intensiva, un funcionario nota sobre el prototipo interactivo que la pantalla no consulta el Buró de Crédito (normativa obligatoria no mencionada antes). En 20 minutos el equipo SWAT actualiza el modelo en la herramienta CASE y regenera el prototipo con el patrocinador presente.",
    dilemma: "¿Cuál es la disposición de este requerimiento dentro del timebox de 60 días?",
    timeLimit: 25,
    options: [
      { key: "GO", label: "[ GO ] Aprobar a construcción rápida; el prototipo destapó el requisito implícito." },
      { key: "PIVOT", label: "[ PIVOT ] Suspender el diseño y redactar un SRS monolítico de 6 meses." },
      { key: "KILL", label: "[ KILL ] Descartar la consulta a Buró para no modificar la interfaz acordada." }
    ],
    correct: "GO",
    justification: "Disposición canónica: GO. James Martin (1991) y Toro & Peláez (2016) demuestran que los usuarios no logran explicitar requerimientos en abstracto. El prototipo evolutivo en talleres JAD activa la memoria contextual y blinda la especificación operativa sin burocracia de cambio."
  },
  {
    id: 4,
    caseTag: "TEMA 3.4 — NEGLIGENCIA DE NFRS Y CALIDAD (ISO/IEC 25010)",
    title: "Pasarela de Pagos sin Cifrado ni Pruebas de Latencia",
    story: "Como comprador, deseo ingresar mi tarjeta bancaria y pagar en un solo clic.",
    context: "La interfaz funciona visualmente en la demostración del sprint. Sin embargo, el equipo omitió estipular el tiempo de respuesta bajo 2,000 transacciones simultáneas y no configuró cifrado TLS 1.3 / AES-256, afirmando que 'en agilidad la documentación formal es secundaria'.",
    dilemma: "¿Qué disposición debe aplicar la compuerta de calidad para autorizar la liberación?",
    timeLimit: 25,
    options: [
      { key: "GO", label: "[ GO ] Liberar a producción; la satisfacción visual del cliente es suficiente." },
      { key: "KILL", label: "[ KILL ] Cancelar la pasarela permanentemente y volver al modelo en cascada." },
      { key: "PIVOT", label: "[ PIVOT ] Bloquear la liberación; los NFRs deben gobernar la Definición de Terminado." }
    ],
    correct: "PIVOT",
    justification: "Disposición canónica: PIVOT (Bloqueo de compuerta). Cao & Ramesh (2008) demostraron que desatender requerimientos no funcionales (NFRs) es la mayor fuente de deuda técnica en agilidad. Bajo ISO/IEC 25010, la seguridad y el desempeño deben entrar taxativamente en la Definition of Done."
  },
  {
    id: 5,
    caseTag: "TEMA 3.4 — AGILISMO DE ETIQUETA EN MIPYMES (TORO & PELÁEZ)",
    title: "Solicitud de Cambio Verbal por Mensajería Instantánea",
    story: "Como cliente de software a medida, solicito cambiar la fórmula de comisiones a 48 horas de la entrega contractual.",
    context: "El cliente manda un mensaje por WhatsApp. El programador altera directamente sentencias if-else en el controlador de la aplicación web, sin acta JAD, sin catálogo de reglas DMN y sin pruebas automatizadas BDD, justificándolo como 'flexibilidad ágil'.",
    dilemma: "¿Qué dictamen emite la disciplina de ingeniería de requerimientos ante este procedimiento?",
    timeLimit: 25,
    options: [
      { key: "GO", label: "[ GO ] Práctica ejemplar; valora la respuesta rápida sobre cualquier proceso." },
      { key: "KILL", label: "[ KILL ] Bloquear y cancelar la inserción directa; agilismo de etiqueta no auditable." },
      { key: "PIVOT", label: "[ PIVOT ] Desplegar a producción y prometer documentarlo en Word después." }
    ],
    correct: "KILL",
    justification: "Disposición canónica: KILL. Toro Lazo & Peláez (2016) demuestran que la renuncia a la especificación y la informalidad artesanal en Mipymes provocan hasta el 70% de fracasos en software. Incrustar políticas en código destruye la analizabilidad y la modificabilidad."
  },
  {
    id: 6,
    caseTag: "TEMA 5 — TRAZABILIDAD BIDIRECCIONAL EN 7 ESLABONES",
    title: "Actualización Fiscal con Tablas DMN y Pruebas BDD en CI/CD",
    story: "Como director fiscal, deseo aplicar la tasa impositiva fronteriza preferencial en las ventas en línea.",
    context: "La regla se catalogó como derivación (BRG), se modeló en DMN 1.5 con política Unique, se formalizó como criterio de aceptación en Gherkin (Dado/Cuando/Entonces) y posee una prueba Cucumber automatizada en el servidor de integración continua (CI/CD) vinculada al repositorio.",
    dilemma: "¿Cuál es la disposición de ingeniería para este paquete de requerimientos?",
    timeLimit: 25,
    options: [
      { key: "GO", label: "[ GO ] Aprobar avance con plena certidumbre; cumple la trazabilidad en 7 eslabones." },
      { key: "PIVOT", label: "[ PIVOT ] Detener porque DMN vulnera la autoorganización del equipo Scrum." },
      { key: "KILL", label: "[ KILL ] Cancelar la prueba automatizada porque Gherkin es innecesario en ágil." }
    ],
    correct: "GO",
    justification: "Disposición canónica: GO. Representa el marco integrador propuesto por el Equipo 6: desacoplamiento formal de reglas (DMN/BRG), historias ágiles, contratos ejecutables en BDD e ISO/IEC/IEEE 29148, blindando el producto contra la deuda de requerimientos."
  }
];

// Estado global de la sesión
const gameState = {
  status: "LOBBY", // LOBBY, QUESTION, RESOLUTION, LEADERBOARD, PODIUM
  currentQuestionIndex: -1,
  timeRemaining: 0,
  players: new Map(), // id -> { id, nickname, score, streak, lastAnswer: { questionId, choice, isCorrect, pointsAwarded } }
  answers: new Map(), // questionId -> Map(playerId -> choice)
  joinUrl: JOIN_URL,
  qrSvg: ""
};

// Generar código QR inicial en SVG
QRCode.toString(JOIN_URL, { type: 'svg', margin: 2, color: { dark: '#000000', light: '#ffffff' } }, (err, svg) => {
  if (!err) {
    gameState.qrSvg = svg;
  }
});

// Clientes SSE (Server-Sent Events)
const sseClients = new Set();

function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    try {
      res.write(payload);
    } catch (e) {
      sseClients.delete(res);
    }
  }
}

// Temporizador
let timerInterval = null;

function startQuestionTimer() {
  if (timerInterval) clearInterval(timerInterval);
  const q = QUESTIONS[gameState.currentQuestionIndex];
  gameState.timeRemaining = q.timeLimit;
  gameState.status = "QUESTION";

  broadcast("state_change", getPublicState());

  timerInterval = setInterval(() => {
    gameState.timeRemaining -= 1;
    broadcast("timer_tick", { timeRemaining: gameState.timeRemaining });

    if (gameState.timeRemaining <= 0) {
      clearInterval(timerInterval);
      resolveCurrentQuestion();
    }
  }, 1000);
}

function resolveCurrentQuestion() {
  if (timerInterval) clearInterval(timerInterval);
  gameState.status = "RESOLUTION";
  const q = QUESTIONS[gameState.currentQuestionIndex];
  const qAnswers = gameState.answers.get(q.id) || new Map();

  // Contar estadísticas de votos
  const stats = { GO: 0, PIVOT: 0, KILL: 0, total: 0 };
  for (const [playerId, choice] of qAnswers.entries()) {
    if (stats[choice] !== undefined) stats[choice]++;
    stats.total++;
  }

  broadcast("state_change", {
    ...getPublicState(),
    resolution: {
      correct: q.correct,
      justification: q.justification,
      stats
    }
  });
}

function getPublicState() {
  const q = gameState.currentQuestionIndex >= 0 ? QUESTIONS[gameState.currentQuestionIndex] : null;
  return {
    status: gameState.status,
    currentQuestionIndex: gameState.currentQuestionIndex,
    totalQuestions: QUESTIONS.length,
    timeRemaining: gameState.timeRemaining,
    playerCount: gameState.players.size,
    joinUrl: gameState.joinUrl,
    question: q ? {
      id: q.id,
      caseTag: q.caseTag,
      title: q.title,
      story: q.story,
      context: q.context,
      dilemma: q.dilemma,
      timeLimit: q.timeLimit,
      options: q.options
    } : null,
    answeredCount: q && gameState.answers.has(q.id) ? gameState.answers.get(q.id).size : 0
  };
}

function getLeaderboard() {
  const list = Array.from(gameState.players.values()).map(p => ({
    id: p.id,
    nickname: p.nickname,
    score: p.score,
    streak: p.streak,
    lastPoints: p.lastAnswer ? p.lastAnswer.pointsAwarded : 0,
    lastCorrect: p.lastAnswer ? p.lastAnswer.isCorrect : false
  }));
  list.sort((a, b) => b.score - a.score);
  return list;
}

// Router HTTP
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Endpoint dinámico para generar código QR en SVG según la URL del host
  if (pathname === '/api/qr') {
    const targetUrl = parsedUrl.searchParams.get('url') || gameState.joinUrl;
    QRCode.toString(targetUrl, { type: 'svg', margin: 2, color: { dark: '#000000', light: '#ffffff' } }, (err, svg) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Error generando QR');
      }
      res.writeHead(200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache' });
      res.end(svg);
    });
    return;
  }

  // SSE: Stream en tiempo real
  if (pathname === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write(`data: ${JSON.stringify({ type: 'INIT', state: getPublicState(), qrSvg: gameState.qrSvg })}\n\n`);
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  // API REST: Registro de jugador
  if (req.method === 'POST' && pathname === '/api/player/join') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { nickname } = JSON.parse(body);
        const cleanName = (nickname || 'Inspector').trim().substring(0, 18);
        const playerId = 'p_' + Math.random().toString(36).substring(2, 9);
        const playerObj = {
          id: playerId,
          nickname: cleanName,
          score: 0,
          streak: 0,
          lastAnswer: null
        };
        gameState.players.set(playerId, playerObj);

        broadcast("player_joined", {
          playerCount: gameState.players.size,
          nickname: cleanName,
          players: Array.from(gameState.players.values()).map(p => p.nickname)
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, playerId, nickname: cleanName }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'JSON inválido' }));
      }
    });
    return;
  }

  // API REST: Envío de respuesta
  if (req.method === 'POST' && pathname === '/api/player/answer') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { playerId, choice } = JSON.parse(body);
        if (gameState.status !== "QUESTION") {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'Compuerta cerrada' }));
        }

        const q = QUESTIONS[gameState.currentQuestionIndex];
        if (!q) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'Sin caso activo' }));
        }

        const player = gameState.players.get(playerId);
        if (!player) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'Jugador no encontrado' }));
        }

        let qMap = gameState.answers.get(q.id);
        if (!qMap) {
          qMap = new Map();
          gameState.answers.set(q.id, qMap);
        }

        if (qMap.has(playerId)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'Ya has dictaminado este caso' }));
        }

        qMap.set(playerId, choice);

        // Cálculo de puntaje estilo Kahoot
        const isCorrect = choice === q.correct;
        let points = 0;
        if (isCorrect) {
          const speedFactor = Math.max(0, gameState.timeRemaining) / q.timeLimit;
          const speedBonus = Math.round(500 * speedFactor);
          const streakBonus = player.streak * 50;
          points = 500 + speedBonus + streakBonus;
          player.score += points;
          player.streak += 1;
        } else {
          player.streak = 0;
        }

        player.lastAnswer = {
          questionId: q.id,
          choice,
          isCorrect,
          pointsAwarded: points
        };

        broadcast("answer_received", {
          answeredCount: qMap.size,
          totalPlayers: gameState.players.size
        });

        // Si todos los jugadores registrados ya respondieron, cerramos compuerta inmediatamente
        if (qMap.size >= gameState.players.size && gameState.players.size > 0) {
          resolveCurrentQuestion();
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, points, isCorrect }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Error procesando respuesta' }));
      }
    });
    return;
  }

  // API REST: Controles de Administrador (Host)
  if (req.method === 'POST' && pathname.startsWith('/api/host/')) {
    const action = pathname.replace('/api/host/', '');

    if (action === 'start') {
      gameState.currentQuestionIndex = 0;
      gameState.answers.clear();
      // Resetear puntajes si es inicio limpio
      for (const p of gameState.players.values()) {
        p.score = 0;
        p.streak = 0;
        p.lastAnswer = null;
      }
      startQuestionTimer();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true }));
    }

    if (action === 'next') {
      if (gameState.currentQuestionIndex + 1 < QUESTIONS.length) {
        gameState.currentQuestionIndex += 1;
        startQuestionTimer();
      } else {
        gameState.status = "PODIUM";
        broadcast("state_change", {
          ...getPublicState(),
          leaderboard: getLeaderboard()
        });
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true }));
    }

    if (action === 'close_gate') {
      resolveCurrentQuestion();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true }));
    }

    if (action === 'show_leaderboard') {
      gameState.status = "LEADERBOARD";
      broadcast("state_change", {
        ...getPublicState(),
        leaderboard: getLeaderboard()
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true }));
    }

    if (action === 'reset') {
      if (timerInterval) clearInterval(timerInterval);
      gameState.status = "LOBBY";
      gameState.currentQuestionIndex = -1;
      gameState.timeRemaining = 0;
      gameState.answers.clear();

      const clearPlayers = parsedUrl.searchParams.get('clear_players') === 'true';
      if (clearPlayers) {
        gameState.players.clear();
        broadcast("player_joined", { playerCount: 0, players: [] });
      } else {
        for (const p of gameState.players.values()) {
          p.score = 0;
          p.streak = 0;
          p.lastAnswer = null;
        }
      }

      broadcast("state_change", getPublicState());
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, cleared: clearPlayers }));
    }
  }

  // API REST: Estado general
  if (pathname === '/api/state') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      ...getPublicState(),
      qrSvg: gameState.qrSvg,
      leaderboard: getLeaderboard(),
      playersList: Array.from(gameState.players.values()).map(p => ({ id: p.id, nickname: p.nickname, score: p.score }))
    }));
  }

  // Servir archivos estáticos de /public
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  if (!path.extname(filePath)) filePath += '.html';

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Recurso no encontrado');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('================================================================');
  console.log(' PROTOCOLO DE INSPECCION DE REQUERIMIENTOS: COMPUERTAS AGILES');
  console.log(' UPIICSA — GRUPO 3NV30 — EQUIPO 6');
  console.log('================================================================');
  console.log(` -> Proyector / Administrador : http://localhost:${PORT}/host.html`);
  console.log(` -> Participantes (Celulares)  : http://${LOCAL_IP}:${PORT}`);
  console.log('================================================================');
});
