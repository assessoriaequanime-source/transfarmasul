import { useState } from "react";
import { HelpCircle, X, ChevronRight, ChevronLeft, BarChart3, Target, Map, Truck, Users, MapPin, FileText, Layers } from "lucide-react";

interface HelpTopic {
  icon: React.ElementType;
  label: string;
  items: { q: string; a: string }[];
}

const TOPICS: HelpTopic[] = [
  {
    icon: BarChart3,
    label: "Gráficos e BI",
    items: [
      { q: "Como interpretar o gráfico de barras?", a: "O gráfico de barras compara entregas e consumo de combustível por rota. Barras mais altas indicam maior volume. Compare as barras lado a lado para identificar rotas com melhor relação entregas/combustível." },
      { q: "O que é o gráfico Radar?", a: "O Radar mostra a avaliação multidimensional de fornecedores. Quanto mais próximo das bordas, melhor o desempenho naquele indicador (SLA ou Score)." },
      { q: "Como analisar o gráfico de área?", a: "O gráfico de área exibe km e litros por rota. A área preenchida mostra a tendência. Picos indicam rotas com maior custo operacional." },
      { q: "O que mostram os donuts?", a: "Os gráficos de rosca (donut) mostram a proporção da frota por tipo de veículo e por status operacional. Fatias maiores indicam maior concentração." },
    ],
  },
  {
    icon: Target,
    label: "Análise SWOT",
    items: [
      { q: "O que é SWOT?", a: "SWOT é uma ferramenta de análise estratégica: Strengths (Forças), Weaknesses (Fraquezas), Opportunities (Oportunidades) e Threats (Ameaças). Ajuda a empresa a entender seu posicionamento." },
      { q: "Como usar o SWOT na prática?", a: "Compare forças vs fraquezas para ações internas. Use oportunidades vs ameaças para decisões externas. Cruze os quadrantes para criar estratégias: usar forças para aproveitar oportunidades, por exemplo." },
      { q: "O que são os 3 níveis de planejamento?", a: "Estratégico: metas de longo prazo. Tático: ações por departamento. Operacional: execução diária. Cada nível detalha mais as ações do nível anterior." },
    ],
  },
  {
    icon: Map,
    label: "Mapa de Operações",
    items: [
      { q: "Como usar o mapa?", a: "Todas as rotas cadastradas são exibidas automaticamente no mapa com linhas tracejadas. Clique em uma rota na lista abaixo do mapa para dar foco e centralizar a visualização nela." },
      { q: "O que significam as cores?", a: "Cada rota recebe uma cor distinta para facilitar a identificação. Pontos circulares marcam origem e destino. Linhas tracejadas conectam os pontos." },
    ],
  },
  {
    icon: Truck,
    label: "Gestão de Frota",
    items: [
      { q: "Como cadastrar veículos?", a: "Expanda a seção 'Cadastro de veículos', preencha placa, modelo, tipo, capacidade e consumo. Clique em 'Salvar veículo'. O veículo aparecerá na tabela abaixo." },
      { q: "O que significam os status?", a: "Ativo: operacional. Manutenção: parado para reparo. Reserva: disponível mas não em uso regular." },
    ],
  },
  {
    icon: Users,
    label: "Fornecedores",
    items: [
      { q: "O que é SLA?", a: "SLA (Service Level Agreement) é o percentual de cumprimento do nível de serviço acordado. Quanto maior, melhor o desempenho do fornecedor nas entregas." },
      { q: "Como funciona o Score?", a: "Score é uma nota de 0 a 10 que avalia a qualidade geral do fornecedor. Considera pontualidade, qualidade dos insumos e comunicação." },
    ],
  },
  {
    icon: MapPin,
    label: "Rotas e Logística",
    items: [
      { q: "Como criar uma rota?", a: "Expanda 'Planejamento de rotas', preencha nome, veículo, origem, destino, prioridade e prazo. O sistema calcula automaticamente distância, combustível e tempo estimado." },
      { q: "O que é prioridade?", a: "Alta: entrega urgente, prazo curto. Média: prazo normal. Baixa: sem urgência, pode aguardar otimização de carga." },
    ],
  },
  {
    icon: FileText,
    label: "Relatórios",
    items: [
      { q: "Como gerar um relatório?", a: "Expanda 'Gestão de relatórios', preencha título, responsável e notas. O sistema cria um snapshot automático com dados atuais de frota, fornecedores e rotas." },
      { q: "Posso exportar dados?", a: "Sim. No topo do painel, use os botões 'Exportar JSON' ou 'Exportar CSV'. Também é possível imprimir em PDF usando 'Imprimir / PDF'." },
    ],
  },
  {
    icon: Layers,
    label: "Navegação geral",
    items: [
      { q: "Como funciona o painel?", a: "O painel é organizado em seções expansíveis. Clique no título de cada seção para abrir/fechar. Isso reduz a poluição visual e permite focar no que importa." },
      { q: "O que é 'Popular demo'?", a: "Carrega dados de exemplo (veículos, fornecedores e rotas) para que você possa explorar todas as funcionalidades sem precisar cadastrar tudo manualmente." },
      { q: "Como limpar os dados?", a: "Use o botão 'Limpar base' no topo. Todos os dados serão removidos. Atenção: essa ação não pode ser desfeita." },
    ],
  },
];

export default function HelpBubble() {
  const [open, setOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState<number | null>(null);
  const [activeAnswer, setActiveAnswer] = useState<number | null>(null);

  const reset = () => { setActiveTopic(null); setActiveAnswer(null); };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => { setOpen(!open); reset(); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        title="Ajuda"
      >
        {open ? <X className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
      </button>

      {/* Dialog */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] max-h-[480px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-primary text-primary-foreground px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                <span className="font-bold text-sm">Central de Ajuda</span>
              </div>
              {activeTopic !== null && (
                <button onClick={reset} className="text-primary-foreground/80 hover:text-primary-foreground">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-primary-foreground/70 mt-1">
              {activeTopic === null ? "Selecione um tópico para obter ajuda" : TOPICS[activeTopic].label}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {activeTopic === null ? (
              // Topic list
              TOPICS.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveTopic(i); setActiveAnswer(null); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left"
                >
                  <topic.icon className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-sm font-medium text-foreground">{topic.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                </button>
              ))
            ) : (
              // Questions for selected topic
              TOPICS[activeTopic].items.map((item, i) => (
                <div key={i}>
                  <button
                    onClick={() => setActiveAnswer(activeAnswer === i ? null : i)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${
                      activeAnswer === i ? "bg-accent/10 text-accent" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {item.q}
                  </button>
                  {activeAnswer === i && (
                    <div className="mx-3 mt-1 mb-2 p-3 bg-muted rounded-xl text-xs text-muted-foreground leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
