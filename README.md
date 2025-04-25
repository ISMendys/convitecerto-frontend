# convitecerto-frontend
convitecerto-frontend
Este é o frontend da aplicação ConviteCerto, responsável pela interface do usuário para criação e gestão de eventos, convites digitais, confirmação de presença e envio via WhatsApp.

📁 Estrutura de Pastas (após build)


🚀 Como rodar localmente

# Instalar dependências
```yarn```

# Criar .env
```cp .env.example .env```

# Rodar em modo dev
```yarn start```

# Gerar build de produção
```yarn build```

🌐 Ambiente de Produção (S3)

Suba o conteúdo da pasta build/ para o bucket do S3 configurado como site estático

Certifique-se de configurar o redirecionamento para index.html em caso de erro 404

📂 Exemplo do .env

```REACT_APP_API_URL=https://api.convitecerto.online/api```

🔗 Integração com o Backend

A API é consumida via axios, configurado em:

```
// src/services/api.js
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});
```

