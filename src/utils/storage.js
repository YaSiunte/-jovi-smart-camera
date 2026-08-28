// Camada simples sobre o localStorage, sempre serializando/desserializando
// em JSON e evitando que um erro derrube a aplicação.

export function loadFromStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Erro ao ler "${key}" do localStorage`, err);
    return fallback;
  }
}

export function saveToStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Erro ao salvar "${key}" no localStorage`, err);
    return false;
  }
}

export const STORAGE_KEYS = {
  PHOTOS: "jovi:photos",
  SUBJECTS: "jovi:subjects",
  TRASH: "jovi:trash",
  HISTORY: "jovi:history",
  AUTH: "jovi:auth",
};
