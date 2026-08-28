import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "../utils/storage";
import { generateId } from "../utils/mathUtils";

/** Registra ações do usuário (captura, exclusão, restauração, exportação). */
export function useHistory() {
  const [historico, setHistorico] = useLocalStorage(STORAGE_KEYS.HISTORY, []);

  function registrar(acao, detalhe) {
    const evento = {
      id: generateId(),
      acao, // "captura" | "exclusao" | "restauracao" | "exportacao" | "materia"
      detalhe,
      data: Date.now(),
    };
    setHistorico((prev) => [evento, ...prev].slice(0, 100));
  }

  return { historico, registrar };
}
