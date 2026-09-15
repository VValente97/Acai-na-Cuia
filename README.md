# Açaí na Cuia

Protótipo de landing page mobile-first para a loja Açaí na Cuia, em Cametá.

## Estrutura

- `dist/index.html` — página local pronta para abrir no navegador.
- `dist/assets/images/store-front.png` — foto real da fachada da loja.
- `dist/assets/images/menu-card-reference.png` — referência visual do cardápio digital.
- `.openai/hosting.json` — configuração histórica do protótipo; o uso atual é local.

## Rodar localmente

Na pasta do projeto, execute:

```powershell
node -e "const http=require('http'),fs=require('fs'),path=require('path'); process.chdir('dist'); http.createServer((req,res)=>{const p=path.join(process.cwd(),req.url==='/'?'index.html':req.url); fs.readFile(p,(e,d)=>{if(e){res.writeHead(404);res.end('Not found')}else{res.end(d)}})}).listen(4173,()=>console.log('http://localhost:4173'))"
```

Depois, abra [http://localhost:4173/](http://localhost:4173/).
