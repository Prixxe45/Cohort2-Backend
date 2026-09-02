const STORAGE_KEY_HISTORY = 'omnijudge_battle_history_v1';
const STORAGE_KEY_LEADERBOARD = 'omnijudge_leaderboard_v1';
const STORAGE_KEY_SETTINGS = 'omnijudge_settings_v1';

export const getStoredHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load history', err);
    return [];
  }
};

export const saveBattleToHistory = (battleRecord) => {
  try {
    const current = getStoredHistory();
    const updated = [
      {
        ...battleRecord,
        id: battleRecord.id || `battle_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
      ...current.slice(0, 49), // retain last 50 battles
    ];
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    updateLeaderboardStats(battleRecord);
    return updated;
  } catch (err) {
    console.error('Failed to save battle', err);
    return [];
  }
};

export const deleteBattleHistoryItem = (id) => {
  try {
    const current = getStoredHistory();
    const filtered = current.filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Failed to delete history item', err);
    return [];
  }
};

export const clearAllHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
    return [];
  } catch (err) {
    console.error('Failed to clear history', err);
    return [];
  }
};

export const getStoredLeaderboard = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADERBOARD);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load leaderboard', err);
  }

  // Default seed leaderboard
  return [
    { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet', wins: 28, losses: 6, ties: 2, avgScore: 9.3, elo: 1392 },
    { id: 'gpt-4o', name: 'GPT-4o (Omni)', wins: 25, losses: 9, ties: 2, avgScore: 9.0, elo: 1374 },
    { id: 'deepseek-r1', name: 'DeepSeek-R1', wins: 22, losses: 10, ties: 4, avgScore: 8.9, elo: 1358 },
    { id: 'gemini-2-flash', name: 'Gemini 2.0 Flash', wins: 20, losses: 12, ties: 4, avgScore: 8.7, elo: 1345 },
    { id: 'llama-3-3-70b', name: 'Llama 3.3 70B', wins: 17, losses: 15, ties: 4, avgScore: 8.4, elo: 1328 },
    { id: 'safety-guard-model', name: 'Standard Guard Model', wins: 5, losses: 29, ties: 2, avgScore: 4.8, elo: 1115 },
  ];
};

export const updateLeaderboardStats = (battle) => {
  try {
    const board = getStoredLeaderboard();
    const s1Score = Number(battle.judge?.solution_1_score || 0);
    const s2Score = Number(battle.judge?.solution_2_score || 0);

    const m1Id = battle.model_1?.id || 'claude-3-7-sonnet';
    const m2Id = battle.model_2?.id || 'safety-guard-model';

    const updated = board.map((item) => {
      let stats = { ...item };
      if (item.id === m1Id) {
        if (s1Score > s2Score) stats.wins += 1;
        else if (s1Score < s2Score) stats.losses += 1;
        else stats.ties += 1;
        stats.elo += s1Score > s2Score ? 16 : s1Score < s2Score ? -12 : 2;
      }
      if (item.id === m2Id) {
        if (s2Score > s1Score) stats.wins += 1;
        else if (s2Score < s1Score) stats.losses += 1;
        else stats.ties += 1;
        stats.elo += s2Score > s1Score ? 16 : s2Score < s1Score ? -12 : 2;
      }
      return stats;
    });

    localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update leaderboard', err);
  }
};

export const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return raw
      ? JSON.parse(raw)
      : {
          apiUrl: 'http://localhost:8000/run',
          preferRealBackend: false, // fallback to simulation if connection drops
          judgeStrictness: 8, // 1 to 10
          streamSpeed: 'fast',
          autoSaveHistory: true,
        };
  } catch {
    return {
      apiUrl: 'http://localhost:8000/run',
      preferRealBackend: false,
      judgeStrictness: 8,
      streamSpeed: 'fast',
      autoSaveHistory: true,
    };
  }
};

export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
};
