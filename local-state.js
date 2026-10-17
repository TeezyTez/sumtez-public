// Only tool IDs and step numbers are persisted. Prompt inputs stay in memory.
window.SUMTEZ_STATE = {
  read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(`sumtez:${key}`)) ?? fallback; }
    catch { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem(`sumtez:${key}`, JSON.stringify(value)); return true; }
    catch { return false; }
  }
};
