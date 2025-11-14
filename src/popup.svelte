<script>
  import { onMount } from 'svelte';
  import { timer } from './timer.js';
  import { gotchiState } from './gotchi-state.js';

  let currentTime = 0;
  let isRunning = false;
  let studyStreak = 0;
  let totalStudyTime = 0;
  let gotchiLevel = 1;
  let gotchiMood = 'happy';

  onMount(async () => {
    // Load saved state
    const saved = await chrome.storage.local.get(['timer', 'gotchi']);
    if (saved.timer) {
      currentTime = saved.timer.currentTime || 0;
      isRunning = saved.timer.isRunning || false;
    }
    if (saved.gotchi) {
      studyStreak = saved.gotchi.streak || 0;
      totalStudyTime = saved.gotchi.totalStudyTime || 0;
      gotchiLevel = saved.gotchi.level || 1;
      gotchiMood = saved.gotchi.mood || 'happy';
    }

    // Update timer display
    timer.subscribe((state) => {
      currentTime = state.currentTime;
      isRunning = state.isRunning;
    });

    // Update gotchi state
    gotchiState.subscribe((state) => {
      studyStreak = state.streak;
      totalStudyTime = state.totalStudyTime;
      gotchiLevel = state.level;
      gotchiMood = state.mood;
    });
  });

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function toggleTimer() {
    if (isRunning) {
      timer.pause();
    } else {
      timer.start();
    }
  }

  function resetTimer() {
    timer.reset();
  }
</script>

<div class="popup-container">
  <div class="gotchi-display">
    <div class="gotchi-info">
      <h2>StudyGotchi</h2>
      <div class="level-badge">Level {gotchiLevel}</div>
      <div class="mood-indicator">Mood: {gotchiMood}</div>
    </div>
    <div id="live2d-widget" class="live2d-container"></div>
  </div>

  <div class="timer-section">
    <div class="timer-display">{formatTime(currentTime)}</div>
    <div class="timer-controls">
      <button class="btn btn-primary" on:click={toggleTimer}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button class="btn btn-secondary" on:click={resetTimer}>Reset</button>
    </div>
  </div>

  <div class="stats-section">
    <div class="stat-item">
      <span class="stat-label">Streak:</span>
      <span class="stat-value">{studyStreak} days</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Total Time:</span>
      <span class="stat-value">{formatTime(totalStudyTime)}</span>
    </div>
  </div>
</div>

<style>
  .popup-container {
    width: 400px;
    min-height: 500px;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .gotchi-display {
    text-align: center;
    margin-bottom: 20px;
  }

  .gotchi-info h2 {
    margin: 0 0 10px 0;
    font-size: 24px;
  }

  .level-badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    padding: 5px 15px;
    border-radius: 20px;
    margin: 5px;
    font-size: 14px;
  }

  .mood-indicator {
    margin: 10px 0;
    font-size: 14px;
  }

  .live2d-container {
    width: 100%;
    height: 200px;
    margin: 20px 0;
  }

  .timer-section {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    text-align: center;
  }

  .timer-display {
    font-size: 48px;
    font-weight: bold;
    margin-bottom: 20px;
    font-variant-numeric: tabular-nums;
  }

  .timer-controls {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-primary {
    background: #4CAF50;
    color: white;
  }

  .btn-primary:hover {
    background: #45a049;
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .stats-section {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 15px;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .stat-label {
    font-weight: 500;
  }

  .stat-value {
    font-weight: bold;
  }
</style>

