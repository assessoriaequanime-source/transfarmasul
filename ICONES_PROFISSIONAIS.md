# 🎨 Padrão de Ícones Profissionais - TransFarmaSul

## Biblioteca: lucide-react
- **Padrão:** Line icons (outline)
- **Stroke:** 1.5px (padrão)
- **Tamanho base:** 24px (w-6 h-6)
- **Alinhamento:** Figma/Behance padrão

---

## 📐 Tamanhos Padrão (Tailwind)

```typescript
w-3 h-3    // 12px (xs)  - muito pequeno, evitar
w-4 h-4    // 16px (sm)  - labels, botões pequenos
w-5 h-5    // 20px (md)  - botões padrão, inputs
w-6 h-6    // 24px (base) - PADRÃO, ações comuns
w-8 h-8    // 32px (lg)  - títulos, headings
w-10 h-10  // 40px (xl)  - heroes, destaques
```

**Recomendação:** Usar w-6 h-6 como padrão, aumentar apenas para títulos/headings.

---

## 🎭 Ícones por Categoria

### 🎓 Acadêmico
```typescript
import { GraduationCap, BookOpen, FileText, ClipboardList } from "lucide-react";

// GraduationCap - Relatório, painel professor, badge acadêmico
// BookOpen - Conteúdo, materiais, aprendizado
// FileText - Documentos, PDF, exportação
// ClipboardList - Testes, listas, tarefas
```

### 🚚 Logística
```typescript
import { Truck, MapPin, Package, Route } from "lucide-react";

// Truck - Veículos, frota, entrega
// MapPin - Rotas, localizações, endereços
// Package - Carga, volume, peso
// Route - Planejamento de rotas
```

### 👥 Pessoas & Gestão
```typescript
import { Users, User, UserCheck, Eye, Lock } from "lucide-react";

// Users - Fornecedores, grupos, equipes
// User - Perfil individual
// UserCheck - Aprovação, validação
// Eye - Visualizar, monitorar
// Lock - Autenticação, segurança, acesso
```

### 📊 Dados & Análise
```typescript
import { BarChart3, LineChart, Zap, TrendingUp, PieChart } from "lucide-react";

// BarChart3 - Gráficos comparativos, BI
// LineChart - Tendências, evolução
// Zap - Performance, teste analítico, rápido
// TrendingUp - Crescimento, melhoria
// PieChart - Proporções, distribuição
```

### ⚙️ Ações & Interações
```typescript
import {
  Plus, Pencil, Trash2, X, Check,
  AlertCircle, CheckCircle, Clock,
  Mail, MessageCircle, Copy, Download, Upload
} from "lucide-react";

// Plus - Adicionar, criar, novo
// Pencil - Editar, modificar
// Trash2 - Deletar, remover
// X - Fechar, cancelar, descartar
// Check - Confirmar, salvar, aceitar
// AlertCircle - Erro, atenção, aviso
// CheckCircle - Sucesso, concluído, aprovado
// Clock - Pendente, aguardando, em progresso
// Mail - Enviar email, contato
// MessageCircle - WhatsApp, chat, mensagem
// Copy - Copiar, duplicar
// Download - Exportar, baixar
// Upload - Importar, enviar
```

### 💼 Estratégia & Estrutura
```typescript
import { Target, Layers, Network, Compass } from "lucide-react";

// Target - Metas, SWOT, objetivos
// Layers - Planejamento, estrutura, hierarquia
// Network - Relacionamentos, conexões
// Compass - Direção, guideline
```

### 🛠️ Ferramentas & Utilitários
```typescript
import {
  Wrench, Calculator, AlertTriangle, Bug,
  HelpCircle, Settings, Menu, Search
} from "lucide-react";

// Wrench - Ferramentas, menu flutuante, ajustes
// Calculator - Cálculos, operações matemáticas
// AlertTriangle - Emergência, crítico
// Bug - Logs, falhas, debug
// HelpCircle - Ajuda, dúvidas, FAQ
// Settings - Configuração, opcões
// Menu - Navegação, hamburger menu
// Search - Busca, pesquisa
```

### 🔗 Navegação
```typescript
import {
  ChevronRight, ChevronLeft, ChevronDown,
  ArrowRight, ArrowLeft, Home, LogOut
} from "lucide-react";

// ChevronRight - Próximo, expandir
// ChevronLeft - Anterior, voltar
// ChevronDown - Dropdown, expandir
// ArrowRight - Ir para, navegação
// ArrowLeft - Voltar
// Home - Início, dashboard
// LogOut - Sair, logout
```

---

## 🎨 Cores de Ícones

### Paleta Marca TransFarmaSul
```typescript
// Primária (Ações principais)
<Plus className="text-[#8D0000]" />          // Vermelho

// Secundária (Ações alternativas)
<Settings className="text-[#3C2D26]" />      // Marrom

// Neutra (Texto padrão)
<FileText className="text-[#5E5050]" />      // Cinza

// Estados
<CheckCircle className="text-green-600" />   // Sucesso
<Clock className="text-yellow-600" />        // Aviso/Pending
<AlertCircle className="text-red-600" />     // Erro
<Info className="text-blue-600" />           // Info
```

### Usando Tailwind Color Classes
```typescript
import { Plus } from "lucide-react";

// Acento (vermelho marca)
<Plus className="text-accent" />

// Cores de estado
<Plus className="text-success" />       // Verde success
<Plus className="text-warning" />       // Amarelo warning
<Plus className="text-destructive" />   // Vermelho danger
<Plus className="text-white" />         // Branco
<Plus className="text-muted-foreground" />  // Cinza neutral
```

---

## 📝 Padrões de Uso

### Botão com Ícone
```tsx
import { Plus } from "lucide-react";

<button className="flex items-center gap-2 bg-[#8D0000] text-white px-4 py-2 rounded-lg">
  <Plus className="w-5 h-5" />
  Adicionar
</button>
```

### Título com Ícone
```tsx
import { Truck } from "lucide-react";

<div className="flex items-center gap-3 mb-4">
  <Truck className="w-6 h-6 text-[#8D0000]" />
  <h2 className="text-xl font-bold">Gestão de Frota</h2>
</div>
```

### Card com Ícone
```tsx
import { BarChart3 } from "lucide-react";

<div className="flex items-start gap-3 p-4">
  <BarChart3 className="w-6 h-6 text-accent shrink-0 mt-1" />
  <div>
    <h3 className="font-semibold">Análise BI</h3>
    <p className="text-sm text-muted-foreground">Dashboard com métricas</p>
  </div>
</div>
```

### Ícone com Estado
```tsx
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

// Sucesso
<CheckCircle className="w-6 h-6 text-green-600" />

// Pendente
<Clock className="w-6 h-6 text-yellow-600" />

// Erro
<AlertCircle className="w-6 h-6 text-red-600" />
```

---

## ✅ Checklist de Implementação

- [x] Biblioteca lucide-react configurada
- [x] Ícones removidos de emojis em componentes React
- [x] Tamanhos padrão definidos (w-6 h-6)
- [x] Paleta de cores alinhada com marca
- [x] Stroke consistente (1.5px padrão)
- [ ] Testar em mobile para legibilidade
- [ ] Validar contraste de cores (WCAG AA)
- [ ] Aplicar em novos componentes (following padrão)

---

## 🚀 Boas Práticas

### ✅ FAZER
```tsx
import { Plus, Trash2, Settings } from "lucide-react";

// Tamanho consistente
<Plus className="w-6 h-6" />

// Cor proposital
<Plus className="text-[#8D0000]" />

// Espaçamento
<button className="flex items-center gap-2">
  <Plus className="w-5 h-5" />
  Adicionar
</button>

// Com label/title para acessibilidade
<button title="Adicionar novo item">
  <Plus className="w-6 h-6" />
</button>
```

### ❌ NÃO FAZER
```tsx
// Emojis em UI de produção
<h2>🎓 Relatório Acadêmico</h2>  // ❌

// Cores randômicas
<Plus style={{ color: "#fff3cd" }} />  // ❌

// Tamanhos inconsistentes
<Plus className="w-3 h-3" />
<Plus className="w-8 h-8" />  // ❌

// Sem contexto visual
<Plus />  // ❌ sozinho, sem label
```

---

## 📱 Responsividade

```typescript
// Mobile
className="w-5 h-5"  // 20px em botões

// Desktop
className="w-6 h-6"  // 24px padrão

// Títulos grandes
className="w-8 h-8"  // 32px em headings
```

---

## 🔗 Referências

- **lucide-react:** https://lucide.dev/icons
- **Figma Icons:** https://www.figma.com/resources/icons/
- **Behance Design System:** Espaçamento 8px base, stroke 1.5px

