import { toPercent } from "../../utils/mathUtils";
import EmptyState from "../common/EmptyState";
import "./EstatisticasView.css";

function StatCard({ numero, label }) {
  return (
    <div className="stat-card">
      <p className="stat-card__numero">{numero}</p>
      <p className="stat-card__label">{label}</p>
    </div>
  );
}

export default function EstatisticasView({ estatisticas, historico }) {
  const { total, porMateria, boas, medias, baixas, mediaScore } = estatisticas;

  return (
    <section className="estatisticas">
      <h2>Estatísticas</h2>

      <div className="estatisticas__cards">
        <StatCard numero={total} label="Fotos capturadas" />
        <StatCard numero={`${mediaScore}/100`} label="Qualidade média" />
        <StatCard numero={total ? toPercent(boas / total) + "%" : "0%"} label="Boa qualidade" />
        <StatCard numero={total ? toPercent(baixas / total) + "%" : "0%"} label="Precisam refazer" />
      </div>

      <h3 className="estatisticas__subtitulo">Fotos por matéria</h3>
      <div className="estatisticas__barras">
        {porMateria.map(({ materia, quantidade }) => (
          <div key={materia} className="estatisticas__barra-linha">
            <span>{materia}</span>
            <div className="estatisticas__barra-trilho">
              <div
                className="estatisticas__barra-preenchida"
                style={{
                  width: `${total ? toPercent(quantidade / total) : 0}%`,
                }}
              />
            </div>
            <span>{quantidade}</span>
          </div>
        ))}
      </div>

      <h3 className="estatisticas__subtitulo">Histórico de atividades</h3>
      {historico.length === 0 ? (
        <EmptyState
          titulo="Nenhuma atividade ainda"
          mensagem="Suas ações (capturas, exclusões, exportações) aparecerão aqui."
        />
      ) : (
        <ul className="estatisticas__historico">
          {historico.slice(0, 20).map((evento) => (
            <li key={evento.id}>
              <span className={`estatisticas__tag estatisticas__tag--${evento.acao}`}>
                {evento.acao}
              </span>
              <span>{evento.detalhe}</span>
              <span className="estatisticas__data">
                {new Date(evento.data).toLocaleString("pt-BR")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
