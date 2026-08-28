import "./QualityFeedback.css";

function Barra({ label, valor }) {
  return (
    <div className="qf__barra">
      <div className="qf__barra-topo">
        <span>{label}</span>
        <span>{valor}%</span>
      </div>
      <div className="qf__barra-trilho">
        <div className="qf__barra-preenchida" style={{ width: `${valor}%` }} />
      </div>
    </div>
  );
}

export default function QualityFeedback({ analise, status }) {
  if (status === "idle") {
    return (
      <div className="qf qf--vazio">
        Ative a câmera e capture uma cena para receber feedback automático.
      </div>
    );
  }

  if (status === "analisando") {
    return <div className="qf qf--vazio">Analisando imagem...</div>;
  }

  if (!analise) return null;

  return (
    <div className={`qf qf--${analise.qualidade}`}>
      <p className="qf__mensagem">{analise.mensagem}</p>
      <Barra label="Iluminação" valor={analise.scoreBrilho} />
      <Barra label="Nitidez" valor={analise.scoreNitidez} />
      <p className="qf__score">Pontuação final: {analise.scoreFinal}/100</p>
    </div>
  );
}
