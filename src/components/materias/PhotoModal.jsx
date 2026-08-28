import "./PhotoModal.css";

export default function PhotoModal({ foto, onFechar, onExcluir, onExportar }) {
  if (!foto) return null;

  const dataFormatada = new Date(foto.criadaEm).toLocaleString("pt-BR");

  return (
    <div className="photo-modal__fundo" onClick={onFechar}>
      <div className="photo-modal__caixa" onClick={(e) => e.stopPropagation()}>
        <img src={foto.dataUrl} alt={`Conteúdo de ${foto.materia}`} />
        <div className="photo-modal__info">
          <h3>{foto.materia}</h3>
          <p>{dataFormatada}</p>
          <p className={`photo-modal__qualidade photo-modal__qualidade--${foto.qualidade}`}>
            Qualidade: {foto.scoreFinal}/100 — {foto.mensagem}
          </p>
          <div className="photo-modal__acoes">
            <button onClick={() => onExportar(foto.id)}>Exportar</button>
            <button
              className="photo-modal__excluir"
              onClick={() => {
                onExcluir(foto.id);
                onFechar();
              }}
            >
              Mover para lixeira
            </button>
            <button onClick={onFechar}>Fechar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
