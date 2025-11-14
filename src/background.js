// Background service worker for StudyGotchi
// Note: Background script doesn't need timer/gotchi instances, just handles messages

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('StudyGotchi installed');
  initializeStorage();
});

// Initialize storage with default values
async function initializeStorage() {
  const data = await chrome.storage.local.get(['timer', 'gotchi']);
  
  if (!data.timer) {
    await chrome.storage.local.set({
      timer: {
        currentTime: 0,
        isRunning: false,
        startTime: null
      }
    });
  }

  if (!data.gotchi) {
    await chrome.storage.local.set({
      gotchi: {
        level: 1,
        experience: 0,
        streak: 0,
        totalStudyTime: 0,
        mood: 'happy',
        lastStudyDate: null
      }
    });
  }
}

// Listen for timer updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TIMER_UPDATE') {
    handleTimerUpdate(message.data);
  } else if (message.type === 'STUDY_SESSION_COMPLETE') {
    handleStudySessionComplete(message.data);
  }
});

// Handle timer updates
async function handleTimerUpdate(data) {
  await chrome.storage.local.set({ timer: data });
  
  // Update badge with current time
  const minutes = Math.floor(data.currentTime / 60);
  chrome.action.setBadgeText({ text: minutes > 0 ? String(minutes) : '' });
  chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
}

// Handle completed study session
async function handleStudySessionComplete(data) {
  const { studyTime } = data;
  
  // Get current gotchi state
  const { gotchi } = await chrome.storage.local.get(['gotchi']);
  const currentDate = new Date().toDateString();
  const lastStudyDate = gotchi.lastStudyDate;
  
  // Update streak
  let newStreak = gotchi.streak;
  if (lastStudyDate === currentDate) {
    // Already studied today, don't increment
  } else if (lastStudyDate === new Date(Date.now() - 86400000).toDateString()) {
    // Studied yesterday, increment streak
    newStreak += 1;
  } else {
    // Streak broken, reset to 1
    newStreak = 1;
  }
  
  // Calculate experience gain (1 XP per minute)
  const experienceGain = Math.floor(studyTime / 60);
  const newExperience = gotchi.experience + experienceGain;
  
  // Calculate level (100 XP per level)
  const newLevel = Math.floor(newExperience / 100) + 1;
  
  // Update gotchi state
  const updatedGotchi = {
    ...gotchi,
    level: newLevel,
    experience: newExperience,
    streak: newStreak,
    totalStudyTime: gotchi.totalStudyTime + studyTime,
    lastStudyDate: currentDate,
    mood: calculateMood(newStreak, newLevel)
  };
  
  await chrome.storage.local.set({ gotchi: updatedGotchi });
  
  // Show notification for achievements
  if (newLevel > gotchi.level) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icons/icon48.png',
      title: 'Level Up! 🎉',
      message: `Your StudyGotchi reached level ${newLevel}!`
    });
  }
  
  if (newStreak > gotchi.streak && newStreak % 7 === 0) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icons/icon48.png',
      title: 'Streak Milestone! 🔥',
      message: `${newStreak} day study streak! Keep it up!`
    });
  }
}

// Calculate mood based on streak and level
function calculateMood(streak, level) {
  if (streak >= 30) return 'ecstatic';
  if (streak >= 14) return 'very-happy';
  if (streak >= 7) return 'happy';
  if (streak >= 3) return 'content';
  return 'neutral';
}

// Periodic check for streak maintenance
chrome.alarms.create('checkStreak', { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkStreak') {
    checkStreakMaintenance();
  }
});

async function checkStreakMaintenance() {
  const { gotchi } = await chrome.storage.local.get(['gotchi']);
  if (!gotchi.lastStudyDate) return;
  
  const lastStudy = new Date(gotchi.lastStudyDate);
  const now = new Date();
  const daysSinceLastStudy = Math.floor((now - lastStudy) / (1000 * 60 * 60 * 24));
  
  // If more than 1 day has passed, reset streak
  if (daysSinceLastStudy > 1 && gotchi.streak > 0) {
    const updatedGotchi = {
      ...gotchi,
      streak: 0,
      mood: 'sad'
    };
    await chrome.storage.local.set({ gotchi: updatedGotchi });
  }
}

