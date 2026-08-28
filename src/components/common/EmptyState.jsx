import "./EmptyState.css";

export default function EmptyState({ titulo, mensagem }) {
  return (
    <div className="empty-state">
      <p className="empty-state__titulo">{titulo}</p>
      <p className="empty-state__mensagem">{mensagem}</p>
    </div>
  );
}
