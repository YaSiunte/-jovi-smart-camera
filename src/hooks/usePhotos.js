import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "../utils/storage";
import { generateId, diasRestantesLixeira } from "../utils/mathUtils";
import { useHistory } from "./useHistory";

const MATERIAS_PADRAO = [];

export function usePhotos() {
  const [fotos, setFotos] = useLocalStorage(STORAGE_KEYS.PHOTOS, []);
  const [materias, setMaterias] = useLocalStorage(
    STORAGE_KEYS.SUBJECTS,
    MATERIAS_PADRAO
  );
  const [lixeira, setLixeira] = useLocalStorage(STORAGE_KEYS.TRASH, []);
  const { historico, registrar } = useHistory();

  function adicionarMateria(nome) {
    const nomeLimpo = nome.trim();
    if (!nomeLimpo || materias.includes(nomeLimpo)) return false;
    setMaterias((prev) => [...prev, nomeLimpo]);
    registrar("materia", `Matéria "${nomeLimpo}" criada`);
    return true;
  }

  function removerMateria(materia) {
    if (materias.length <= 1) return false;

    const fotosDaMateria = fotos.filter((f) => f.materia === materia);

    setMaterias((prev) => prev.filter((m) => m !== materia));
    setFotos((prev) => prev.filter((f) => f.materia !== materia));
    if (fotosDaMateria.length > 0) {
      setLixeira((prev) => [
        ...fotosDaMateria.map((f) => ({ ...f, excluidaEm: Date.now() })),
        ...prev,
      ]);
    }

    registrar(
      "materia",
      `Matéria "${materia}" excluída (${fotosDaMateria.length} foto(s) movida(s) para a lixeira)`
    );
    return true;
  }

  function salvarFoto({ dataUrl, materia, scoreFinal, qualidade, mensagem }) {
    const nova = {
      id: generateId(),
      dataUrl,
      materia,
      scoreFinal,
      qualidade,
      mensagem,
      criadaEm: Date.now(),
    };
    setFotos((prev) => [nova, ...prev]);
    registrar("captura", `Foto salva em "${materia}" (qualidade ${qualidade})`);
    return nova;
  }

  function moverParaLixeira(id) {
    const foto = fotos.find((f) => f.id === id);
    if (!foto) return;
    setFotos((prev) => prev.filter((f) => f.id !== id));
    setLixeira((prev) => [{ ...foto, excluidaEm: Date.now() }, ...prev]);
    registrar("exclusao", `Foto de "${foto.materia}" movida para a lixeira`);
  }

  function restaurarDaLixeira(id) {
    const foto = lixeira.find((f) => f.id === id);
    if (!foto) return;
    const { excluidaEm, ...restaurada } = foto;
    setLixeira((prev) => prev.filter((f) => f.id !== id));
    setFotos((prev) => [restaurada, ...prev]);
    registrar("restauracao", `Foto de "${foto.materia}" restaurada`);
  }

  function excluirPermanentemente(id) {
    const foto = lixeira.find((f) => f.id === id);
    setLixeira((prev) => prev.filter((f) => f.id !== id));
    if (foto) registrar("exclusao", `Foto de "${foto.materia}" excluída definitivamente`);
  }

  function exportarFoto(id) {
    const foto = fotos.find((f) => f.id === id);
    if (!foto) return;
    const link = document.createElement("a");
    link.href = foto.dataUrl;
    link.download = `jovi-${foto.materia}-${foto.id}.png`;
    link.click();
    registrar("exportacao", `Foto de "${foto.materia}" exportada`);
  }

  const lixeiraComPrazo = useMemo(
    () =>
      lixeira.map((f) => ({
        ...f,
        diasRestantes: diasRestantesLixeira(f.excluidaEm),
      })),
    [lixeira]
  );

  const estatisticas = useMemo(() => {
    const total = fotos.length;
    const porMateria = materias.map((materia) => ({
      materia,
      quantidade: fotos.filter((f) => f.materia === materia).length,
    }));
    const boas = fotos.filter((f) => f.qualidade === "boa").length;
    const medias = fotos.filter((f) => f.qualidade === "media").length;
    const baixas = fotos.filter((f) => f.qualidade === "baixa").length;
    const mediaScore =
      total === 0
        ? 0
        : Math.round(fotos.reduce((acc, f) => acc + f.scoreFinal, 0) / total);
    return { total, porMateria, boas, medias, baixas, mediaScore };
  }, [fotos, materias]);

  return {
    fotos,
    materias,
    lixeira: lixeiraComPrazo,
    historico,
    estatisticas,
    adicionarMateria,
    removerMateria,
    salvarFoto,
    moverParaLixeira,
    restaurarDaLixeira,
    excluirPermanentemente,
    exportarFoto,
  };
}
