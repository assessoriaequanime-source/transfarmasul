#!/bin/bash

# TransFarmaSul - Setup na VPS
# Cole este script inteiro no terminal da VPS (como root)

set -e

PROJETO_DIR="/var/www/transfarmasul"
LOG_DIR="/var/log/transfarmasul"
DATA_DIR="/var/lib/transfarmasul"
REPO_URL="https://github.com/assessoriaequanime-source/transfarmasul.git"
PORTA=3001

echo "🚀 TransFarmaSul - Setup na VPS"
echo ""

# 1. Criar pastas
echo "[1/7] Criando pastas..."
mkdir -p "$PROJETO_DIR" "$LOG_DIR" "$DATA_DIR"
echo "✅ Pastas criadas"
echo ""

# 2. Atualizar sistema
echo "[2/7] Atualizando sistema..."
apt-get update -qq && apt-get upgrade -y -qq > /dev/null 2>&1
apt-get install -y -qq curl git wget ca-certificates htop net-tools nginx certbot python3-certbot-nginx > /dev/null 2>&1
echo "✅ Sistema atualizado"
echo ""

# 3. Node.js
echo "[3/7] Verificando Node.js..."
if ! command -v node &> /dev/null; then
  echo "   Instalando Node.js v18..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash - > /dev/null 2>&1
  apt-get install -y -qq nodejs > /dev/null 2>&1
fi
echo "✅ Node.js: $(node --version)"
echo ""

# 4. Clonar repositório
echo "[4/7] Clonando repositório..."
if [ ! -d "$PROJETO_DIR/.git" ]; then
  git clone "$REPO_URL" "$PROJETO_DIR" > /dev/null 2>&1
  echo "✅ Repositório clonado"
else
  cd "$PROJETO_DIR" && git pull origin main > /dev/null 2>&1
  echo "✅ Repositório atualizado"
fi
echo ""

# 5. npm install
echo "[5/7] Instalando npm packages..."
cd "$PROJETO_DIR"
npm install --legacy-peer-deps --quiet 2>/dev/null
echo "✅ Pacotes instalados"
echo ""

# 6. Build
echo "[6/7] Compilando para produção..."
npm run build > /dev/null 2>&1
echo "✅ Build concluído ($(du -sh dist 2>/dev/null | cut -f1))"
echo ""

# 7. Config
echo "[7/7] Configurando..."
while netstat -tuln 2>/dev/null | grep -q ":$PORTA " || ss -tuln 2>/dev/null | grep -q ":$PORTA "; do
  PORTA=$((PORTA + 1))
done

cat > "$PROJETO_DIR/.env.production" << EOF
NODE_ENV=production
PORT=$PORTA
HOST=0.0.0.0
DOMAIN=anadm.site
EOF

echo "✅ Configuração pronta"
echo ""

echo "════════════════════════════════════════════════════════════"
echo "✅ SETUP CONCLUÍDO!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📍 Localização: $PROJETO_DIR"
echo "📍 Domínio: anadm.site"
echo "📍 Porta interna: $PORTA"
echo ""
echo "🚀 PRÓXIMO PASSO: Iniciar a aplicação"
echo ""
echo "Escolha uma opção:"
echo ""
echo "[OPÇÃO 1] - Teste rápido (Ctrl+C para parar):"
echo "  cd $PROJETO_DIR"
echo "  PORT=$PORTA npm run serve"
echo ""
echo "[OPÇÃO 2] - Rodar em background:"
echo "  cd $PROJETO_DIR"
echo "  nohup npm run serve > $LOG_DIR/app.log 2>&1 &"
echo "  echo \$! > $LOG_DIR/app.pid"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
