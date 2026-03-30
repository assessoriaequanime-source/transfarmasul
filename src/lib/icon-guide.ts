/**
 * Guia de Ícones Profissionais - Padrão Figma/Behance
 * 
 * Biblioteca: lucide-react (line icons padrão)
 * Tamanho padrão: 24px (w-6, h-6 em tailwind)
 * Stroke: 1.5px (padrão lucide)
 * 
 * Paleta de cores:
 * - Primary: #8D0000 (vermelho)
 * - Secondary: #3C2D26 (marrom)
 * - Neutral: #5E5050 (cinza)
 * - Text: inherit (color do componente pai)
 */

// GUIA DE ÍCONES POR CATEGORIA

// 🎓 ACADÊMICO
// - GraduationCap: títulos, seções acadêmicas
// - BookOpen: conteúdo, materiais
// - FileText: relatórios, documentos
// - ClipboardList: listas, tarefas

// 🚚 LOGÍSTICA
// - Truck: veículos, frota
// - MapPin: rotas, localizações
// - Package: carga, entrega
// - Route: planejamento de rotas

// 👥 PESSOAS
// - Users: fornecedores, grupos
// - UserCheck: aprovações
// - Lock: autenticação, segurança
// - Eye: visualizar

// 📊 DADOS & ANÁLISE
// - BarChart3: gráficos, BI
// - LineChart: tendências
// - Zap: performance, teste analítico
// - TrendingUp: crescimento

// ⚙️ AÇÕES
// - Plus: adicionar, criar
// - Pencil: editar
// - Trash2: deletar
// - X: fechar, cancelar
// - Check: confirmar, sucesso
// - AlertCircle: erro, aviso
// - CheckCircle: sucesso, concluído
// - Clock: pendente, aguardando
// - Mail: enviar email
// - MessageCircle: WhatsApp, mensagem
// - Copy: copiar
// - Settings: configuração
// - Menu: navegação

// 💼 ESTRATÉGIA
// - Target: metas, SWOT
// - Layers: planejamento, estrutura
// - Network: relacionamentos

// 🛠️ FERRAMENTAS
// - Wrench: ferramentas, menu flutuante
// - Calculator: calculadora
// - AlertTriangle: emergência
// - Bug: logs, falhas
// - HelpCircle: ajuda

// 💾 DADOS
// - Download: exportar
// - Upload: importar
// - Database: dados
// - PieChart: proporções

/**
 * PADRÃO DE USO TAILWIND + lucide-react
 * 
 * Botões pequenos (16px):
 * <MailIcon className="w-4 h-4" />
 * 
 * Botões padrão (24px):
 * <Plus className="w-6 h-6" />
 * 
 * Títulos/seções (32px):
 * <Truck className="w-8 h-8" />
 * 
 * Cores:
 * - Primary: <Icon className="text-accent" /> (vermelho #8D0000)
 * - Secondary: <Icon style={{ color: "#3C2D26" }} /> (marrom)
 * - Neutral: <Icon className="text-muted-foreground" />
 * - White/Light: <Icon className="text-white" /> em backgrounds escuros
 */

/**
 * ÍCONES JÁ IMPLEMENTADOS NO PROJETO:
 * ✅ GraduationCap - relatórios acadêmicos
 * ✅ Clock - status pendente
 * ✅ CheckCircle - status concluído
 * ✅ AlertCircle - erros
 * ✅ FileText - documentos
 * ✅ Truck - frota
 * ✅ Users - fornecedores
 * ✅ MapPin - rotas
 * ✅ ClipboardList - listas
 * ✅ BarChart3 - gráficos
 * ✅ Layers - estrutura
 * ✅ Plus - adicionar
 * ✅ Pencil - editar
 * ✅ Trash2 - deletar
 * ✅ X - fechar
 * ✅ Check - confirmar
 * ✅ Eye - visualizar
 * ✅ Lock - segurança
 * ✅ Wrench - ferramentas
 * ✅ Zap - teste analítico
 * ✅ Mail - email
 * ✅ MessageCircle - WhatsApp
 * ✅ Copy - copiar
 * ✅ AlertTriangle - emergência
 * ✅ Bug - logs
 * ✅ HelpCircle - ajuda
 * ✅ Target - SWOT
 * ✅ Eraser - limpar
 * ✅ RotateCcw - resetar
 * ✅ ChevronRight - navegação
 * ✅ ChevronLeft - voltar
 */

/**
 * RECOMENDAÇÕES BEHANCE/FIGMA:
 * 
 * 1. Consistência de tamanho:
 *    - w-4 h-4 (16px) para labels e ícones pequenos
 *    - w-5 h-5 (20px) para botões, inputs
 *    - w-6 h-6 (24px) para ações padrão, botões grandes
 *    - w-8 h-8 (32px) para títulos, headings
 * 
 * 2. Stroke consistente:
 *    - Todos lucide-react usam stroke 1.5px por padrão ✅
 *    - Mantém padrão visual uniforme ✅
 * 
 * 3. Espaçamento em torno de ícones:
 *    - gap-2 para ícone + texto (8px)
 *    - gap-3 para ícones maiores (12px)
 * 
 * 4. Cores:
 *    - Usar color utility classes (text-accent, text-white, etc)
 *    - Evitar cores hardcoded quando possível
 *    - Manter consistência com marca (#8D0000, #3C2D26)
 * 
 * 5. Hover/Estados:
 *    - hover:opacity-75 para ícones em botões
 *    - transition-colors para mudanças de cor
 * 
 * 6. Acessibilidade:
 *    - Usar aria-label quando ícone é único
 *    - Manter legibilidade em todos tamanhos
 */

export const ICON_SIZES = {
  xs: "w-3 h-3",      // 12px
  sm: "w-4 h-4",      // 16px
  md: "w-5 h-5",      // 20px
  base: "w-6 h-6",    // 24px (padrão)
  lg: "w-8 h-8",      // 32px
  xl: "w-10 h-10",    // 40px
} as const;

export const ICON_COLORS = {
  primary: "text-[#8D0000]",
  secondary: "text-[#3C2D26]",
  neutral: "text-[#5E5050]",
  success: "text-green-600",
  warning: "text-yellow-600",
  danger: "text-red-600",
  white: "text-white",
  muted: "text-muted-foreground",
  accent: "text-accent",
} as const;

/**
 * EXEMPLO DE USO:
 * 
 * import { Plus, Truck, MapPin } from "lucide-react";
 * import { ICON_SIZES, ICON_COLORS } from "@/lib/icon-guide";
 * 
 * <button className="flex items-center gap-2">
 *   <Plus className={`${ICON_SIZES.md} ${ICON_COLORS.primary}`} />
 *   Adicionar
 * </button>
 * 
 * <div className="flex items-center gap-3">
 *   <Truck className={`${ICON_SIZES.base} ${ICON_COLORS.primary}`} />
 *   <h2>Gestão de Frota</h2>
 * </div>
 */
