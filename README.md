
# USD Alert - PWA Minimalista

Este projeto foi construído seguindo as melhores práticas de engenharia frontend, utilizando React 18, TypeScript, Tailwind CSS e integração com Gemini AI para insights financeiros.

## 1. Estrutura de Pastas
```text
/
├── components/          # Componentes UI reutilizáveis
│   ├── Header.tsx       # Cabeçalho da aplicação
│   ├── QuoteCard.tsx    # Card principal com a cotação
│   ├── Chart.tsx        # Gráfico de evolução (Recharts)
│   └── AIAnalysis.tsx   # Componente de insights via Gemini
├── services/            # Lógica de integração com APIs
│   ├── exchangeService.ts # API de câmbio (AwesomeAPI)
│   └── geminiService.ts   # Integração com Google GenAI
├── types.ts             # Definições de tipos TypeScript
├── constants.ts         # Constantes globais
├── App.tsx              # Componente principal
├── index.tsx            # Ponto de entrada React
├── index.html           # Template HTML + PWA meta
├── manifest.json        # Manifesto do PWA
└── metadata.json        # Metadados do projeto
```

## 2. Comandos de Terminal
Para rodar este projeto localmente (assumindo um ambiente com Node.js):

```bash
# Instalar dependências
npm install lucide-react recharts @google/genai clsx tailwind-merge

# Iniciar em modo de desenvolvimento
npm run dev
```

## 3. Notas
- A aplicação é um **PWA**, preparada para instalação em dispositivos móveis.
- O design é **mobile-first** e **minimalista**.
- Utiliza a **Gemini API** para fornecer análises de tendências baseadas no valor atual.
