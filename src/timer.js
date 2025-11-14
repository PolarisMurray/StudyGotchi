// Timer module for StudyGotchi
class Timer {
  constructor() {
    this.currentTime = 0;
    this.isRunning = false;
    this.startTime = null;
    this.intervalId = null;
    this.listeners = [];
    
    this.loadState();
  }

  // Subscribe to timer updates (for Svelte or other reactive frameworks)
  subscribe(callback) {
    this.listeners.push(callback);
    // Immediately call with current state
    callback({
      currentTime: this.currentTime,
      isRunning: this.isRunning
    });
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  async loadState() {
    try {
      const data = await chrome.storage.local.get(['timer']);
      if (data.timer) {
        this.currentTime = data.timer.currentTime || 0;
        this.isRunning = data.timer.isRunning || false;
        this.startTime = data.timer.startTime || null;
        
        // If timer was running, resume it
        if (this.isRunning && this.startTime) {
          const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
          this.currentTime = (data.timer.currentTime || 0) + elapsed;
          this.start();
        }
        
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error loading timer state:', error);
    }
  }

  async saveState() {
    try {
      await chrome.storage.local.set({
        timer: {
          currentTime: this.currentTime,
          isRunning: this.isRunning,
          startTime: this.startTime
        }
      });
      
      // Notify background script
      chrome.runtime.sendMessage({
        type: 'TIMER_UPDATE',
        data: {
          currentTime: this.currentTime,
          isRunning: this.isRunning,
          startTime: this.startTime
        }
      });
    } catch (error) {
      console.error('Error saving timer state:', error);
    }
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.startTime = Date.now();
    
    this.intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.currentTime = (this.currentTime || 0) + elapsed;
      this.startTime = Date.now();
      this.notifyListeners();
      this.saveState();
    }, 1000);
    
    this.notifyListeners();
    this.saveState();
  }

  pause() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    // Calculate final time
    if (this.startTime) {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.currentTime = (this.currentTime || 0) + elapsed;
      this.startTime = null;
    }
    
    this.notifyListeners();
    this.saveState();
  }

  reset() {
    this.pause();
    this.currentTime = 0;
    this.startTime = null;
    this.notifyListeners();
    this.saveState();
  }

  async completeSession() {
    const sessionTime = this.currentTime;
    this.reset();
    
    // Notify background script about completed session
    chrome.runtime.sendMessage({
      type: 'STUDY_SESSION_COMPLETE',
      data: {
        studyTime: sessionTime
      }
    });
    
    return sessionTime;
  }

  notifyListeners() {
    const state = {
      currentTime: this.currentTime,
      isRunning: this.isRunning
    };
    this.listeners.forEach(callback => callback(state));
  }
}

export const timer = new Timer();

