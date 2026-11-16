# Storielle Design System

Tokens, componentes CSS e preset Tailwind extraídos da landing page Storielle (dark-first).

## Instalar
```bash
npm install ./storielle-design-system-1.0.1.tgz   # ou: npm install @storielle/design-system
```
```js
import "@storielle/design-system";   // carrega dist/storielle.css
```
Sem bundler: `<link rel="stylesheet" href="storielle.css">` e `<body class="st-body">`.

## Tailwind (opcional)
```js
module.exports = { presets: [require("@storielle/design-system/tailwind")] };
```

## Conteúdo
- `dist/storielle.css` — tokens `--st-*` + componentes `st-*`
- `tokens.json` — tokens em JSON (Figma, Style Dictionary, etc.)
- `tailwind.preset.js` — preset Tailwind
- `docs/index.html` — documentação visual (abra no navegador)

## Componentes
Botões (`st-btn`, `st-cta`, `st-frame`, `st-icon-btn`) · Superfícies (`st-glass`, `st-card`, `st-stat`, `st-window`) · Badges (`st-badge`, `st-tag`) · Formulários (`st-input`, `st-check`, `st-option`, `st-switch`, `st-tabs`, `st-provider`, `st-or`) · Navegação (`st-navlink`, `st-brand`, `st-dots`) · Conteúdo (`st-cover`, `st-persona`, `st-quote`, `st-faq`, `st-plan`, `st-modal`) · Movimento (`st-fade-up`, `st-float`).
Respeita `prefers-reduced-motion`.
