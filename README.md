# Menu Mingle Meals

https://diggy.menu/6489dc5a9b2befc56fb85daa veja esse link e essa foto em anexo quero fazer um sistema desse para um cliente não vamos fazer agora so quero saber se da pra fazer e como seria os custos estimados com api do whatsapp

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://menu-mingle-meals.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/70fbdc38-e34a-4694-88e4-fbf79d120966).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Hospedagem comum Locaweb (Apache)

O build padrão também contém arquivos de servidor: não envie o repositório ou apenas `assets` para a hospedagem.

1. Baixe a versão atualizada do repositório e instale as dependências com `npm install`.
2. Execute `npm run build:locaweb`.
3. Envie **todo o conteúdo de `dist/locaweb/`**, incluindo o arquivo oculto `.htaccess`, para a pasta pública do domínio indicada no painel da Locaweb. O `index.html` deve ficar diretamente nessa pasta, não dentro de `dist/locaweb` no servidor.
4. Substitua o `index.html` antigo e envie a pasta `assets` da mesma geração. Não misture arquivos de builds diferentes.
5. Ative um certificado SSL válido para `blackburgerbbq.com.br` no painel da hospedagem. Um certificado de outro domínio não funciona; esse ajuste não é feito pelo Git.
6. Confira `/`, adicione um lanche, preencha os dados e abra o pedido no WhatsApp. Abra também `/entrega?p=100&n=Ana&t=5571988887777` diretamente e confira o botão de aviso.

Essa exportação serve o cardápio e o aviso de entrega sem Node.js, banco de dados ou API do WhatsApp. Os dados do link de entrega são lidos no navegador; não ficam gravados na hospedagem.

Se o plano não utilizar Apache ou não aceitar `.htaccess`, configure no painel a URL `/entrega` para servir `entrega/index.html` preservando os parâmetros. A pasta pública e as opções de SSL dependem do plano contratado.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
