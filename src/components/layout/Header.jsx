import "./Header.css";

const ABAS = [
  { id: "captura", label: "Captura" },
  { id: "materias", label: "Matérias" },
  { id: "estatisticas", label: "Estatísticas" },
  { id: "lixeira", label: "Lixeira" },
];

export default function Header({ viewAtual, onMudarView, autenticado, onSair }) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__logo">◎</span>
        <div>
          <p className="app-header__title">Jovi Smart Camera</p>
          <p className="app-header__subtitle">Feedback inteligente para suas aulas</p>
        </div>
      </div>

      {autenticado && (
        <nav className="app-header__nav">
          {ABAS.map((aba) => (
            <button
              key={aba.id}
              className={
                aba.id === viewAtual
                  ? "app-header__nav-btn app-header__nav-btn--ativo"
                  : "app-header__nav-btn"
              }
              onClick={() => onMudarView(aba.id)}
            >
              {aba.label}
            </button>
          ))}
          <button className="app-header__sair" onClick={onSair}>
            Sair
          </button>
        </nav>
      )}
    </header>
  );
}
