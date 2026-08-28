import { useState } from "react";
import "./LoginForm.css";

export default function LoginForm({ onEntrar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const resultado = onEntrar(email, senha);
    setErro(resultado.ok ? "" : resultado.erro);
  }

  return (
    <section className="login">
      <div className="login__card">
        <h2>Entrar no Jovi</h2>
        <p className="login__hint">
          Use as credenciais de teste: <strong>aluno@jovi.com</strong> /{" "}
          <strong>123456</strong>
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {erro && <p className="login__erro">{erro}</p>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    </section>
  );
}
