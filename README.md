# Xexeu Dev's - Site de vendas

Site de uma página pronto para publicar no GitHub Pages.

## Arquivos

- `index.html`: site completo.
- `.nojekyll`: evita problemas do GitHub Pages com arquivos estáticos.
- `assets/`: pasta para colocar imagens/prints dos seus projetos.

## Como testar no PC

1. Extraia o ZIP.
2. Abra o arquivo `index.html` no navegador.
3. Teste os botões, menu, formulário e WhatsApp.

## Como publicar no GitHub Pages

1. Entre no GitHub.
2. Crie um repositório chamado, por exemplo: `xexeu-devs`.
3. Envie o arquivo `index.html`, o arquivo `.nojekyll` e a pasta `assets`.
4. No repositório, vá em **Settings**.
5. Clique em **Pages**.
6. Em **Build and deployment**, selecione:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
7. Clique em **Save**.
8. Depois o GitHub vai gerar um link parecido com:
   `https://SEU-USUARIO.github.io/xexeu-devs/`

## Como colocar fotos depois

Coloque suas imagens dentro da pasta `assets`, por exemplo:

- `assets/nova-roleplay.jpg`
- `assets/distrito-pvp.jpg`
- `assets/launcher-mobile.jpg`
- `assets/bot-discord.jpg`

Depois edite no `index.html` a parte de cada projeto.

Exemplo:

Troque:

```html
<div class="project-image"><div class="mock-title">Nova Roleplay</div></div>
```

Por:

```html
<div class="project-image has-img">
  <img src="assets/nova-roleplay.jpg" alt="Print do projeto Nova Roleplay">
  <div class="mock-title">Nova Roleplay</div>
</div>
```

## Contatos configurados

- WhatsApp: +55 14 99817-0370
- Discord: @7xexeu

## Observação

O site foi feito em HTML, CSS e JavaScript puro. Não precisa instalar Node, React, Vite ou nada disso.
