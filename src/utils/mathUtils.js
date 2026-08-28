// Funções utilitárias baseadas em Math, usadas em vários pontos do app:
// pontuação de qualidade, ids, estatísticas e arredondamentos.

/** Gera um id único combinando timestamp + número aleatório. */
export function generateId() {
  const random = Math.floor(Math.random() * 1_000_000);
  return `${Date.now()}-${random}`;
}

/** Garante que um valor fique entre min e max. */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Arredonda um número para N casas decimais (padrão 0). */
export function round(value, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** Média simples de uma lista de números. */
export function average(values) {
  if (!values.length) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return sum / values.length;
}

/** Converte uma fração (0-1) em porcentagem inteira. */
export function toPercent(fraction) {
  return round(clamp(fraction, 0, 1) * 100);
}

/** Escolhe um item aleatório de um array (usado em dicas/sugestões). */
export function randomItem(list) {
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

/** Formata bytes em KB/MB usando logaritmo para escolher a unidade. */
export function formatBytes(bytes) {
  if (bytes === 0) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, exponent);
  return `${round(value, 1)} ${units[exponent]}`;
}

/** Calcula quantos dias faltam até a exclusão definitiva (lixeira, 7 dias). */
export function diasRestantesLixeira(deletedAt, prazoDias = 7) {
  const decorridoMs = Date.now() - deletedAt;
  const decorridoDias = decorridoMs / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(prazoDias - decorridoDias));
}
