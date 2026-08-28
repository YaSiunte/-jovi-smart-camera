import { useMemo, useState } from "react";
import PhotoCard from "./PhotoCard";
import PhotoModal from "./PhotoModal";
import EmptyState from "../common/EmptyState";
import "./MateriasView.css";

export default function MateriasView({
  fotos,
  materias,
  onExcluir,
  onExportar,
  onRemoverMateria,
}) {
  const [materiaAtiva, setMateriaAtiva] = useState(null);
  const [busca, setBusca] = useState("");
  const [fotoSelecionada, setFotoSelecionada] = useState(null);

  const contagemPorMateria = useMemo(() => {
    const mapa = {};
    materias.forEach((m) => (mapa[m] = 0));
    fotos.forEach((f) => (mapa[f.materia] = (mapa[f.materia] || 0) + 1));
    return mapa;
  }, [fotos, materias]);

  const fotosFiltradas = useMemo(() => {
    return fotos.filter((f) => {
      const bateMateria = materiaAtiva ? f.materia === materiaAtiva : true;
      const bateBusca = busca
        ? f.materia.toLowerCase().includes(busca.toLowerCase())
        : true;
      return bateMateria && bateBusca;
    });
  }, [fotos, materiaAtiva, busca]);

  function handleRemoverMateria(e, materia) {
    e.stopPropagation();

    if (materias.length <= 1) {
      alert("Você precisa manter pelo menos uma matéria.");
      return;
    }

    const quantidade = fotos.filter((f) => f.materia === materia).length;
    const aviso =
      quantidade > 0
        ? `Excluir "${materia}"? ${quantidade} foto(s) dessa matéria irão para a lixeira.`
        : `Excluir a matéria "${materia}"?`;

    if (!window.confirm(aviso)) return;

    onRemoverMateria(materia);
    if (materiaAtiva === materia) setMateriaAtiva(null);
  }

  return (
    <section className="materias">
      <h2>Minhas Matérias</h2>

      <input
        className="materias__busca"
        placeholder="Buscar por matéria..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="materias__folders">
        <button
          className={
            materiaAtiva === null
              ? "materias__folder materias__folder--ativa"
              : "materias__folder"
          }
          onClick={() => setMateriaAtiva(null)}
        >
          Todas ({fotos.length})
        </button>
        {materias.map((materia) => (
          <span
            key={materia}
            className={
              materiaAtiva === materia
                ? "materias__folder materias__folder--ativa"
                : "materias__folder"
            }
          >
            <button
              className="materias__folder-nome"
              onClick={() => setMateriaAtiva(materia)}
            >
              {materia} ({contagemPorMateria[materia] || 0})
            </button>
            <button
              className="materias__folder-remover"
              title={`Excluir matéria "${materia}"`}
              onClick={(e) => handleRemoverMateria(e, materia)}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {fotosFiltradas.length === 0 ? (
        <EmptyState
          titulo="Nenhuma foto encontrada"
          mensagem="Capture conteúdos na aba Captura para vê-los organizados aqui."
        />
      ) : (
        <div className="materias__grid">
          {fotosFiltradas.map((foto) => (
            <PhotoCard key={foto.id} foto={foto} onAbrir={setFotoSelecionada} />
          ))}
        </div>
      )}

      <PhotoModal
        foto={fotoSelecionada}
        onFechar={() => setFotoSelecionada(null)}
        onExcluir={onExcluir}
        onExportar={onExportar}
      />
    </section>
  );
}
