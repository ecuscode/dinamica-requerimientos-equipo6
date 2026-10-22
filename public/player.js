// Controlador Móvil del Jugador / Inspector
document.addEventListener('DOMContentLoaded', () => {
  let playerId = localStorage.getItem('req_player_id') || null;
  let playerNickname = localStorage.getItem('req_player_nick') || '';
  let currentScore = 0;
  let currentStreak = 0;
  let hasAnsweredCurrent = false;

  // Vistas
  const pviews = {
    join: document.getElementById('pview-join'),
    lobby: document.getElementById('pview-lobby'),
    question: document.getElementById('pview-question'),
    submitted: document.getElementById('pview-submitted'),
    result: document.getElementById('pview-result'),
    finish: document.getElementById('pview-finish')
  };

  const playerStatusBadge = document.getElementById('player-status-badge');
  const inputNickname = document.getElementById('input-nickname');
  const btnJoin = document.getElementById('btn-join');
  const lobbyGreeting = document.getElementById('lobby-greeting');

  // Pregunta activa
  const pCaseTag = document.getElementById('p-case-tag');
  const pCaseTitle = document.getElementById('p-case-title');
  const pTimer = document.getElementById('p-timer');
  const decisionButtons = document.querySelectorAll('.btn-decision');

  // Resultado
  const pResultBadge = document.getElementById('p-result-badge');
  const pPointsAwarded = document.getElementById('p-points-awarded');
  const pResultMsg = document.getElementById('p-result-msg');
  const pTotalScore = document.getElementById('p-total-score');
  const pStreak = document.getElementById('p-streak');
  const pFinalScore = document.getElementById('p-final-score');

  function showPView(name) {
    Object.keys(pviews).forEach(k => {
      pviews[k].style.display = 'none';
    });
    if (pviews[name]) {
      pviews[name].style.display = 'block';
    }
  }

  function updateBadge() {
    if (playerId && playerNickname) {
      playerStatusBadge.textContent = `${playerNickname} · ${currentScore} pts`;
    } else {
      playerStatusBadge.textContent = 'Sin registrar';
    }
  }

  // Si ya estaba registrado previamente en este navegador
  if (playerId && playerNickname) {
    lobbyGreeting.textContent = `Inspector: ${playerNickname}`;
    updateBadge();
    showPView('lobby');
  } else {
    showPView('join');
  }

  // Evento de Unirse
  btnJoin.addEventListener('click', () => {
    const nick = inputNickname.value.trim();
    if (!nick) {
      alert('Por favor ingresa un nombre o alias');
      return;
    }

    btnJoin.disabled = true;
    fetch('/api/player/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname: nick })
    })
      .then(r => r.json())
      .then(data => {
        btnJoin.disabled = false;
        if (data.success) {
          playerId = data.playerId;
          playerNickname = data.nickname;
          localStorage.setItem('req_player_id', playerId);
          localStorage.setItem('req_player_nick', playerNickname);
          lobbyGreeting.textContent = `Inspector: ${playerNickname}`;
          updateBadge();
          showPView('lobby');
        } else {
          alert('Error al ingresar: ' + data.error);
        }
      })
      .catch(err => {
        btnJoin.disabled = false;
        alert('Error de conexión con el servidor');
      });
  });

  // Conexión en tiempo real con SSE
  const eventSource = new EventSource('/api/events');

  eventSource.addEventListener('state_change', (e) => {
    const state = JSON.parse(e.data);
    handleServerState(state);
  });

  eventSource.addEventListener('timer_tick', (e) => {
    const { timeRemaining } = JSON.parse(e.data);
    if (pTimer) {
      pTimer.textContent = `${Math.max(0, timeRemaining)}s`;
      if (timeRemaining <= 5) {
        pTimer.style.color = 'var(--kill-color)';
      } else {
        pTimer.style.color = '#ffffff';
      }
    }
  });

  function handleServerState(state) {
    if (!playerId) {
      showPView('join');
      return;
    }

    if (state.status === 'LOBBY') {
      currentScore = 0;
      currentStreak = 0;
      updateBadge();
      showPView('lobby');
    } else if (state.status === 'QUESTION') {
      hasAnsweredCurrent = false;
      showPView('question');
      const q = state.question;
      if (q) {
        pCaseTag.textContent = `CASO ${state.currentQuestionIndex + 1} DE ${state.totalQuestions}`;
        pCaseTitle.textContent = q.title;
        pTimer.textContent = `${state.timeRemaining}s`;
      }
      decisionButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
      });
    } else if (state.status === 'RESOLUTION') {
      if (!hasAnsweredCurrent) {
        // El alumno no contestó a tiempo
        currentStreak = 0;
        pResultBadge.className = 'correct-badge KILL';
        pResultBadge.textContent = 'TIEMPO AGOTADO';
        pPointsAwarded.textContent = '+0 pts';
        pResultMsg.textContent = `La compuerta correcta era [ ${state.resolution.correct} ]. No se emitió dictamen a tiempo.`;
        pTotalScore.textContent = currentScore;
        pStreak.textContent = currentStreak;
        updateBadge();
        showPView('result');
      }
    } else if (state.status === 'LEADERBOARD') {
      // Mantener pantalla de resultado
    } else if (state.status === 'PODIUM') {
      pFinalScore.textContent = currentScore;
      showPView('finish');
    }
  }

  // Envío de decisión al presionar [ GO ], [ PIVOT ] o [ KILL ]
  decisionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (hasAnsweredCurrent) return;

      const choice = btn.dataset.choice;
      hasAnsweredCurrent = true;

      // Deshabilitar todos los botones
      decisionButtons.forEach(b => {
        b.disabled = true;
        b.style.opacity = '0.5';
      });

      showPView('submitted');

      fetch('/api/player/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, choice })
      })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            if (data.isCorrect) {
              currentScore += data.points;
              currentStreak += 1;
              pResultBadge.className = 'correct-badge GO';
              pResultBadge.textContent = 'DICTAMEN ACERTADO';
              pPointsAwarded.textContent = `+${data.points} pts`;
              pResultMsg.textContent = 'Tu disposición coincide plenamente con el análisis canónico de ingeniería.';
            } else {
              currentStreak = 0;
              pResultBadge.className = 'correct-badge KILL';
              pResultBadge.textContent = 'DISPOSICIÓN NO CANÓNICA';
              pPointsAwarded.textContent = '+0 pts';
              pResultMsg.textContent = 'Tu análisis difiere del criterio de ingeniería de la exposición.';
            }

            pTotalScore.textContent = currentScore;
            pStreak.textContent = currentStreak;
            updateBadge();
          }
        })
        .catch(err => {
          console.error(err);
        });
    });
  });
});
