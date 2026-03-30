# ✅ PRE-DEPLOYMENT CHECKLIST

> Use este checklist antes de fazer deploy da aplicação em VPS

---

## 📋 ANTES DE COMEÇAR

- [ ] Repositório Git atualizado
- [ ] Todos os arquivos commitados
- [ ] Branch principal está sincronizada com remoto
- [ ] Acesso SSH à VPS configurado

---

## 🔧 CONFIGURAÇÃO LOCAL

### Dependências
```bash
npm install --legacy-peer-deps
```
- [ ] Comando executado sem erros
- [ ] `node_modules/` criado
- [ ] `package-lock.json` atualizado

### Build
```bash
npm run build
```
- [ ] Build completo sem erros
- [ ] Pasta `dist/` criada com conteúdo
- [ ] Tamanho JS reasonable (< 1MB)
- [ ] Tamanho CSS reasonable (< 100KB)

### Testes (Opcional)
```bash
npm run test
```
- [ ] Todos os testes passando
- [ ] Nenhum erro de TypeScript

### Desenvolvimento Local
```bash
npm run dev
```
- [ ] Servidor levanta em localhost:5173
- [ ] Dashboard acessível
- [ ] Componentes renderizam
- [ ] Sem erros no console

---

## 🧹 LIMPEZA CONFIRMADA

### Lovable Removido
```bash
grep -r "lovable\|Lovable\|LOVABLE" src/
```
- [ ] 0 resultados (nenhuma menção no código)

### Dependências Limpas
```bash
grep "lovable" package.json
```
- [ ] 0 resultados

### Arquivos Atualizados
- [ ] `README.md` - Sem menção Lovable ✓
- [ ] `package.json` - lovable-tagger removido ✓
- [ ] `vite.config.ts` - componentTagger removido ✓
- [ ] `playwright.config.ts` - Lovable imports removidos ✓
- [ ] `index.html` - Meta tags atualizadas ✓
- [ ] `playwright-fixture.ts` - @playwright/test usado ✓

---

## 📚 DOCUMENTAÇÃO PRESENTE

- [ ] `DEPLOY_VPS.md` - Arquivo existe
- [ ] `deploy.sh` - Script existe e é executável
- [ ] `IMPLEMENTACAO_COMPLETA.md` - Detalhes técnicos
- [ ] `GUIA_RAPIDO.md` - Referência rápida
- [ ] `README.md` - Documentação principal

---

## 🔐 PREPARAÇÃO SSH

### Gerar Chaves (se necessário)
```bash
ssh-keygen -t ed25519 -C "seu_email@example.com"
```
- [ ] Chave privada salva em ~/.ssh/
- [ ] Chave pública pronta para copiar

### Teste de Conexão
```bash
ssh usuario@seu_ip -i ~/.ssh/id_ed25519
```
- [ ] Conexão bem-sucedida
- [ ] Acesso à VPS confirmado

---

## 🖥️ VPS SETUP (Antes do Deploy)

### Acesso
- [ ] SSH chave privada funciona
- [ ] Usuário tem permissão sudo
- [ ] Internet funcionando na VPS

### Dependências do Sistema
```bash
# Na VPS:
sudo apt update && sudo apt upgrade
sudo apt install nodejs npm curl git
```
- [ ] Node.js 18+
- [ ] npm 9+
- [ ] Git instalado
- [ ] Curl instalado

### Diretórios
```bash
# Na VPS:
mkdir -p /var/www/transfarmasul
mkdir -p /var/log/transfarmasul
```
- [ ] Diretórios criados
- [ ] Permissões configuradas

---

## 🚀 DEPLOY OPTIONS

### Opção 1: Script Automático ⭐ (Recomendado)

```bash
chmod +x deploy.sh
./deploy.sh seu_usuario seu_ip seu_dominio.com
```

Checklist:
- [ ] Script é executável (`chmod +x`)
- [ ] Tem 3 parâmetros (user, IP, domain)
- [ ] Seguiu as instruções do script

**Após executar, verificar:**
- [ ] Repositório clonado em VPS
- [ ] npm install rodou
- [ ] npm run build rodou
- [ ] Aplicação está rodando em :3000

### Opção 2: Deploy Manual

Seguir `DEPLOY_VPS.md` passo a passo:

1. **Preparar VPS**
   - [ ] Node.js instalado
   - [ ] Git configurado
   - [ ] Usuário criado (opcional)

2. **Clonar Repositório**
   ```bash
   cd /var/www
   git clone git@github.com:seu_usuario/transfarmasul.git
   cd transfarmasul
   ```
   - [ ] Repositório clonado
   - [ ] Arquivos presentes

3. **Instalar Dependências**
   ```bash
   npm install --legacy-peer-deps
   ```
   - [ ] Sem erros
   - [ ] node_modules criado

4. **Build**
   ```bash
   npm run build
   ```
   - [ ] Pasta dist/ criada
   - [ ] Sem erros

5. **Process Manager** (escolher um)
   - [ ] PM2: `npm install -g pm2` e `pm2 start "npm run serve" --name transfarmasul`
   - [ ] Systemd: criar `/etc/systemd/system/transfarmasul.service`

6. **Nginx**
   - [ ] Vhost criado em `/etc/nginx/sites-available/transfarmasul`
   - [ ] Soft link em `/etc/nginx/sites-enabled/`
   - [ ] Config aponta para localhost:3000
   - [ ] Testado: `sudo nginx -t`
   - [ ] Reiniciado: `sudo systemctl restart nginx`

7. **SSL/HTTPS**
   - [ ] Certbot instalado: `sudo apt install certbot python3-certbot-nginx`
   - [ ] Certificado gerado: `sudo certbot certonly --nginx -d seu_dominio.com`
   - [ ] Nginx atualizado com SSL
   - [ ] Redirect HTTP → HTTPS
   - [ ] Auto-renewal configurado

8. **Verificação Final**
   - [ ] HTTPS funcionando
   - [ ] Dashboard acessível em https://seu_dominio.com
   - [ ] Sem erros de console
   - [ ] localStorage funcionando
   - [ ] Relatórios funcionando

---

## ⚙️ CONFIGURAÇÕES CRÍTICAS

### vite.config.ts
```typescript
server: {
  host: '0.0.0.0',  // ✅ Para VPS
  port: 5173,       // ✅ Padrão Vite
}
```
- [ ] Host é `0.0.0.0` (não `::`)
- [ ] Port é 5173 (ou escolhido explicitamente)

### package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview"  // ← Para produção
  }
}
```
- [ ] Scripts presentes
- [ ] Serve script disponível

### Variáveis de Ambiente (se houver)
```bash
# Criar .env.production se necessário
```
- [ ] `.env` configurado (se precisar)
- [ ] `.env.production` criado na VPS (se precisar)

---

## 🧪 TESTES PÓS-DEPLOY

### Homepage
- [ ] Página carrega sem erros
- [ ] Dashboard visível
- [ ] Cores corretas (vermelho/marrom)
- [ ] Responsivo (mobile/tablet/desktop)

### Funcionalidades Core
- [ ] Menu flutuante (🧰) funciona
- [ ] Teste Analítico gera dados
- [ ] Relatório Acadêmico abre modal
- [ ] Link privado do relatório acessível
- [ ] Dashboard Professor acessa com senha

### Persistência
- [ ] localStorage salva dados
- [ ] Dados persistem ao reload
- [ ] Relatórios salvos corretamente
- [ ] Testes salvos corretamente

### Performance
- [ ] Página carrega < 3s
- [ ] Gráficos renderizam suave
- [ ] Sem memory leaks na console
- [ ] CPU/RAM razoáveis

---

## 🛠️ TROUBLESHOOTING RÁPIDO

Se algo não funcionar:

**Problema**: Deploy script falha
```bash
chmod +x deploy.sh
./deploy.sh usuario ip dominio.com
# Se erro: verificar SSH, Git, Node.js na VPS
```

**Problema**: npm install muito lento
```bash
npm install --legacy-peer-deps --no-audit
```

**Problema**: Build muito grande (> 2MB)
```bash
npm run build -- --analyze  # Se houver
# Verificar se lovable-tagger não está em node_modules
```

**Problema**: Aplicação não carrega
```bash
# Na VPS:
ps aux | grep node          # Verificar se rodando
journalctl -u transfarmasul # Ver logs (se systemd)
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

**Problema**: HTTPS não funciona
```bash
# Na VPS:
sudo certbot renew --dry-run
sudo certbot certificates
```

---

## 📞 SUPORTE RÁPIDO

### Documentação
- `DEPLOY_VPS.md` - Guia detalhado (8 passos)
- `GUIA_RAPIDO.md` - FAQ express
- `IMPLEMENTACAO_COMPLETA.md` - Detalhes técnicos
- `deploy.sh` - Script comentado

### Contato
> Adicionar informações de contato/suporte aqui

---

## ✅ DEPLOY CONCLUÍDO?

Se todos os checkboxes acima estão marcados ✅:

```
🎉 PARABÉNS! 🎉

Aplicação está pronta para produção!

Próximas ações:
1. Monitorar logs: tail -f /var/log/nginx/access.log
2. Configurar backups: cron job para git pull
3. Documentar SOP (Procedimento Operacional Padrão)
4. Comunicar ao time: aplicação live!
```

---

**Data**: 30 de Março de 2026  
**Ambiente**: VPS com Ubuntu 20.04+  
**Status**: Ready to Deploy ✅

