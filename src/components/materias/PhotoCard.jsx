import "./PhotoCard.css";

export default function PhotoCard({ foto, onAbrir }) {
  const data = new Date(foto.criadaEm).toLocaleDateString("pt-BR");

  return (
    <button className="photo-card" onClick={() => onAbrir(foto)}>
      <img src={foto.dataUrl} alt={`Conteúdo de ${foto.materia}`} />
      <div className="photo-card__rodape">
        <span className={`photo-card__badge photo-card__badge--${foto.qualidade}`}>
          {foto.scoreFinal}
        </span>
        <span className="photo-card__data">{data}</span>
      </div>
    </button>
  );
}
