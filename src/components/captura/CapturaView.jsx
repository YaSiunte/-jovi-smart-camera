import { useRef, useState } from "react";
import { createWorker } from "tesseract.js";
import QualityFeedback from "./QualityFeedback";
import { analisarQualidadeImagem, gerarFeedback } from "../../utils/imageAnalysis";
import "./CapturaView.css";

export default function CapturaView({ materias, onAdicionarMateria, onSalvarFoto }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraAtiva, setCameraAtiva] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | analisando | pronto
  const [analise, setAnalise] = useState(null);
  const [dataUrlCapturada, setDataUrlCapturada] = useState(null);
  const [materiaSelecionada, setMateriaSelecionada] = useState(materias[0] || "");
  const [novaMateria, setNovaMateria] = useState("");
  const [erroCamera, setErroCamera] = useState("");

  async function abrirCamera() {
    setErroCamera("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = stream;
      setCameraAtiva(true);
    } catch (err) {
      setErroCamera(
        "Não foi possível acessar a câmera. Verifique as permissões do navegador."
      );
    }
  }

  async function capturar() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    setStatus("analisando");
    setAnalise(null);

    const metricasMatematicas = analisarQualidadeImagem(canvas);

    let textoDetectado = "";
    try {
      const worker = await createWorker("eng");
      const { data } = await worker.recognize(canvas);
      textoDetectado = data.text || "";
      await worker.terminate();
    } catch (err) {
      textoDetectado = "";
    }

    const feedback = gerarFeedback({ ...metricasMatematicas, textoDetectado });

    setAnalise({ ...metricasMatematicas, ...feedback });
    setDataUrlCapturada(canvas.toDataURL("image/png"));
    setStatus("pronto");
  }

  function salvar() {
    if (!analise || !dataUrlCapturada || !materiaSelecionada) return;
    onSalvarFoto({
      dataUrl: dataUrlCapturada,
      materia: materiaSelecionada,
      scoreFinal: analise.scoreFinal,
      qualidade: analise.qualidade,
      mensagem: analise.mensagem,
    });
    setStatus("idle");
    setAnalise(null);
    setDataUrlCapturada(null);
  }

  function handleAdicionarMateria() {
    if (onAdicionarMateria(novaMateria)) {
      setMateriaSelecionada(novaMateria.trim());
      setNovaMateria("");
    }
  }

  return (
    <section className="captura">
      <h2>Feedback Inteligente</h2>
      <p>
        Ative a câmera e capture uma cena para receber feedback automático de
        iluminação, nitidez e enquadramento.
      </p>

      <video ref={videoRef} autoPlay playsInline muted />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {erroCamera && <p className="captura__erro">{erroCamera}</p>}

      <div className="captura__botoes">
        <button onClick={abrirCamera}>
          {cameraAtiva ? "Câmera ativa" : "Ativar Câmera"}
        </button>
        <button onClick={capturar} disabled={!cameraAtiva}>
          Capturar Cena
        </button>
      </div>

      <QualityFeedback analise={analise} status={status} />

      {status === "pronto" && analise && (
        <div className="captura__salvar">
          <label>
            Matéria
            <select
              value={materiaSelecionada}
              onChange={(e) => setMateriaSelecionada(e.target.value)}
            >
              {materias.map((materia) => (
                <option key={materia} value={materia}>
                  {materia}
                </option>
              ))}
            </select>
          </label>

          <div className="captura__nova-materia">
            <input
              placeholder="Criar nova matéria"
              value={novaMateria}
              onChange={(e) => setNovaMateria(e.target.value)}
            />
            <button type="button" onClick={handleAdicionarMateria}>
              + Adicionar
            </button>
          </div>

          <button className="captura__salvar-btn" onClick={salvar}>
            Salvar foto em "{materiaSelecionada}"
          </button>
        </div>
      )}
    </section>
  );
}
