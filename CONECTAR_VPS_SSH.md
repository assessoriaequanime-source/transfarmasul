# 🔗 Como Conectar Terminal VS Code à VPS

## Status Atual
- ✅ VPS acessível via SSH (anadm.site)
- ⏳ Porta 22 pode estar bloqueada temporariamente
- ✅ Você consegue acessar manualmente via terminal

---

## 📋 Opção 1: Conexão SSH Padrão (Recomendada)

### A. Primeiro Acesso - Gerar Chave SSH

No terminal do VS Code (Ctrl + `):

```bash
# Gerar chave Ed25519 (mais segura)
ssh-keygen -t ed25519 -C "seu_email@exemplo.com" -f ~/.ssh/anadm_key -N ""

# Ou gerar RSA (compatível)
ssh-keygen -t rsa -b 4096 -C "seu_email@exemplo.com" -f ~/.ssh/anadm_key -N ""
```

**Isso vai criar:**
- `~/.ssh/anadm_key` (chave privada - guarde bem!)
- `~/.ssh/anadm_key.pub` (chave pública)

### B. Copiar Chave Pública para VPS

```bash
# Ver a chave pública
cat ~/.ssh/anadm_key.pub

# Copiar e colar na VPS:
# 1. Acesse: ssh root@anadm.site
# 2. Execute na VPS:
mkdir -p ~/.ssh
echo "SUA_CHAVE_PUBLICA_AQUI" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### C. Configurar Cliente SSH (Opcional)

Criar arquivo `~/.ssh/config`:

```bash
cat > ~/.ssh/config << 'EOF'
Host anadm
    HostName anadm.site
    User root
    IdentityFile ~/.ssh/anadm_key
    Port 22
    StrictHostKeyChecking no

Host transfarmasul
    HostName anadm.site
    User root
    IdentityFile ~/.ssh/anadm_key
    Port 22
EOF
```

Depois:
```bash
chmod 600 ~/.ssh/config
```

### D. Conectar via Terminal

```bash
# Usando o alias "anadm"
ssh anadm

# Ou totalmente
ssh -i ~/.ssh/anadm_key root@anadm.site
```

---

## 📋 Opção 2: Integração com VS Code (Remote SSH)

### A. Instalar Extensão

1. **VS Code Extensions** → Procure por "Remote - SSH" (Microsoft)
2. Clique **Install**

### B. Configurar Host SSH

1. Ctrl + Shift + P → `Remote-SSH: Open Configuration File`
2. Selecione `~/.ssh/config`
3. Adicione:

```ssh
Host anadm.site
    HostName anadm.site
    User root
    IdentityFile ~/.ssh/anadm_key
    StrictHostKeyChecking no
```

4. Salve (Ctrl + S)

### C. Conectar

1. Ctrl + Shift + P → `Remote-SSH: Connect to Host`
2. Selecione `anadm.site`
3. Escolha o tipo de OS: **Linux**
4. Aguarde conectar...

**Depois disso:**
- Terminal integrado já está na VPS! 🎉
- Você pode abrir arquivos diretamente da VPS
- Git funciona no terminal integrado
- Tudo como se fosse local!

---

## 🔍 Testando Conectividade

### Test 1: Ping
```bash
ping -c 3 anadm.site
```

### Test 2: Check Porta SSH
```bash
# Timeout curto (5 segundos)
timeout 5 nc -zv anadm.site 22

# Com telnet
telnet anadm.site 22
```

### Test 3: SSH com Verbose
```bash
ssh -vvv root@anadm.site
```

---

## ❌ Troubleshooting

### Problema: "Connection timed out"
```bash
# Pode ser firewall, tente com porta alternativa
ssh -p 2222 root@anadm.site

# Ou verifique firewall da VPS
# Na VPS execute: sudo ufw status
```

### Problema: "Permission denied (publickey)"
```bash
# Chave não foi adicionada à VPS
# Na VPS, execute:
cat ~/.ssh/authorized_keys  # Ver chaves autorizadas
```

### Problema: "Host key verification failed"
```bash
# Remova do known_hosts
ssh-keygen -R anadm.site

# Tente novamente
ssh anadm.site
```

---

## 📝 Checklist de Setup

- [ ] Chave SSH gerada (`~/.ssh/anadm_key`)
- [ ] Chave pública adicionada na VPS (`authorized_keys`)
- [ ] SSH config criado (`~/.ssh/config`)
- [ ] Conexão testada: `ssh anadm`
- [ ] (Opcional) Extensão Remote-SSH instalada
- [ ] Terminal integrado conectado à VPS

---

## 🚀 Próximos Passos Após Conectar

Após estar conectado via SSH no terminal:

```bash
# 1. Executar setup completo
bash << 'SETUP'
set -e
PROJETO_DIR="/var/www/transfarmasul"
LOG_DIR="/var/log/transfarmasul"
DATA_DIR="/var/lib/transfarmasul"
REPO_URL="https://github.com/assessoriaequanime-source/transfarmasul.git"
PORTA=3001

echo "🚀 Configurando TransFarmaSul..."
mkdir -p "$PROJETO_DIR" "$LOG_DIR" "$DATA_DIR"

apt-get update -qq && apt-get upgrade -y -qq > /dev/null 2>&1
apt-get install -y -qq curl git wget ca-certificates htop net-tools nginx certbot > /dev/null 2>&1

if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash - > /dev/null 2>&1
  apt-get install -y nodejs > /dev/null 2>&1
fi

if [ ! -d "$PROJETO_DIR/.git" ]; then
  git clone "$REPO_URL" "$PROJETO_DIR" > /dev/null 2>&1
  echo "✅ Repositório clonado"
else
  cd "$PROJETO_DIR" && git pull origin main > /dev/null 2>&1
  echo "✅ Repositório atualizado"
fi

cd "$PROJETO_DIR"
npm install --legacy-peer-deps --quiet 2>/dev/null
npm run build > /dev/null 2>&1

while netstat -tuln 2>/dev/null | grep -q ":$PORTA " || ss -tuln 2>/dev/null | grep -q ":$PORTA "; do
  PORTA=$((PORTA + 1))
done

echo "✅ Setup concluído na porta $PORTA"
echo ""
echo "Iniciar: cd $PROJETO_DIR && PORT=$PORTA npm run serve"
SETUP

# 2. Você verá tudo em tempo real no terminal! 🎉
```

---

## 📞 Dicas Rápidas

```bash
# Ver se SSH funciona
ssh-keyscan anadm.site  # Ver fingerprint da chave

# Transferir arquivo local para VPS
scp arquivo.txt anadm:/tmp/

# Transferir arquivo de VPS para local
scp anadm:/var/www/transfarmasul/arquivo.txt .

# Executar comando único sem ficar conectado
ssh anadm "comando aqui"

# Port forwarding local
ssh -L 3000:localhost:3001 anadm  # localhost:3000 → VPS:3001
```

---

**Quando estiver conectado via SSH no VS Code, me avise e podemos começar o setup! 🚀**
