# 🚀 Guia de Deploy em VPS - TransFarmaSul

## 📋 Pré-requisitos

- VPS com Linux (Ubuntu/Debian recomendado)
- Node.js 18+ instalado
- npm ou yarn disponível
- Git instalado
- Acesso SSH configurado

---

## 🔐 Passo 1: Gerar Chaves SSH (se ainda não tiver)

### No seu computador local:

```bash
# Gerar par de chaves SSH
ssh-keygen -t ed25519 -C "seu_email@example.com"

# Pressione Enter para aceitar o caminho padrão:
# Linux/macOS: ~/.ssh/id_ed25519
# Windows: C:\Users\seu_usuario\.ssh\id_ed25519

# Defina uma senha (recomendado) e confirme
```

### Ver sua chave pública:

```bash
# Linux/macOS
cat ~/.ssh/id_ed25519.pub

# Windows PowerShell
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub

# Copie todo o conteúdo (começa com "ssh-ed25519")
```

---

## 📤 Passo 2: Adicionar Chave SSH na VPS

### Conectar à VPS pela primeira vez (com senha):

```bash
ssh usuario@seu_ip_vps
# Digite a senha quando solicitado
```

### No servidor VPS, adicionar sua chave pública:

```bash
# Criar diretório .ssh (se não existir)
mkdir -p ~/.ssh

# Abrir editor para adicionar sua chave pública
nano ~/.ssh/authorized_keys

# Cola a chave pública aqui (Ctrl+O, Enter, Ctrl+X para salvar)
# A chave deve estar em uma única linha

# Definir permissões corretas
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### Configurar SSH sem senha:

```bash
# No seu computador local, editar arquivo de config
nano ~/.ssh/config

# Adicionar (ou criar se não existir):
Host transfarmasul
    HostName seu_ip_vps
    User seu_usuario
    IdentityFile ~/.ssh/id_ed25519
    Port 22
```

### Agora conectar sem senha:

```bash
ssh transfarmasul
# Não deve pedir senha!
```

---

## 🛠️ Passo 3: Preparar Servidor VPS

### Atualizar o sistema:

```bash
sudo apt update && sudo apt upgrade -y
```

### Instalar Node.js (versão LTS):

```bash
# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalação
node --version
npm --version
```

### Instalar Git:

```bash
sudo apt install -y git
```

### Criar diretório do projeto:

```bash
mkdir -p ~/apps/transfarmasul
cd ~/apps/transfarmasul
```

---

## 📥 Passo 4: Clonar Repositório

### Opção A: Se tem repositório GitHub público:

```bash
cd ~/apps/transfarmasul
git clone https://github.com/seu_usuario/transfarmasul.git .
```

### Opção B: Se tem repositório privado:

```bash
# Gerar chave SSH para o servidor
ssh-keygen -t ed25519 -C "deploy@seu_vps" -f ~/.ssh/id_github -N ""

# Adicionar a chave pública ao GitHub:
# - GitHub Settings → SSH and GPG keys → New SSH key
# - Copiar conteúdo de ~/.ssh/id_github.pub

# Clonar usando SSH
git clone git@github.com:seu_usuario/transfarmasul.git ~/apps/transfarmasul
```

### Opção C: Upload manual da pasta:

```bash
# No seu computador local
scp -r /caminho/local/transfarmasul transfarmasul:/home/usuario/apps/
```

---

## 🔧 Passo 5: Instalar Dependências

```bash
cd ~/apps/transfarmasul

# Instalar dependências
npm install --legacy-peer-deps

# Build para produção
npm run build
```

---

## 🌐 Passo 6: Configurar Servidor Web (Nginx)

### Instalar Nginx:

```bash
sudo apt install -y nginx
```

### Criar arquivo de configuração:

```bash
sudo nano /etc/nginx/sites-available/transfarmasul
```

### Copiar e colar:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name seu_dominio.com www.seu_dominio.com;

    # Redirecionar HTTP para HTTPS (após certificado SSL)
    # return 301 https://$server_name$request_uri;

    root /home/seu_usuario/apps/transfarmasul/dist;
    index index.html;

    # Cache estático
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA - redireciona tudo para index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Bloquear acesso a arquivos sensíveis
    location ~ /\. {
        deny all;
    }
}
```

### Ativar site:

```bash
sudo ln -s /etc/nginx/sites-available/transfarmasul /etc/nginx/sites-enabled/

# Desabilitar default se necessário:
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

---

## 🔒 Passo 7: SSL/HTTPS com Let's Encrypt (Opcional mas Recomendado)

### Instalar Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Obter certificado:

```bash
sudo certbot --nginx -d seu_dominio.com -d www.seu_dominio.com
# Siga as instruções (fornecimento seu email, aceitar termos, etc)
```

### Atualizar configuração Nginx:

```bash
sudo nano /etc/nginx/sites-available/transfarmasul
```

Descomente a linha de redirecionamento HTTPS:

```nginx
return 301 https://$server_name$request_uri;
```

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Renovação automática:

```bash
# Certbot já configura renovação automática
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## 📊 Passo 8: Monitorar & Manutenção

### Iniciar/parar serviços:

```bash
# Nginx
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl status nginx

# Ver logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Atualizar aplicação:

```bash
cd ~/apps/transfarmasul
git pull origin main
npm install --legacy-peer-deps
npm run build

# Nginx serve automaticamente a pasta dist/
```

### Backup automático:

```bash
# Criar script de backup
nano ~/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backups/transfarmasul"
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).tar.gz \
  ~/apps/transfarmasul

# Manter apenas últimos 7 backups
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
```

```bash
chmod +x ~/backup.sh

# Agendar diário (crontab)
crontab -e
# Adicionar: 0 2 * * * ~/backup.sh
```

---

## 🚀 Checklist Final

- [ ] SSH configurado sem senha
- [ ] Node.js 18+ instalado
- [ ] Repositório clonado
- [ ] Dependências instaladas
- [ ] Build executado com sucesso (`dist/` criada)
- [ ] Nginx configurado
- [ ] Site acessível em `seu_dominio.com`
- [ ] SSL/HTTPS ativado
- [ ] Logs verificados (sem erros)

---

## 🆘 Troubleshooting

### Erro: "Permission denied (publickey)"
```bash
# Verificar chave SSH no servidor
ssh-keygen -y -f ~/.ssh/authorized_keys
# Ou reconectar com senha
ssh -i /caminho/chave usuario@vps
```

### Erro: "port 80 already in use"
```bash
sudo lsof -i :80
sudo kill -9 <PID>
```

### Site mostra erro 502 Bad Gateway
```bash
# Verificar Nginx
sudo nginx -t
sudo systemctl restart nginx

# Verificar logs
sudo tail -50 /var/log/nginx/error.log
```

### Atualização automática do Git

```bash
# Criar webhook automático
nano ~/deploy.sh
```

```bash
#!/bin/bash
cd ~/apps/transfarmasul
git pull origin main
npm install --legacy-peer-deps
npm run build
sudo systemctl restart nginx
```

```bash
chmod +x ~/deploy.sh
```

---

## 📞 Contato & Suporte

Documentação completa: [IMPLEMENTACAO_COMPLETA.md](IMPLEMENTACAO_COMPLETA.md)

Referência rápida: [GUIA_RAPIDO.md](GUIA_RAPIDO.md)

---

**Última atualização**: 30 de Março de 2026

**Status**: ✅ Pronto para Deploy

