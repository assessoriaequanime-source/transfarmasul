# 🎯 Guia Rápido - Transfarmasul

## 🚀 Iniciar o Projeto

```bash
cd /workspaces/transfarmasul
npm install --legacy-peer-deps
npm run dev
# Acesso: http://localhost:5173
```

---

## 📍 Rotas Principais

| Rota | Descrição | Login |
|------|-----------|-------|
| `/` | Dashboard principal | Não |
| `/relatorio?id=rel_abc123def` | Ver relatório do aluno | Não |
| `/professor` | Dashboard do professor | Sim (professor123) |

---

## 🎓 Fluxos Principais

### 1️⃣ Aluno - Submeter Relatório
```
Homepage → Botão "Relatório Acadêmico" (vermelho)
  ↓
Preenche formulário + assinatura
  ↓
Clica "Enviar e gerar link privado"
  ↓
Recebe link único: rel_abc123def
  ↓
Salva/compartilha link
```

### 2️⃣ Aluno - Consultar Resultado
```
Abre link privado recebido
  ↓
Se "pendente" → Vê mensagem "Aguardando avaliação"
Se "avaliado" → Vê nota + feedback professor
```

### 3️⃣ Professor - Criar Teste
```
/professor → Senha: professor123
  ↓
Tab "Testes" → Botão "Criar novo teste"
  ↓
Preenche dados (título, descrição, prazo)
  ↓
Clica "Criar teste"
  ↓
Aparece na homepage (banner com testes disponíveis)
```

### 4️⃣ Professor - Avaliar Relatório
```
/professor → Tab "Relatórios"
  ↓
Localiza relatório "pendente"
  ↓
Clica botão ✏️ (Avaliar)
  ↓
Preenche: pontos fortes/fracos, nota (0-10), sugestão
  ↓
Clica "Enviar avaliação"
  ↓
Status muda para "avaliado"
  ↓
Aluno vê resultado no seu link
```

### 5️⃣ Aluno - Teste Analítico
```
Homepage → Botão "Teste Analítico" (marrom)
  ↓
Gera dados aleatórios (veículos, fornecedores, rotas)
  ↓
Dashboard atualiza com novos dados
  ↓
Clica "Relatório Acadêmico" para submeter análise
  ↓
Campo "Teste associado" ← conecta ao teste do professor
```

---

## 🎨 Cores da Marca

```
Vermelho:   #8D0000  → Botões principais (Relatório, Avaliar)
Marrom:     #3C2D26  → Teste Analítico, ações secundárias
Cinza:      #5E5050  → Textos e auxiliares
```

---

## 💾 localStorage Keys

### Estrutura de Dados

```javascript
// Dashboard
localStorage.getItem("transfarmasul_dashboard_v1")
// {vehicles, suppliers, routes, reports}

// Relatórios Acadêmicos
localStorage.getItem("relatorios")
// Array of AcademicReport objects

// Testes Professor
localStorage.getItem("testes")
// Array of ProfessorTest objects
```

### Limpar Dados Manualmente

```javascript
localStorage.removeItem("transfarmasul_dashboard_v1");
localStorage.removeItem("relatorios");
localStorage.removeItem("testes");
```

---

## 🔧 Componentes Principais

### FloatingToolkit (Menu 🧰)
- Localização: Canto inferior direito
- Tabs: "Ferramentas" e "Ajuda"
- Funções: Calculadora, Emergência, WhatsApp, Email, Logs

### HeroSection (Barra de Ações)
- Botões: Popular Demo, Limpar Base, Teste Analítico, Relatório Acadêmico
- Banner: Testes disponíveis (criados pelo professor)

### AcademicReportModal
- 2 etapas: Formulário + Link de Sucesso
- Obrigatório: Nome, matrícula, assinatura, pré-relatório
- Opcional: Associar a teste existente

### ReportViewer
- Sem autenticação (link é token)
- Mostra dados do aluno + avaliação (se avaliado)

### Professor Dashboard
- Tabs: Overview, Testes, Relatórios, Métricas
- Senha: professor123
- Gráficos: Evolução de notas, nuvem de palavras

---

## ❓ FAQs Rápidas

**P: Como o aluno acessa seu relatório?**  
R: Via link privado recebido (ex: `https://meusite.com/relatorio?id=rel_abc123def`)

**P: O professor consegue ver todos os relatórios?**  
R: Sim, no dashboard (`/professor`) com senha.

**P: Dados são salvos para sempre?**  
R: Sim, no localStorage do navegador. Se limpar cache, perde dados.

**P: Posso integrar com Firebase?**  
R: Sim, futuro. Atualmente localStorage é suficiente.

**P: Qual a senha do professor?**  
R: `professor123`

**P: Como remover um teste?**  
R: Dashboard professor → Tab Testes → Botão 🗑️

**P: O aluno consegue editar seu relatório?**  
R: Não (por design). Se aproveivar, cria novo.

**P: Quantos relatórios de alunos diferentes podem existir?**  
R: Ilimitado, apenas limitado pela capacidade de localStorage.

---

## 🐛 Troubleshooting

### Relatório não aparece
1. Verifique se localStorage não foi limpo
2. Tente `localStorage.getItem("relatorios")` no console
3. Recrie o relatório

### Link não funciona
1. Copie link corretamente (não adicione espaços)
2. Verifique ID: deve começar com `rel_`
3. Confira se relatório existe: `localStorage.getItem("relatorios")`

### Teste não aparece na homepage
1. Verifique se foi criado: Dashboard → Tab Testes
2. Campo "active" deve ser `true`
3. Recarregue a página

### Dados aleatórios não aparecem após "Teste Analítico"
1. Verifique se localStorage não está cheio
2. Limite localStorage: 5-10MB (varia por navegador)
3. Limpe dados antigos se necessário

---

## 📱 Responsividade

- ✅ Mobile: 320px - 640px
- ✅ Tablet: 640px - 1024px
- ✅ Desktop: 1024px+
- ✅ Touch-friendly (assinatura com dedo funciona)

---

## 🔐 Segurança

- **Aluno**: Sem Login (link = token)
- **Professor**: Senha fixa hardcoded (usar variável ambiente em produção)
- **localStorage**: Visível no navegador (não guardar dados sensíveis)

---

## 📊 Estatísticas do Build

```
✓ Modules: 2485
✓ CSS: 84.67 kB (gzip: 18.65 kB)
✓ JS: 860.55 kB (gzip: 241.53 kB)
✓ Build time: 9.37s
✓ Status: ✅ SUCCESS
```

---

## 📞 Suporte

Arquivo de documentação completa: `IMPLEMENTACAO_COMPLETA.md`

---

**Última atualização**: 30 de Março de 2026  
**Versão**: 1.0 - Pronto para Produção ✅

