/**
 * Heart-catching mini game
 */
const HeartGame = (function () {
  'use strict';

  let score = 0, timeLeft = 30, running = false, timer = null, spawner = null;

  function start() {
    if (running) return;
    running = true;
    score = 0;
    timeLeft = 30;
    document.getElementById('gameScore').textContent = '0';
    document.getElementById('gameTime').textContent = '30';
    document.getElementById('gameArea').innerHTML = '';

    timer = setInterval(() => {
      timeLeft--;
      document.getElementById('gameTime').textContent = timeLeft;
      if (timeLeft <= 0) stop();
    }, 1000);

    spawner = setInterval(spawnHeart, 700);
    spawnHeart();
  }

  function stop() {
    running = false;
    clearInterval(timer);
    clearInterval(spawner);
    document.getElementById('gameArea').innerHTML = '';
    const area = document.getElementById('gameArea');
    const msg = document.createElement('p');
    msg.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:Dancing Script,cursive;font-size:1.8rem;color:var(--pink-soft)';
    msg.textContent = `You caught ${score} hearts! Mannu would be proud ❤️`;
    area.appendChild(msg);
  }

  function spawnHeart() {
    if (!running) return;
    const area = document.getElementById('gameArea');
    const heart = document.createElement('span');
    heart.className = 'game-heart';
    heart.textContent = ['❤','💕','💗'][Math.floor(Math.random() * 3)];
    heart.style.left = Math.random() * (area.clientWidth - 40) + 'px';
    heart.style.top = '-30px';
    const dur = Math.random() * 2 + 2.5;
    heart.style.animationDuration = dur + 's';

    heart.addEventListener('click', () => {
      score++;
      document.getElementById('gameScore').textContent = score;
      heart.remove();
    });

    heart.addEventListener('animationend', () => heart.remove());
    area.appendChild(heart);
  }

  return {
    init() {
      document.getElementById('gameStart')?.addEventListener('click', start);
    },
  };
})();
