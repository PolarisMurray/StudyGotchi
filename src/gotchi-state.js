// Gotchi state management module
class GotchiState {
  constructor() {
    this.state = {
      level: 1,
      experience: 0,
      streak: 0,
      totalStudyTime: 0,
      mood: 'happy',
      lastStudyDate: null
    };
    
    this.listeners = [];
    this.loadState();
  }

  // Subscribe to state updates (for Svelte or other reactive frameworks)
  subscribe(callback) {
    this.listeners.push(callback);
    // Immediately call with current state
    callback({ ...this.state });
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  async loadState() {
    try {
      const data = await chrome.storage.local.get(['gotchi']);
      if (data.gotchi) {
        this.state = { ...this.state, ...data.gotchi };
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error loading gotchi state:', error);
    }
  }

  async saveState() {
    try {
      await chrome.storage.local.set({ gotchi: this.state });
    } catch (error) {
      console.error('Error saving gotchi state:', error);
    }
  }

  addExperience(amount) {
    this.state.experience += amount;
    const newLevel = Math.floor(this.state.experience / 100) + 1;
    
    if (newLevel > this.state.level) {
      this.state.level = newLevel;
      // Level up event could trigger notifications here
    }
    
    this.notifyListeners();
    this.saveState();
  }

  updateStreak(newStreak) {
    this.state.streak = newStreak;
    this.state.mood = this.calculateMood();
    this.notifyListeners();
    this.saveState();
  }

  addStudyTime(seconds) {
    this.state.totalStudyTime += seconds;
    this.notifyListeners();
    this.saveState();
  }

  calculateMood() {
    const { streak, level } = this.state;
    if (streak >= 30) return 'ecstatic';
    if (streak >= 14) return 'very-happy';
    if (streak >= 7) return 'happy';
    if (streak >= 3) return 'content';
    if (level >= 10) return 'confident';
    return 'neutral';
  }

  notifyListeners() {
    const state = { ...this.state };
    this.listeners.forEach(callback => callback(state));
  }

  getState() {
    return { ...this.state };
  }
}

export const gotchiState = new GotchiState();

