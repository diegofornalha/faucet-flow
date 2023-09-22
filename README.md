# **Torneira (Faucet) do Flow Testnet**

Implantado em: **https://testnet-faucet.onflow.org/**

## **Uso**

### **Criar uma nova conta**

Use o **[Flow CLI](https://developers.flow.com/tooling/flow-cli)** para gerar um novo par de chaves:

```
# Este comando usa ECDSA_P256 e SHA3_256 por padrão
flow keys generate
```

Insira a chave pública resultante no formulário "Criar Conta", complete o captcha e envie.

### **Financiar uma conta**

Insira um endereço de conta existente no formulário "Financiar Conta", complete o captcha e envie.

## **Desenvolvimento**

### **Crie um arquivo dotenv**

⚠️ O valor **`SIGNER_PRIVATE_KEY`** deve corresponder ao valor **`FLOW_SERVICEPRIVATEKEY`** em **`docker-compose.yml`**.

```
cp env.example .env
```

### **Inicie o Emulador Flow e o banco de dados Postgres**

```
docker-compose up -d
```

### **Instale as dependências**

```
npm install
```

### **Migre e popule o banco de dados**

```
npm run db-migrate-dev
npm run db-seed
```

### **Implante contratos**

⚠️ O valor **`accounts.emulator-account`** em flow.json deve corresponder ao valor **`FLOW_SERVICEPRIVATEKEY`** em **`docker-compose.yml`**.

```
npm run dev-deploy-contracts
```

### **Execute transações iniciais para inicializar o emissor FUSD**

```
npm run initial-transactions
```

### **Execute o aplicativo Next.js**

```
npm run dev
```

### **Execute eslint, verificações typescript, testes**

```
npm run check
```
