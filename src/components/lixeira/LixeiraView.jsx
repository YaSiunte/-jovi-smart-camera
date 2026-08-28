import EmptyState from "../common/EmptyState";
import "./LixeiraView.css";

export default function LixeiraView({ lixeira, onRestaurar, onExcluirDefinitivo }) {
  return (
    <section className="lixeira">
      <h2>Lixeira</h2>
      <p className="lixeira__aviso">
        Itens excluídos ficam disponíveis por 7 dias antes de serem removidos
        permanentemente.
      </p>

      {lixeira.length === 0 ? (
        <EmptyState
          titulo="Lixeira vazia"
          mensagem="Fotos excluídas das suas matérias aparecerão aqui."
        />
      ) : (
        <div className="lixeira__grid">
          {lixeira.map((foto) => (
            <div key={foto.id} className="lixeira__item">
              <img src={foto.dataUrl} alt={`Conteúdo de ${foto.materia}`} />
              <div className="lixeira__info">
                <p className="lixeira__materia">{foto.materia}</p>
                <p className="lixeira__prazo">
                  {foto.diasRestantes > 0
                    ? `${foto.diasRestantes} dia(s) restante(s)`
                    : "Será removida em breve"}
                </p>
                <div className="lixeira__acoes">
                  <button onClick={() => onRestaurar(foto.id)}>Restaurar</button>
                  <button
                    className="lixeira__excluir"
                    onClick={() => onExcluirDefinitivo(foto.id)}
                  >
                    Excluir agora
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
