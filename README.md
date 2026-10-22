# Açaí na Cuia

Protótipo de landing page mobile-first para a loja Açaí na Cuia, em Cametá.

## Estrutura

- `dist/index.html` — página local pronta para abrir no navegador.
- `dist/assets/images/store-front.jpg` — foto real otimizada da fachada da loja.
- `dist/assets/images/cardapio-com-precos.png` — cardápio com os seis preços informados.
- `dist/assets/images/farofa.jpeg` — arte da farofa caseira.
- `dist/assets/images/farinha-produto-1.jpg`, `farinha-produto-2.jpg` e `farinha-produto-3.jpg` — três artes separadas da imagem composta, sem alterar seu conteúdo.
- `dist/cardapio.json` — preços e número do WhatsApp usados pelo cardápio interativo.
- `references/store-front-original.png` — original da foto enviada.
- `references/menu-card-reference.png` — referência visual do cardápio digital.
- `references/preview-galeria.png` — prévia da seção de produtos no navegador.
- `references/preview-pedido.png` — prévia da confirmação de pedido.

## Rodar localmente

Na pasta do projeto, execute:

```powershell
node server.js
```

Depois, abra [http://localhost:4173/](http://localhost:4173/).
