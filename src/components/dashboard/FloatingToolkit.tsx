import { useState } from "react";
import {
  Wrench, X, Calculator, AlertTriangle, MessageCircle, Mail,
  ClipboardList, Bug, HelpCircle, ChevronRight, ChevronLeft,
  BarChart3, Target, Map, Truck, Users, MapPin, FileText, Layers
} from "lucide-react";

// === HELP TOPICS (preserved from HelpBubble) ===
const TOPICS = [
  {
    icon: BarChart3, label: "Gráficos e BI",
    items: [
      { q: "Como interpretar o gráfico de barras?", a: "O gráfico de barras compara entregas e consumo de combustível por rota. Barras mais altas indicam maior volume. Compare as barras lado a lado para identificar rotas com melhor relação entregas/combustível." },
      { q: "O que é o gráfico Radar?", a: "O Radar mostra a avaliação multidimensional de fornecedores. Quanto mais próximo das bordas, melhor o desempenho naquele indicador (SLA ou Score)." },
      { q: "Como analisar o gráfico de área?", a: "O gráfico de área exibe km e litros por rota. A área preenchida mostra a tendência. Picos indicam rotas com maior custo operacional." },
      { q: "O que mostram os donuts?", a: "Os gráficos de rosca (donut) mostram a proporção da frota por tipo de veículo e por status operacional. Fatias maiores indicam maior concentração." },
    ],
  },
  {
    icon: Target, label: "Análise SWOT",
    items: [
      { q: "O que é SWOT?", a: "SWOT é uma ferramenta de análise estratégica: Strengths (Forças), Weaknesses (Fraquezas), Opportunities (Oportunidades) e Threats (Ameaças). Ajuda a empresa a entender seu posicionamento." },
      { q: "Como usar o SWOT na prática?", a: "Compare forças vs fraquezas para ações internas. Use oportunidades vs ameaças para decisões externas. Cruze os quadrantes para criar estratégias: usar forças para aproveitar oportunidades, por exemplo." },
      { q: "O que são os 3 níveis de planejamento?", a: "Estratégico: metas de longo prazo. Tático: ações por departamento. Operacional: execução diária. Cada nível detalha mais as ações do nível anterior." },
    ],
  },
  {
    icon: Map, label: "Mapa de Operações",
    items: [
      { q: "Como usar o mapa?", a: "Todas as rotas cadastradas são exibidas automaticamente no mapa com linhas tracejadas. Clique em uma rota na lista abaixo do mapa para dar foco e centralizar a visualização nela." },
      { q: "O que significam as cores?", a: "Cada rota recebe uma cor distinta para facilitar a identificação. Pontos circulares marcam origem e destino. Linhas tracejadas conectam os pontos." },
    ],
  },
  {
    icon: Truck, label: "Gestão de Frota",
    items: [
      { q: "Como cadastrar veículos?", a: "Expanda a seção 'Cadastro de veículos', preencha placa, modelo, tipo, capacidade e consumo. Clique em 'Salvar veículo'. O veículo aparecerá na tabela abaixo." },
      { q: "O que significam os status?", a: "Ativo: operacional. Manutenção: parado para reparo. Reserva: disponível mas não em uso regular." },
    ],
  },
  {
    icon: Users, label: "Fornecedores",
    items: [
      { q: "O que é SLA?", a: "SLA (Service Level Agreement) é o percentual de cumprimento do nível de serviço acordado. Quanto maior, melhor o desempenho do fornecedor nas entregas." },
      { q: "Como funciona o Score?", a: "Score é uma nota de 0 a 10 que avalia a qualidade geral do fornecedor. Considera pontualidade, qualidade dos insumos e comunicação." },
    ],
  },
  {
    icon: MapPin, label: "Rotas e Logística",
    items: [
      { q: "Como criar uma rota?", a: "Expanda 'Planejamento de rotas', preencha nome, veículo, origem, destino, prioridade e prazo. O sistema calcula automaticamente distância, combustível e tempo estimado." },
      { q: "O que é prioridade?", a: "Alta: entrega urgente, prazo curto. Média: prazo normal. Baixa: sem urgência, pode aguardar otimização de carga." },
    ],
  },
  {
    icon: FileText, label: "Relatórios",
    items: [
      { q: "Como gerar um relatório?", a: "Expanda 'Gestão de relatórios', preencha título, responsável e notas. O sistema cria um snapshot automático com dados atuais de frota, fornecedores e rotas." },
      { q: "Posso exportar dados?", a: "Sim. No topo do painel, use os botões 'Exportar JSON' ou 'Exportar CSV'. Também é possível imprimir em PDF usando 'Imprimir / PDF'." },
    ],
  },
  {
    icon: Layers, label: "Navegação geral",
    items: [
      { q: "Como funciona o painel?", a: "O painel é organizado em seções expansíveis. Clique no título de cada seção para abrir/fechar. Isso reduz a poluição visual e permite focar no que importa." },
      { q: "O que é 'Popular demo'?", a: "Carrega dados de exemplo (veículos, fornecedores e rotas) para que você possa explorar todas as funcionalidades sem precisar cadastrar tudo manualmente." },
      { q: "Como limpar os dados?", a: "Use o botão 'Limpar base' no topo. Todos os dados serão removidos. Atenção: essa ação não pode ser desfeita." },
    ],
  },
];

export default function FloatingToolkit() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"tools" | "help">("tools");
  // Help state
  const [activeTopic, setActiveTopic] = useState<number | null>(null);
  const [activeAnswer, setActiveAnswer] = useState<number | null>(null);
  // Tools state
  const [activeToolTab, setActiveToolTab] = useState<string | null>(null);
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [calcPrev, setCalcPrev] = useState<number | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [logText, setLogText] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const resetHelp = () => { setActiveTopic(null); setActiveAnswer(null); };

  const calcPress = (val: string) => {
    if (val === "C") { setCalcDisplay("0"); setCalcPrev(null); setCalcOp(null); return; }
    if (val === "=") {
      if (calcPrev !== null && calcOp) {
        const cur = parseFloat(calcDisplay);
        let res = 0;
        if (calcOp === "+") res = calcPrev + cur;
        else if (calcOp === "-") res = calcPrev - cur;
        else if (calcOp === "×") res = calcPrev * cur;
        else if (calcOp === "÷") res = cur !== 0 ? calcPrev / cur : 0;
        setCalcDisplay(String(parseFloat(res.toFixed(8))));
        setCalcPrev(null); setCalcOp(null);
      }
      return;
    }
    if (["+", "-", "×", "÷"].includes(val)) {
      setCalcPrev(parseFloat(calcDisplay)); setCalcOp(val); setCalcDisplay("0"); return;
    }
    setCalcDisplay(calcDisplay === "0" && val !== "." ? val : calcDisplay + val);
  };

  const sendWhatsApp = () => {
    const msg = encodeURIComponent("Relatório TransFarmaSul - Painel Administrativo SWOT");
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const sendEmail = () => {
    const subject = encodeURIComponent("Relatório TransFarmaSul");
    const body = encodeURIComponent("Segue relatório do Painel Administrativo SWOT - TransFarmaSul.");
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const submitLog = () => {
    if (!logText.trim()) return;
    setLogs((prev) => [...prev, `[${new Date().toLocaleString("pt-BR")}] ${logText.trim()}`]);
    setLogText("");
  };

  const tools = [
    { id: "calc", icon: Calculator, label: "Calculadora" },
    { id: "emergency", icon: AlertTriangle, label: "Emergência" },
    { id: "whatsapp", icon: MessageCircle, label: "WhatsApp" },
    { id: "email", icon: Mail, label: "E-mail" },
    { id: "logs", icon: Bug, label: "Logs / Falhas" },
  ];

  return (
    <>
      {/* Single floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        style={{ background: "#8D0000" }}
        title="Ferramentas e Ajuda"
      >
        {open ? <X className="w-6 h-6 text-white" /> : <Wrench className="w-6 h-6 text-white" />}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative w-[380px] max-h-[540px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-16">
            {/* Tabs header */}
            <div className="flex border-b border-border">
              <button
                onClick={() => { setTab("tools"); resetHelp(); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${tab === "tools" ? "bg-card text-foreground border-b-2 border-accent" : "bg-muted text-muted-foreground"}`}
              >
                <Wrench className="w-4 h-4" />Ferramentas
              </button>
              <button
                onClick={() => { setTab("help"); setActiveToolTab(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${tab === "help" ? "bg-card text-foreground border-b-2 border-accent" : "bg-muted text-muted-foreground"}`}
              >
                <HelpCircle className="w-4 h-4" />Ajuda
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {/* TOOLS TAB */}
              {tab === "tools" && (
                <div className="space-y-1.5">
                  {tools.map((tool) => (
                    <div key={tool.id}>
                      <button
                        onClick={() => {
                          if (tool.id === "whatsapp") { sendWhatsApp(); return; }
                          if (tool.id === "email") { sendEmail(); return; }
                          setActiveToolTab(activeToolTab === tool.id ? null : tool.id);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${activeToolTab === tool.id ? "bg-accent/10 text-accent" : "hover:bg-muted text-foreground"}`}
                      >
                        <tool.icon className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-semibold">{tool.label}</span>
                      </button>

                      {activeToolTab === "calc" && tool.id === "calc" && (
                        <div className="mt-2 p-3 bg-muted rounded-xl">
                          <div className="bg-card border border-border rounded-lg px-3 py-2 text-right text-lg font-mono mb-2 truncate">{calcDisplay}</div>
                          <div className="grid grid-cols-4 gap-1">
                            {["7","8","9","÷","4","5","6","×","1","2","3","-","0",".","C","+","="].map((btn) => (
                              <button key={btn} onClick={() => calcPress(btn)} className={`py-2 rounded-lg text-sm font-bold transition-colors ${btn === "=" ? "col-span-1 bg-accent text-accent-foreground" : ["+","-","×","÷"].includes(btn) ? "bg-primary/10 text-primary" : btn === "C" ? "bg-destructive/10 text-destructive" : "bg-card border border-border hover:bg-muted"}`}>
                                {btn}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeToolTab === "emergency" && tool.id === "emergency" && (
                        <div className="mt-2 p-3 bg-muted rounded-xl space-y-1.5">
                          <p className="text-xs text-muted-foreground font-semibold">Contatos de emergência:</p>
                          {[
                            { label: "SAMU", number: "192" },
                            { label: "PRF", number: "191" },
                            { label: "Bombeiros", number: "193" },
                            { label: "Suporte TransFarmaSul", number: "(48) 0000-0000" },
                          ].map((c) => (
                            <div key={c.label} className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border text-xs">
                              <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                              <div><strong>{c.label}:</strong> {c.number}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeToolTab === "logs" && tool.id === "logs" && (
                        <div className="mt-2 p-3 bg-muted rounded-xl space-y-2">
                          <p className="text-xs text-muted-foreground font-semibold">Registrar observação ou falha:</p>
                          <textarea value={logText} onChange={(e) => setLogText(e.target.value)} placeholder="Descreva o problema ou observação..." className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-card text-foreground resize-none min-h-[80px] outline-none focus:border-accent" />
                          <button onClick={submitLog} className="w-full bg-primary text-primary-foreground rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                            <ClipboardList className="w-4 h-4" />Registrar
                          </button>
                          {logs.length > 0 && (
                            <div className="max-h-[120px] overflow-y-auto space-y-1 mt-1">
                              {logs.map((log, i) => (
                                <div key={i} className="text-xs bg-card border border-border rounded-lg p-2 text-muted-foreground">{log}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* HELP TAB */}
              {tab === "help" && (
                <div className="space-y-1.5">
                  {activeTopic !== null && (
                    <button onClick={resetHelp} className="flex items-center gap-1 text-xs text-accent mb-2 hover:underline">
                      <ChevronLeft className="w-3 h-3" />Voltar aos tópicos
                    </button>
                  )}
                  {activeTopic === null ? (
                    TOPICS.map((topic, i) => (
                      <button key={i} onClick={() => { setActiveTopic(i); setActiveAnswer(null); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left">
                        <topic.icon className="w-4 h-4 text-accent shrink-0" />
                        <span className="text-sm font-medium text-foreground">{topic.label}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                      </button>
                    ))
                  ) : (
                    TOPICS[activeTopic].items.map((item, i) => (
                      <div key={i}>
                        <button onClick={() => setActiveAnswer(activeAnswer === i ? null : i)} className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${activeAnswer === i ? "bg-accent/10 text-accent" : "hover:bg-muted text-foreground"}`}>
                          {item.q}
                        </button>
                        {activeAnswer === i && (
                          <div className="mx-3 mt-1 mb-2 p-3 bg-muted rounded-xl text-xs text-muted-foreground leading-relaxed">{item.a}</div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
