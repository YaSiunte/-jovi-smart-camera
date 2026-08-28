import { clamp, round } from "./mathUtils";

/**
 * Analisa os pixels de um canvas e calcula métricas de qualidade
 * usando apenas operações matemáticas (sem IA de terceiros):
 *  - brilho médio (detecta baixa iluminação)
 *  - nitidez aproximada, via variação entre pixels vizinhos (detecta borrão)
 */
export function analisarQualidadeImagem(canvas) {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;

  // Reduz a amostragem para manter o cálculo rápido em qualquer aparelho.
  const passo = Math.max(1, Math.floor(Math.sqrt((width * height) / 4000)));

  const { data } = ctx.getImageData(0, 0, width, height);

  let somaBrilho = 0;
  let amostras = 0;
  let somaDiferencas = 0;
  let diffAmostras = 0;

  for (let y = 0; y < height; y += passo) {
    for (let x = 0; x < width; x += passo) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luminancia = 0.299 * r + 0.587 * g + 0.114 * b;
      somaBrilho += luminancia;
      amostras++;

      // Nitidez: diferença de luminância para o pixel vizinho (proxy de borda).
      if (x + passo < width) {
        const iViz = (y * width + (x + passo)) * 4;
        const luminanciaViz =
          0.299 * data[iViz] + 0.587 * data[iViz + 1] + 0.114 * data[iViz + 2];
        somaDiferencas += Math.abs(luminancia - luminanciaViz);
        diffAmostras++;
      }
    }
  }

  const brilhoMedio = amostras ? somaBrilho / amostras : 0;
  const nitidezMedia = diffAmostras ? somaDiferencas / diffAmostras : 0;

  // Normaliza para uma escala de 0 a 100 usando clamp/round (Math).
  const scoreBrilho = round(clamp((brilhoMedio / 255) * 100, 0, 100));
  const scoreNitidez = round(clamp((nitidezMedia / 40) * 100, 0, 100));

  return {
    brilhoMedio: round(brilhoMedio),
    scoreBrilho,
    nitidezMedia: round(nitidezMedia, 1),
    scoreNitidez,
  };
}

/**
 * Combina as métricas matemáticas com a leitura de texto (OCR) para
 * gerar uma pontuação final e uma mensagem de feedback para o usuário.
 */
export function gerarFeedback({ scoreBrilho, scoreNitidez, textoDetectado }) {
  const problemas = [];

  if (scoreBrilho < 35) problemas.push("baixa iluminação");
  if (scoreNitidez < 25) problemas.push("falta de nitidez (imagem borrada)");
  if (textoDetectado.trim().length < 5)
    problemas.push("enquadramento ou distância inadequados");

  // Pontuação final: média ponderada arredondada (Math.round embutido em round).
  const pesoBrilho = 0.35;
  const pesoNitidez = 0.35;
  const pesoTexto = 0.3;
  const scoreTexto = clamp(textoDetectado.trim().length * 4, 0, 100);
  const scoreFinal = round(
    scoreBrilho * pesoBrilho + scoreNitidez * pesoNitidez + scoreTexto * pesoTexto
  );

  const qualidade = scoreFinal >= 70 ? "boa" : scoreFinal >= 45 ? "media" : "baixa";

  const mensagem =
    problemas.length === 0
      ? "Ótima captura! Iluminação, nitidez e enquadramento estão adequados."
      : `Ajuste antes de salvar: ${problemas.join(", ")}.`;

  return { scoreFinal, qualidade, mensagem, problemas };
}
