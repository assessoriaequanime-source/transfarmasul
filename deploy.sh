#!/bin/bash
# Deploy automatizado TransFarmaSul para VPS
# Uso: ./deploy.sh seu_usuario seu_ip seu_dominio

set -e

# Cores para output
RED=\\033[0;31m
GREEN=\\033[0;32m
YELLOW=\\033[1;33m
BLUE=\\033[0;34m
NC=\\033[0m

# Validar argumentos
if [ $# -lt 3 ]; then
    echo -e \"${RED}Uso: $0 seu_usuario seu_ip seu_dominio${NC}\"
    echo \"Exemplo: $0 ubuntu 192.168.1.100 transfarmasul.com\"
    exit 1
fi

USUARIO=$1
IP=$2
DOMINIO=$3
HOST=\"${USUARIO}@${IP}\"

echo -e \"${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\"
echo -e \"${BLUE}  TransFarmaSul - Deploy Automatizado${NC}\"
echo -e \"${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\"
echo \"\"
echo -e \"${YELLOW}Configuração:${NC}\"
echo \"  Usuário: $USUARIO\"
echo \"  IP/Host: $IP\"
echo \"  Domínio: $DOMINIO\"
echo \"\"

# Step 1: Build local
echo -e \"${YELLOW}[1/5]${NC} Compilando aplicação localmente...\"
npm install --legacy-peer-deps > /dev/null 2>&1
npm run build > /dev/null 2>&1
echo -e \"${GREEN}✓ Build completo${NC}\"

# Step 2: Upload para VPS
echo -e \"${YELLOW}[2/5]${NC} Enviando arquivos para VPS...\"
rsync -avz --delete dist/ \"${HOST}:/tmp/transfarmasul-dist/\" > /dev/null 2>&1 || {
    echo -e \"${RED}✗ Erro ao enviar arquivos${NC}\"
    exit 1
}
echo -e \"${GREEN}✓ Arquivos enviados${NC}\"

# Step 3: Verificar estrutura no servidor
echo -e \"${YELLOW}[3/5]${NC} Verificando estrutura no servidor...\"
ssh \"$HOST\" \"
    mkdir -p ~/apps/transfarmasul/dist
\" > /dev/null 2>&1 || {
    echo -e \"${RED}✗ Erro ao criar diretórios${NC}\"
    exit 1
}
echo -e \"${GREEN}✓ Estrutura verificada${NC}\"

# Step 4: Deploy dos arquivos
echo -e \"${YELLOW}[4/5]${NC} Deploying arquivos do build...\"
ssh \"$HOST\" \"
    rm -rf ~/apps/transfarmasul/dist-old || true
    [ -d ~/apps/transfarmasul/dist ] && mv ~/apps/transfarmasul/dist ~/apps/transfarmasul/dist-old || true
    cp -r /tmp/transfarmasul-dist ~/apps/transfarmasul/dist
    rm -rf /tmp/transfarmasul-dist
\" > /dev/null 2>&1 || {
    echo -e \"${RED}✗ Erro ao fazer deploy${NC}\"
    exit 1
}
echo -e \"${GREEN}✓ Arquivos deploidos${NC}\"

# Step 5: Reiniciar Nginx
echo -e \"${YELLOW}[5/5]${NC} Reiniciando servidor web...\"
ssh \"$HOST\" \"
    sudo systemctl reload nginx 2>/dev/null || true
\" > /dev/null 2>&1
echo -e \"${GREEN}✓ Servidor reiniciado${NC}\"

# Success
echo \"\"
echo -e \"${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\"
echo -e \"${GREEN}  ✓ Deploy Completado com Sucesso!${NC}\"
echo -e \"${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\"
echo \"\"
echo -e \"${BLUE}Acesse:${NC} https://${DOMINIO}\"
echo \"\"
echo -e \"${YELLOW}Dicas:${NC}\"
echo \"  • Ver logs: ssh $HOST 'sudo tail -50 /var/log/nginx/error.log'\"
echo \"  • Status Nginx: ssh $HOST 'sudo systemctl status nginx'\"
echo \"  • Rollback: ssh $HOST 'mv ~/apps/transfarmasul/dist-old ~/apps/transfarmasul/dist'\"
echo \"\"
