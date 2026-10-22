// Controlador de Pantalla de Proyección (Host)
document.addEventListener('DOMContentLoaded', () => {
  let currentState = null;

  // Elementos del DOM
  const views = {
    lobby: document.getElementById('view-lobby'),
    question: document.getElementById('view-question'),
    resolution: document.getElementById('view-resolution'),
    leaderboard: document.getElementById('view-leaderboard'),
    podium: document.getElementById('view-podium')
  };

  const qrContainer = document.getElementById('qr-container');
  const joinUrlText = document.getElementById('join-url-text');
  const playerCount = document.getElementById('player-count');
  const playerChipsList = document.getElementById('player-chips-list');

  // Caso
  const caseEje = document.getElementById('case-eje');
  const caseTitle = document.getElementById('case-title');
  const timerDisplay = document.getElementById('timer-display');
  const caseStory = document.getElementById('case-story');
  const caseContext = document.getElementById('case-context');
  const caseDilemma = document.getElementById('case-dilemma');
  const optGoDesc = document.getElementById('opt-go-desc');
  const optPivotDesc = document.getElementById('opt-pivot-desc');
  const optKillDesc = document.getElementById('opt-kill-desc');
  const currentQNum = document.getElementById('current-q-num');
  const totalQNum = document.getElementById('total-q-num');
  const votesCount = document.getElementById('votes-count');
  const totalVoters = document.getElementById('total-voters');

  // Resolución
  const resTitle = document.getElementById('res-title');
  const correctGateBadge = document.getElementById('correct-gate-badge');
  const justificationContent = document.getElementById('justification-content');
  const statGoBar = document.getElementById('stat-go-bar');
  const statGoPct = document.getElementById('stat-go-pct');
  const statPivotBar = document.getElementById('stat-pivot-bar');
  const statPivotPct = document.getElementById('stat-pivot-pct');
  const statKillBar = document.getElementById('stat-kill-bar');
  const statKillPct = document.getElementById('stat-kill-pct');

  // Leaderboard & Podio
  const leaderboardRows = document.getElementById('leaderboard-rows');
  const podiumP1Name = document.getElementById('podium-p1-name');
  const podiumP1Score = document.getElementById('podium-p1-score');
  const podiumP2Name = document.getElementById('podium-p2-name');
  const podiumP2Score = document.getElementById('podium-p2-score');
  const podiumP3Name = document.getElementById('podium-p3-name');
  const podiumP3Score = document.getElementById('podium-p3-score');

  // Botones
  const btnStart = document.getElementById('btn-start');
  const btnForceClose = document.getElementById('btn-force-close');
  const btnShowScores = document.getElementById('btn-show-scores');
  const btnNextQuestion = document.getElementById('btn-next-question');
  const btnResetSession = document.getElementById('btn-reset-session');
  const btnGlobalReset = document.getElementById('btn-global-reset');

  function triggerReset() {
    const wipe = confirm(
      "¿Deseas reiniciar la dinámica?\n\n" +
      "• Presiona ACEPTAR para volver al Lobby y poner los puntajes en 0."
    );
    if (!wipe) return;

    const clearParticipants = confirm(
      "¿Deseas también borrar a los participantes de la lista?\n\n" +
      "• ACEPTAR: Expulsa a todos los usuarios registrados (ideal para limpiar pruebas).\n" +
      "• CANCELAR: Mantiene a los alumnos registrados en la sala pero con 0 puntos."
    );

    const url = clearParticipants ? '/api/host/reset?clear_players=true' : '/api/host/reset';
    fetch(url, { method: 'POST' }).catch(console.error);
  }

  btnResetSession.addEventListener('click', triggerReset);
  if (btnGlobalReset) {
    btnGlobalReset.addEventListener('click', triggerReset);
  }
    Object.keys(views).forEach(k => {
      views[k].classList.remove('active');
    });
    if (views[name]) {
      views[name].classList.add('active');
    }
  }

  // Origen actual del cliente (en Render será https://tu-app.onrender.com)
  const clientOrigin = window.location.origin;
  joinUrlText.textContent = clientOrigin;

  // Cargar QR matching la URL real en uso
  fetch(`/api/qr?url=${encodeURIComponent(clientOrigin)}`)
    .then(r => r.text())
    .then(svg => {
      if (svg && svg.includes('<svg')) {
        qrContainer.innerHTML = svg;
      }
    })
    .catch(console.error);

  // Carga inicial de estado
  fetch('/api/state')
    .then(r => r.json())
    .then(data => {
      applyState(data);
      if (data.playersList) {
        renderPlayersList(data.playersList.map(p => p.nickname));
      }
    })
    .catch(console.error);

  // Conexión SSE en tiempo real
  const eventSource = new EventSource('/api/events');

  eventSource.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg.type === 'INIT') {
        applyState(msg.state);
        if (msg.qrSvg) qrContainer.innerHTML = msg.qrSvg;
      }
    } catch (err) {
      console.error(err);
    }
  };

  eventSource.addEventListener('state_change', (e) => {
    const data = JSON.parse(e.data);
    applyState(data);
  });

  eventSource.addEventListener('timer_tick', (e) => {
    const { timeRemaining } = JSON.parse(e.data);
    if (timerDisplay) {
      timerDisplay.textContent = Math.max(0, timeRemaining);
      if (timeRemaining <= 5) {
        timerDisplay.style.color = 'var(--kill-color)';
      } else {
        timerDisplay.style.color = '#ffffff';
      }
    }
  });

  eventSource.addEventListener('player_joined', (e) => {
    const data = JSON.parse(e.data);
    playerCount.textContent = data.playerCount;
    if (data.players) {
      renderPlayersList(data.players);
    }
  });

  eventSource.addEventListener('answer_received', (e) => {
    const data = JSON.parse(e.data);
    votesCount.textContent = data.answeredCount;
    totalVoters.textContent = data.totalPlayers;
  });

  function renderPlayersList(players) {
    playerChipsList.innerHTML = '';
    players.forEach(name => {
      const chip = document.createElement('span');
      chip.className = 'player-chip';
      chip.textContent = name;
      playerChipsList.appendChild(chip);
    });
    playerCount.textContent = players.length;
  }

  function applyState(data) {
    currentState = data;

    if (data.joinUrl) {
      joinUrlText.textContent = data.joinUrl;
    }

    if (data.status === 'LOBBY') {
      showView('lobby');
      playerCount.textContent = data.playerCount || 0;
    } else if (data.status === 'QUESTION') {
      showView('question');
      const q = data.question;
      if (q) {
        caseEje.textContent = q.caseTag;
        caseTitle.textContent = q.title;
        caseStory.textContent = `"${q.story}"`;
        caseContext.textContent = q.context;
        caseDilemma.textContent = q.dilemma;
        currentQNum.textContent = data.currentQuestionIndex + 1;
        totalQNum.textContent = data.totalQuestions;
        votesCount.textContent = data.answeredCount || 0;
        totalVoters.textContent = data.playerCount || 0;
        timerDisplay.textContent = data.timeRemaining;
        timerDisplay.style.color = '#ffffff';

        // Opciones
        const optGo = q.options.find(o => o.key === 'GO');
        const optPivot = q.options.find(o => o.key === 'PIVOT');
        const optKill = q.options.find(o => o.key === 'KILL');

        if (optGo) optGoDesc.textContent = optGo.label.replace('[ GO ] ', '');
        if (optPivot) optPivotDesc.textContent = optPivot.label.replace('[ PIVOT ] ', '');
        if (optKill) optKillDesc.textContent = optKill.label.replace('[ KILL ] ', '');
      }
    } else if (data.status === 'RESOLUTION') {
      showView('resolution');
      const res = data.resolution;
      if (res) {
        correctGateBadge.className = `correct-badge ${res.correct}`;
        correctGateBadge.textContent = `COMPUERTA ${res.correct}`;
        justificationContent.textContent = res.justification;

        const total = res.stats.total || 1;
        const goPct = Math.round((res.stats.GO / total) * 100);
        const pivotPct = Math.round((res.stats.PIVOT / total) * 100);
        const killPct = Math.round((res.stats.KILL / total) * 100);

        statGoBar.style.width = `${goPct}%`;
        statGoPct.textContent = `${goPct}% (${res.stats.GO})`;

        statPivotBar.style.width = `${pivotPct}%`;
        statPivotPct.textContent = `${pivotPct}% (${res.stats.PIVOT})`;

        statKillBar.style.width = `${killPct}%`;
        statKillPct.textContent = `${killPct}% (${res.stats.KILL})`;
      }
    } else if (data.status === 'LEADERBOARD') {
      showView('leaderboard');
      renderLeaderboard(data.leaderboard || []);
    } else if (data.status === 'PODIUM') {
      showView('podium');
      renderPodium(data.leaderboard || []);
    }
  }

  function renderLeaderboard(list) {
    leaderboardRows.innerHTML = '';
    list.slice(0, 10).forEach((p, idx) => {
      const tr = document.createElement('tr');
      const streakHtml = p.streak > 1 ? `<span class="streak-tag">Racha x${p.streak}</span>` : '';
      tr.innerHTML = `
        <td class="rank-cell">#${idx + 1}</td>
        <td><strong>${p.nickname}</strong>${streakHtml}</td>
        <td class="score-cell">${p.score.toLocaleString()} pts</td>
      `;
      leaderboardRows.appendChild(tr);
    });
  }

  function renderPodium(list) {
    const p1 = list[0] || { nickname: 'Sin registros', score: 0 };
    const p2 = list[1] || { nickname: '—', score: 0 };
    const p3 = list[2] || { nickname: '—', score: 0 };

    podiumP1Name.textContent = p1.nickname;
    podiumP1Score.textContent = `${p1.score.toLocaleString()} pts`;

    podiumP2Name.textContent = p2.nickname;
    podiumP2Score.textContent = `${p2.score.toLocaleString()} pts`;

    podiumP3Name.textContent = p3.nickname;
    podiumP3Score.textContent = `${p3.score.toLocaleString()} pts`;
  }

  // Handlers de botones
  btnStart.addEventListener('click', () => {
    fetch('/api/host/start', { method: 'POST' }).catch(console.error);
  });

  btnForceClose.addEventListener('click', () => {
    fetch('/api/host/close_gate', { method: 'POST' }).catch(console.error);
  });

  btnShowScores.addEventListener('click', () => {
    fetch('/api/host/show_leaderboard', { method: 'POST' }).catch(console.error);
  });

  btnNextQuestion.addEventListener('click', () => {
    fetch('/api/host/next', { method: 'POST' }).catch(console.error);
  });
});
