#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# TransFarmaSul - Setup Isolado na VPS
# 
# Como usar:
# 1. Copie TODO este script
# 2. Acesse sua VPS: ssh root@anadm.site
# 3. Cole o script no terminal
# 4. Pressione Enter e deixe executar
#
# ═══════════════════════════════════════════════════════════════════════

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

clear
cat << 'BANNER'
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║    🚀 TransFarmaSul - Deployment na VPS (anadm.site)        ║
║                                                               ║
║    Criando ambiente isolado e seguro                          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

BANNER

# ═══════════════════════════════════════════════════════════════
# VERIFICAR ROOT
# ═══════════════════════════════════════════════════════════════
if [[ $EUID -ne 0 ]]; then
   log_error "Execute como root: sudo bash ou ssh como root"
   exit 1
fi

log_info "✓ Executando como root"
echo ""

# ═══════════════════════════════════════════════════════════════
# CONFIGURAÇÕES
# ═══════════════════════════════════════════════════════════════
PROJETO_DIR="/var/www/transfarmasul"
LOG_DIR="/var/log/transfarmasul"
DATA_DIR="/var/lib/transfarmasul"
REPO_URL="https://github.com/assessoriaequanime-source/transfarmasul.git"

log_info "STEP 1/8: Criando estrutura de pastas..."
mkdir -p "$PROJETO_DIR"
mkdir -p "$LOG_DIR"
mkdir -p "$DATA_DIR"
chmod 755 "$PROJETO_DIR"
chmod 755 "$LOG_DIR"
chmod 755 "$DATA_DIR"

log_success "Pastas criadas"
echo "  📁 $PROJETO_DIR"
echo "  📁 $LOG_DIR"
echo "  📁 $DATA_DIR"
echo ""

# ═══════════════════════════════════════════════════════════════
# INSTALAR DEPENDÊNCIAS DO SISTEMA
# ═══════════════════════════════════════════════════════════════
log_info "STEP 2/8: Atualizando sistema e instalando dependências..."

apt-get update -qq || true
apt-get upgrade -y -qq || true
apt-get install -y -qq \
  curl \
  git \
  wget \
  ca-certificates \
  htop \
  net-tools \
  nginx \
  certbot \
  python3-certbot-nginx > /dev/null 2>&1

log_success "Sistema atualizado"
echo ""

# ═══════════════════════════════════════════════════════════════
# INSTALAR NODE.JS (se não tiver)
# ═══════════════════════════════════════════════════════════════
log_info "STEP 3/8: Verificando Node.js..."

if ! command -v node &> /dev/null; then
  log_warning "Node.js não encontrado, instalando v18..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash - > /dev/null 2>&1
  apt-get install -y -qq nodejs > /dev/null 2>&1
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)

log_success "Node.js pronto"
echo "  📦 Node.js: $NODE_VERSION"
echo "  📦 npm: $NPM_VERSION"
echo ""

# ═══════════════════════════════════════════════════════════════
# CLONAR REPOSITÓRIO
# ═══════════════════════════════════════════════════════════════
log_info "STEP 4/8: Clonando repositório GitHub..."

if [ -d "$PROJETO_DIR/.git" ]; then
  log_warning "Repositório já existe, atualizando..."
  cd "$PROJETO_DIR"
  git pull origin main --quiet 2>/dev/null || true
else
  git clone "$REPO_URL" "$PROJETO_DIR" --quiet
fi

log_success "Repositório pronto"
cd "$PROJETO_DIR"
echo "  📂 Localização: $PROJETO_DIR"
echo "  📌 Branch: $(git branch --show-current)"
echo ""

# ═══════════════════════════════════════════════════════════════
# INSTALAR DEPENDÊNCIAS NPM
# ═══════════════════════════════════════════════════════════════
log_info "STEP 5/8: Instalando pacotes npm (pode levar alguns minutos)..."

npm install --legacy-peer-deps --quiet 2>/dev/null

log_success "Pacotes npm instalados"
echo "  📦 Pasta: node_modules ($(du -sh node_modules 2>/dev/null | cut -f1))"
echo ""

# ═══════════════════════════════════════════════════════════════
# COMPILAR PARA PRODUÇÃO
# ═══════════════════════════════════════════════════════════════
log_info "STEP 6/8: Compilando para produção..."

npm run build > /dev/null 2>&1

log_success "Build concluído"
echo "  📦 Tamanho: $(du -sh dist 2>/dev/null | cut -f1)"
echo ""

# ═══════════════════════════════════════════════════════════════
# ENCONTRAR PORTA DISPONÍVEL
# ═══════════════════════════════════════════════════════════════
log_info "STEP 7/8: Definindo porta interna..."

PORTA=3001
while netstat -tuln 2>/dev/null | grep -q ":$PORTA " || ss -tuln 2>/dev/null | grep -q ":$PORTA "; do
  PORTA=$((PORTA + 1))
  if [ $PORTA -gt 3020 ]; then
    log_error "Nenhuma porta disponível entre 3001-3020"
    exit 1
  fi
done

log_success "Porta definida: $PORTA"
echo ""

# ═══════════════════════════════════════════════════════════════
# INICIAR COM PM2
# ═══════════════════════════════════════════════════════════════
log_info "STEP 8/8: Instalando/iniciando PM2..."

npm install -g pm2 > /dev/null 2>&1

# Parar qualquer instância anterior
pm2 delete transfarmasul 2>/dev/null || true

# Iniciar aplicação
cd "$PROJETO_DIR"
PORT=$PORTA npm run serve &
APP_PID=$!

sleep 3

# Verificar se iniciou
if ps -p $APP_PID > /dev/null; then
  log_success "Aplicação iniciada"
else
  log_warning "Iniciando em background..."
fi

echo ""

# ═══════════════════════════════════════════════════════════════
# RESUMO
# ═══════════════════════════════════════════════════════════════
cat << RESUMO

╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              ✅ SETUP CONCLUÍDO COM SUCESSO!                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

📍 PROJETO
  • Localização: $PROJETO_DIR
  • Domínio: anadm.site
  • Status: ISOLADO ✅

🔌 APLICAÇÃO EM USO
  • Porta interna: $PORTA
  • URL local: http://localhost:$PORTA
  • Acessível em: https://anadm.site (via Nginx)

📊 PASTAS CRIADAS
  • Código: $PROJETO_DIR
  • Logs: $LOG_DIR
  • Dados: $DATA_DIR

═══════════════════════════════════════════════════════════════

🚀 COMANDOS ÚTEIS:

Ver status:         ps aux | grep "npm run serve"
Ver logs:           tail -f $LOG_DIR/app.log
Parar app:          pkill -f "npm run serve"
Reiniciar app:      kill PID && npm run serve &
Porta em uso:       netstat -tlnp | grep $PORTA

═══════════════════════════════════════════════════════════════

⚙️  PRÓXIMO PASSO: Configurar Nginx (Reverse Proxy)

Criar arquivo de configuração Nginx:

sudo nano /etc/nginx/sites-available/transfarmasul

Cole o conteúdo:
─────────────────────────────────────────────────────────────

server {
    listen 80;
    server_name anadm.site;

    # Redirect HTTP para HTTPS (após terminar SSL)
    # return 301 https://\$server_name\$request_uri;

    location / {
        proxy_pass http://localhost:$PORTA;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}

─────────────────────────────────────────────────────────────

Depois, ativar e testar:

sudo ln -s /etc/nginx/sites-available/transfarmasul /etc/nginx/sites-enabled/ 2>/dev/null || true
sudo nginx -t
sudo systemctl restart nginx

═══════════════════════════════════════════════════════════════

🔒 PRÓXIMO PASSO: Configurar SSL/HTTPS

sudo certbot certonly --nginx -d anadm.site

E depois descomente a linha de redirect em:
/etc/nginx/sites-available/transfarmasul

═══════════════════════════════════════════════════════════════

📝 CHECKLIST:
  ☑ Dependências instaladas
  ☑ Repositório clonado
  ☑ npm packages instalados
  ☑ Projeto compilado
  ☑ Porta $PORTA definida
  ☑ Aplicação iniciada
  ⬜ Nginx configurado
  ⬜ SSL/HTTPS ativado
  ⬜ Domínio acessível

═══════════════════════════════════════════════════════════════

RESUMO

log_success "Setup finalizado! Aplicação está rodando na porta $PORTA"
echo ""
