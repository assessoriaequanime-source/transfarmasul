import { useState } from "react";
import { Wrench, X, Calculator, AlertTriangle, MessageCircle, Mail, ClipboardList, Bug } from "lucide-react";

export default function UtilityPanel() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [calcPrev, setCalcPrev] = useState<number | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [logText, setLogText] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

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
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        title="Ferramentas"
      >
        <Wrench className="w-6 h-6" />
      </button>

      {/* Side panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setOpen(false); setActiveTab(null); }} />
          <div className="relative ml-auto w-[340px] h-full bg-card border-l border-border shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                <span className="font-bold text-sm">Ferramentas</span>
              </div>
              <button onClick={() => { setOpen(false); setActiveTab(null); }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {tools.map((tool) => (
                <div key={tool.id}>
                  <button
                    onClick={() => {
                      if (tool.id === "whatsapp") { sendWhatsApp(); return; }
                      if (tool.id === "email") { sendEmail(); return; }
                      setActiveTab(activeTab === tool.id ? null : tool.id);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                      activeTab === tool.id ? "bg-accent/10 text-accent" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <tool.icon className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-semibold">{tool.label}</span>
                  </button>

                  {/* Calculator */}
                  {activeTab === "calc" && tool.id === "calc" && (
                    <div className="mt-2 p-3 bg-muted rounded-xl">
                      <div className="bg-card border border-border rounded-lg px-3 py-2 text-right text-lg font-mono mb-2 truncate">
                        {calcDisplay}
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {["7","8","9","÷","4","5","6","×","1","2","3","-","0",".","C","+","="].map((btn) => (
                          <button
                            key={btn}
                            onClick={() => calcPress(btn)}
                            className={`py-2 rounded-lg text-sm font-bold transition-colors ${
                              btn === "=" ? "col-span-1 bg-accent text-accent-foreground" :
                              ["+","-","×","÷"].includes(btn) ? "bg-primary/10 text-primary" :
                              btn === "C" ? "bg-destructive/10 text-destructive" :
                              "bg-card border border-border hover:bg-muted"
                            }`}
                          >
                            {btn}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Emergency */}
                  {activeTab === "emergency" && tool.id === "emergency" && (
                    <div className="mt-2 p-3 bg-muted rounded-xl space-y-2">
                      <p className="text-xs text-muted-foreground font-semibold">Contatos de emergência:</p>
                      <div className="space-y-1.5 text-xs text-foreground">
                        <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border">
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                          <div>
                            <strong>SAMU:</strong> 192
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border">
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                          <div>
                            <strong>PRF:</strong> 191
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border">
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                          <div>
                            <strong>Bombeiros:</strong> 193
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border">
                          <AlertTriangle className="w-4 h-4 text-warning" />
                          <div>
                            <strong>Suporte TransFarmaSul:</strong> (48) 0000-0000
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Logs */}
                  {activeTab === "logs" && tool.id === "logs" && (
                    <div className="mt-2 p-3 bg-muted rounded-xl space-y-2">
                      <p className="text-xs text-muted-foreground font-semibold">Registrar observação ou falha:</p>
                      <textarea
                        value={logText}
                        onChange={(e) => setLogText(e.target.value)}
                        placeholder="Descreva o problema ou observação..."
                        className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-card text-foreground resize-none min-h-[80px] outline-none focus:border-accent"
                      />
                      <button
                        onClick={submitLog}
                        className="w-full bg-primary text-primary-foreground rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <ClipboardList className="w-4 h-4" />
                        Registrar
                      </button>
                      {logs.length > 0 && (
                        <div className="max-h-[150px] overflow-y-auto space-y-1 mt-2">
                          {logs.map((log, i) => (
                            <div key={i} className="text-xs bg-card border border-border rounded-lg p-2 text-muted-foreground">
                              {log}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
