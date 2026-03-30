#!/bin/bash
# Cole este script inteiro no terminal da VPS (após se conectar com SSH)
# A senha já foi usada, então você já está dentro!

set -e

PROJETO_DIR="/var/www/transfarmasul"
LOG_DIR="/var/log/transfarmasul"  
DATA_DIR="/var/lib/transfarmasul"
REPO_URL="https://github.com/assessoriaequanime-source/transfarmasul.git"
PORTA=3001

clear

cat << 'BANNER'
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║    🚀 DEPLOY - TransFarmaSul na VPS                          ║
║    anadm.site (72.60.147.56)                                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

BANNER

echo ""

echo "[1/7] 📁 Criando pastas..."
mkdir -p "$PROJETO_DIR" "$LOG_DIR" "$DATA_DIR"
echo "✅ Pastas criadas"
echo ""

echo "[2/7] 🔄 Atualizando sistema..."
apt-get update -qq > /dev/null 2>&1
apt-get upgrade -y -qq > /dev/null 2>&1 || true
apt-get install -y -qq curl git wget nginx certbot python3-certbot-nginx > /dev/null 2>&1 || true
echo "✅ Sistema OK"
echo ""

echo "[3/7] 📦 Node.js..."
if ! command -v node &> /dev/null; then
  echo "   Instalando Node.js v18..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash - > /dev/null 2>&1
  apt-get install -y nodejs > /dev/null 2>&1
fi
NODE_VER=$(node --version)
echo "✅ Node.js $NODE_VER"
echo ""

echo "[4/7] 📥 Repositório..."
if [ ! -d "$PROJETO_DIR/.git" ]; then
  git clone "$REPO_URL" "$PROJETO_DIR" > /dev/null 2>&1
  echo "✅ Repositório clonado"
else
  cd "$PROJETO_DIR"
  git pull origin main > /dev/null 2>&1 || true
  echo "✅ Repositório atualizado"
fi
echo ""

echo "[5/7] 📦 npm install..."
cd "$PROJETO_DIR"
npm install --legacy-peer-deps --quiet 2>/dev/null || npm install --legacy-peer-deps
echo "✅ Dependências instaladas"
echo ""

echo "[6/7] 🔨 Compilando..."
npm run build > /dev/null 2>&1
BUILD_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
echo "✅ Build OK ($BUILD_SIZE)"
echo ""

echo "[7/7] ⚙️  Configuração..."

# Encontrar porta disponível
while netstat -tuln 2>/dev/null | grep -q ":$PORTA " || ss -tuln 2>/dev/null | grep -q ":$PORTA "; do
  PORTA=$((PORTA + 1))
  if [ $PORTA -gt 3050 ]; then
    echo "❌ Nenhuma porta disponível"
    exit 1
  fi
done

cat > "$PROJETO_DIR/.env.production" << ENV
NODE_ENV=production
PORT=$PORTA
HOST=0.0.0.0
DOMAIN=anadm.site
ENV

echo "✅ Config salva"
echo ""

# Resumo
clear

cat << RESUMO

╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              ✅ DEPLOY CONCLUÍDO COM SUCESSO!                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

📍 INFORMAÇÕES
  • Local: $PROJETO_DIR
  • Domínio: anadm.site
  • IP: 72.60.147.56
  • Porta interna: $PORTA
  • Ambiente: produção

📊 SISTEMA PREPARADO
  ✅ Ubuntu 22.04.5 LTS
  ✅ Node.js v18
  ✅ Nginx instalado
  ✅ Certbot para SSL
  ✅ Git configurado

═══════════════════════════════════════════════════════════════

🚀 INICIAR A APLICAÇÃO AGORA:

Opção 1️⃣  - TESTE RÁPIDO (Ctrl+C para parar):
───────────────────────────────────────────
  cd $PROJETO_DIR
  PORT=$PORTA npm run serve

  Testa em: http://localhost:$PORTA


Opção 2️⃣  - BACKGROUND (Recomendado):
───────────────────────────────────────────
  cd $PROJETO_DIR
  nohup PORT=$PORTA npm run serve > $LOG_DIR/app.log 2>&1 &
  echo \$! > $LOG_DIR/app.pid
  
  Monitor:
    tail -f $LOG_DIR/app.log
    ps aux | grep "npm run serve"


Opção 3️⃣  - PM2 (Produção - melhor):
───────────────────────────────────────────
  npm install -g pm2 2>/dev/null || sudo npm install -g pm2
  cd $PROJETO_DIR
  pm2 start "npm run serve" --name transfarmasul --max-memory-restart 1G
  pm2 save
  pm2 startup
  
  Comandos:
    pm2 status
    pm2 logs transfarmasul
    pm2 restart transfarmasul
    pm2 stop transfarmasul

═══════════════════════════════════════════════════════════════

⚙️  PROXIMA ETAPA: Nginx Reverse Proxy

Execute EXATAMENTE ISSO:

cat > /etc/nginx/sites-available/transfarmasul << 'NGINX'
server {
    listen 80;
    server_name anadm.site;

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

    # limite de upload
    client_max_body_size 100M;
}
NGINX

ln -s /etc/nginx/sites-available/transfarmasul /etc/nginx/sites-enabled/ 2>/dev/null || true
nginx -t
systemctl restart nginx

═══════════════════════════════════════════════════════════════

🔒 SSL/HTTPS COM LET'S ENCRYPT:

Depois que Nginx estiver funcionando:

  certbot certonly --nginx -d anadm.site

Isso gera certificados em:
  /etc/letsencrypt/live/anadm.site/

═══════════════════════════════════════════════════════════════

📞 COMANDOS ÚTEIS:

Ver processos Node:       ps aux | grep npm
Ver porta $PORTA:         netstat -tlnp | grep $PORTA
Ver logs Nginx:           tail -f /var/log/nginx/access.log
Reiniciar Nginx:          systemctl restart nginx
Testar Nginx:             nginx -t
Ver aplicação:            curl http://localhost:$PORTA
Check SSL:                curl https://anadm.site

═══════════════════════════════════════════════════════════════

🎉 Tudo pronto! Escolha uma opção acima para iniciar.

RESUMO

echo ""

RESUMO_CLI

echo "O deploy foi concluído! ✅"
echo ""
echo "Próximo passo: Escolha como quer iniciar (Opção 1, 2 ou 3)"
echo ""
