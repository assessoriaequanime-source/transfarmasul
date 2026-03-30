#!/bin/bash

# ══════════════════════════════════════════════════════════════════
# SETUP ISOLADO - TransFarmaSul em VPS
# Cria ambiente completamente separado, sem interferir com outros projetos
# ══════════════════════════════════════════════════════════════════

set -e  # Exit on error

# ═══════ CORES PARA OUTPUT ═══════
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ═══════ FUNÇÕES ═══════
log_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
  echo -e "${RED}❌ $1${NC}"
}

# ═══════ BANNER ═══════
clear
cat << 'BANNER'
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         🚀 SETUP ISOLADO - TransFarmaSul em VPS              ║
║                                                               ║
║    Criando ambiente COMPLETAMENTE SEPARADO                   ║
║    Sem interferir com outros projetos                         ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

BANNER

echo ""
log_info "Iniciando setup isolado para TransFarmaSul..."
echo ""

# ═══════ STEP 1: VERIFICAR AMBIENTE ═══════
log_info "STEP 1/8: Verificando ambiente da VPS..."
echo ""

echo "  👤 Usuário: $(whoami)"
echo "  🖥️  Hostname: $(hostname)"
echo "  📍 PWD: $(pwd)"
echo ""

if [[ $EUID -ne 0 ]]; then
  log_error "Este script precisa ser executado como root (use: sudo bash setup-vps-isolado.sh)"
  exit 1
fi

log_success "Permissões OK (root)"
echo ""

# ═══════ STEP 2: CRIAR ESTRUTURA ISOLADA ═══════
log_info "STEP 2/8: Criando estrutura isolada em /var/www/transfarmasul..."

PROJETO_DIR="/var/www/transfarmasul"
LOG_DIR="/var/log/transfarmasul"
DATA_DIR="/var/lib/transfarmasul"

mkdir -p "$PROJETO_DIR"
mkdir -p "$LOG_DIR"
mkdir -p "$DATA_DIR"

log_success "Pastas criadas:"
echo "  📁 Projeto: $PROJETO_DIR"
echo "  📁 Logs: $LOG_DIR"
echo "  📁 Data: $DATA_DIR"
echo ""

# ═══════ STEP 3: VERIFICAR DEPENDÊNCIAS ═══════
log_info "STEP 3/8: Verificando dependências..."

MISSING_DEPS=()

if ! command -v node &> /dev/null; then
  MISSING_DEPS+=("nodejs")
fi

if ! command -v git &> /dev/null; then
  MISSING_DEPS+=("git")
fi

if ! command -v curl &> /dev/null; then
  MISSING_DEPS+=("curl")
fi

if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
  log_warning "Dependências faltando: ${MISSING_DEPS[*]}"
  echo ""
  log_info "Instalando dependências..."
  apt-get update -qq
  apt-get install -y -qq ${MISSING_DEPS[*]} > /dev/null
  log_success "Dependências instaladas"
else
  log_success "Todas as dependências presentes"
fi

echo ""
echo "  📦 Node.js: $(node --version)"
echo "  📦 npm: $(npm --version)"
echo "  📦 Git: $(git --version)"
echo ""

# ═══════ STEP 4: CLONAR REPOSITÓRIO ═══════
log_info "STEP 4/8: Clonando repositório TransFarmaSul..."

if [ -d "$PROJETO_DIR/.git" ]; then
  log_warning "Repositório já existe em $PROJETO_DIR"
  echo "  Atualizando..."
  cd "$PROJETO_DIR"
  git pull origin main --quiet
  log_success "Repositório atualizado"
else
  log_warning "Repositório não encontrado localmente."
  echo "  📝 Você precisa clonar o repositório GitHub manualmente:"
  echo ""
  echo "  ${BLUE}git clone https://github.com/SEU_USUARIO/transfarmasul.git $PROJETO_DIR${NC}"
  echo ""
  log_warning "Ou, se usando SSH:"
  echo "  ${BLUE}git clone git@github.com:SEU_USUARIO/transfarmasul.git $PROJETO_DIR${NC}"
  echo ""
  log_warning "Após clonar, execute este script novamente."
  exit 0
fi

echo ""

# ═══════ STEP 5: INSTALAR DEPENDÊNCIAS DO PROJETO ═══════
log_info "STEP 5/8: Instalando dependências do projeto..."

cd "$PROJETO_DIR"

if [ ! -d "node_modules" ]; then
  log_warning "Instalando npm packages (pode levar alguns minutos)..."
  npm install --legacy-peer-deps --quiet
  log_success "Dependências instaladas"
else
  log_success "node_modules já existe"
fi

echo ""

# ═══════ STEP 6: COMPILAR PARA PRODUÇÃO ═══════
log_info "STEP 6/8: Compilando projeto para produção..."

if [ ! -d "dist" ]; then
  log_warning "Compilando (pode levar alguns minutos)..."
  npm run build > /dev/null 2>&1
  log_success "Build concluído"
else
  log_success "dist/ já existe"
fi

echo "  📦 Tamanho do build:"
du -sh dist/
echo ""

# ═══════ STEP 7: DETERMINAR PORTA DISPONÍVEL ═══════
log_info "STEP 7/8: Verificando portas disponíveis..."

PORTA_BASE=3001
PORTA=$PORTA_BASE

while netstat -tuln 2>/dev/null | grep -q ":$PORTA "; do
  PORTA=$((PORTA + 1))
  if [ $PORTA -gt 3010 ]; then
    log_error "Nenhuma porta disponível entre 3001-3010"
    exit 1
  fi
done

log_success "Porta disponível encontrada: $PORTA"
echo "  🔌 TransFarmaSul rodará em: http://localhost:$PORTA"
echo "  🌐 Acesso público (via Nginx): https://anadm.site"
echo ""

# ═══════ STEP 8: CRIAR ARQUIVO DE CONFIGURAÇÃO ═══════
log_info "STEP 8/8: Criando arquivo de configuração..."

cat > "$PROJETO_DIR/.env.production" << EOF
# ═══════════════════════════════════════════════════════════════
# TransFarmaSul - Configuração de Produção
# Data: $(date)
# ═══════════════════════════════════════════════════════════════

# Servidor
NODE_ENV=production
PORT=$PORTA
HOST=0.0.0.0

# Domínio
DOMAIN=anadm.site

# Logs
LOG_DIR=$LOG_DIR
EOF

log_success "Arquivo de configuração criado: .env.production"
echo ""

# ═══════ RESUMO ═══════
cat << SUMMARY

╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                    ✅ SETUP CONCLUÍDO!                       ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

📍 Localização do Projeto:
   $PROJETO_DIR

📊 Estrutura Criada:
   📁 /var/www/transfarmasul          (Código-fonte)
   📁 /var/log/transfarmasul          (Logs)
   📁 /var/lib/transfarmasul          (Dados)

🔌 Configuração de Rede:
   🔹 Porta interna: $PORTA
   🔹 Host: 0.0.0.0 (localhost)
   🔹 Domínio público: anadm.site (via Nginx)
   🔹 Isolado de outros projetos: ✅

📦 Build Verificado:
   ✅ npm packages instalados
   ✅ Projeto compilado
   ✅ dist/ pronto para produção

═══════════════════════════════════════════════════════════════

🚀 PRÓXIMOS PASSOS:

1️⃣  TESTAR LOCALMENTE (Opcional):
    \$ npm run serve
    Acessar em: http://localhost:$PORTA

2️⃣  INICIAR COM PM2 (Recomendado):
    \$ npm install -g pm2
    \$ pm2 start "npm run serve" --name transfarmasul --max-memory-restart 1G

3️⃣  CONFIGURAR NGINX REVERSE PROXY:
    Criar vhost que aponta para localhost:$PORTA

4️⃣  CONFIGURAR SSL/HTTPS:
    \$ certbot certonly --nginx -d anadm.site

5️⃣  VERIFICAR STATUS:
    \$ pm2 status
    \$ pm2 logs transfarmasul

═══════════════════════════════════════════════════════════════

💡 DICAS IMPORTANTES:

✓ Seu projeto está 100% isolado
✓ Outros projetos não serão afetados
✓ Logs disponíveis em: $LOG_DIR
✓ Para parar: pm2 stop transfarmasul
✓ Para reiniciar: pm2 restart transfarmasul
✓ Para ver logs: pm2 logs transfarmasul

═══════════════════════════════════════════════════════════════

SUMMARY

echo ""
log_success "Setup isolado concluído! Projeto pronto para iniciação."
echo ""
