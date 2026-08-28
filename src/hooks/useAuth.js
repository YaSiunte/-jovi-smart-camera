import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "../utils/storage";

// Credenciais de teste (também documentadas no README).
const USUARIO_TESTE = { email: "aluno@jovi.com", senha: "123456" };

export function useAuth() {
  const [sessao, setSessao] = useLocalStorage(STORAGE_KEYS.AUTH, null);

  function entrar(email, senha) {
    if (!email || !senha) {
      return { ok: false, erro: "Preencha todos os campos." };
    }
    if (email !== USUARIO_TESTE.email || senha !== USUARIO_TESTE.senha) {
      return { ok: false, erro: "Email ou senha inválidos." };
    }
    setSessao({ email, entrouEm: Date.now() });
    return { ok: true };
  }

  function sair() {
    setSessao(null);
  }

  return { autenticado: Boolean(sessao), sessao, entrar, sair };
}
