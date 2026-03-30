import { useRef, useState, useEffect } from "react";
import { Eraser, Check } from "lucide-react";

interface Props {
  onConfirm: (dataUrl: string) => void;
  confirmed: boolean;
}

export default function SignatureCanvas({ onConfirm, confirmed }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 300, 150);
    ctx.strokeStyle = "#3C2D26";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (confirmed) return;
    setDrawing(true);
    setHasDrawn(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing || confirmed) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 300, 150);
    setHasDrawn(false);
  };

  const confirm = () => {
    if (!hasDrawn) return;
    const dataUrl = canvasRef.current?.toDataURL("image/png") || "";
    onConfirm(dataUrl);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground font-semibold">Assinatura virtual</p>
      <canvas
        ref={canvasRef}
        width={300}
        height={150}
        className={`border border-input rounded-xl cursor-crosshair touch-none ${confirmed ? "opacity-70" : ""}`}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      {!confirmed && (
        <div className="flex gap-2">
          <button type="button" onClick={clear} className="inline-flex items-center gap-1 bg-muted border border-border px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-accent/10 transition-colors">
            <Eraser className="w-3.5 h-3.5" />Limpar
          </button>
          <button type="button" onClick={confirm} disabled={!hasDrawn} className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40">
            <Check className="w-3.5 h-3.5" />Confirmar
          </button>
        </div>
      )}
      {confirmed && <p className="text-xs text-success font-semibold">Assinatura confirmada</p>}
    </div>
  );
}
