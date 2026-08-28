import { useState } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LoginForm from "./components/auth/LoginForm";
import CapturaView from "./components/captura/CapturaView";
import MateriasView from "./components/materias/MateriasView";
import EstatisticasView from "./components/estatisticas/EstatisticasView";
import LixeiraView from "./components/lixeira/LixeiraView";
import { useAuth } from "./hooks/useAuth";
import { usePhotos } from "./hooks/usePhotos";
import "./App.css";

export default function App() {
  const { autenticado, entrar, sair } = useAuth();
  const {
    fotos,
    materias,
    lixeira,
    historico,
    estatisticas,
    adicionarMateria,
    removerMateria,
    salvarFoto,
    moverParaLixeira,
    restaurarDaLixeira,
    excluirPermanentemente,
    exportarFoto,
  } = usePhotos();

  const [view, setView] = useState("captura");

  return (
    <div className="app">
      <Header
        viewAtual={view}
        onMudarView={setView}
        autenticado={autenticado}
        onSair={sair}
      />

      <main className="app__conteudo">
        {!autenticado ? (
          <LoginForm onEntrar={entrar} />
        ) : (
          <>
            {view === "captura" && (
              <CapturaView
                materias={materias}
                onAdicionarMateria={adicionarMateria}
                onSalvarFoto={salvarFoto}
              />
            )}
            {view === "materias" && (
              <MateriasView
                fotos={fotos}
                materias={materias}
                onExcluir={moverParaLixeira}
                onExportar={exportarFoto}
                onRemoverMateria={removerMateria}
              />
            )}
            {view === "estatisticas" && (
              <EstatisticasView estatisticas={estatisticas} historico={historico} />
            )}
            {view === "lixeira" && (
              <LixeiraView
                lixeira={lixeira}
                onRestaurar={restaurarDaLixeira}
                onExcluirDefinitivo={excluirPermanentemente}
              />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

