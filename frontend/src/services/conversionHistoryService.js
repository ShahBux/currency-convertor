const HISTORY_STORAGE_KEY = "flowconvert-history";
const MAX_HISTORY_ITEMS = 50;

export function getStoredHistory() {
  try {
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  } catch {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    return [];
  }
}

export function saveConversionToHistory(conversion) {
  const updatedHistory = [conversion, ...getStoredHistory()].slice(
    0,
    MAX_HISTORY_ITEMS,
  );
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  return updatedHistory;
}

export function clearStoredHistory() {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}
