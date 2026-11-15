<div align="center">
  <img src="assets/a-translator-icon-256.png" alt="Logotipo do A-Translator" width="128">

  # A-Translator

  Ferramenta de localização comunitária e não oficial para o [Alchemy VTT](https://alchemyrpg.com)

  ![Versão](https://img.shields.io/badge/vers%C3%A3o-2.3.0-blue)
  ![Alchemy](https://img.shields.io/badge/testado%20com%20Alchemy-1.45.0-green)
  ![Idiomas](https://img.shields.io/badge/idiomas-FR%20%7C%20ES%20%7C%20NL%20%7C%20PL%20%7C%20PT--BR-lightgrey)
  ![Licença: MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-blue)

  🇬🇧 [English](README.md) · 🇫🇷 [Français](README.fr.md) · 🇪🇸 [Español](README.es.md) · 🇳🇱 [Nederlands](README.nl.md) · 🇵🇱 [Polski](README.pl.md) · **🇧🇷 Português (Brasil)**
</div>

> [!NOTE]
> O A-Translator é um projeto comunitário não oficial. Não é afiliado à Arboreal, LLC. Tudo acontece localmente no seu navegador: os dicionários ficam guardados no seu próprio computador e **nenhum dado é enviado para lugar nenhum**.

## Índice

- [O que é o A-Translator?](#o-que-é-o-a-translator)
- [O que o A-Translator não é](#o-que-o-a-translator-não-é)
- [Instalação](#instalação)
- [App de desktop do Alchemy (macOS)](#app-de-desktop-do-alchemy-macos)
- [Uso](#uso)
- [Dicionários disponíveis](#dicionários-disponíveis)
- [Tipos e formato de dicionário](#tipos-e-formato-de-dicionário)
- [Atualizações](#atualizações)
- [Contribuições](#contribuições)
- [Redefinição](#redefinição)
- [Isenção de responsabilidade e licença](#isenção-de-responsabilidade-e-licença)

## O que é o A-Translator?

O A-Translator é um userscript do [Tampermonkey](https://www.tampermonkey.net/) que traduz a interface do *Alchemy VTT* e a terminologia dos sistemas de jogo, usando dicionários mantidos pela comunidade. Jogadores e mestres podem escolher cada um o seu idioma, sem esperar por uma tradução oficial.

![Interface do A-Translator](assets/a-translator-ui-v2.3.png)

Vários dicionários podem coexistir e são aplicados em camadas:

| Camada | Finalidade |
|---|---|
| **Idioma** | Tradução da interface do Alchemy (dicionário core) |
| **Sistemas de jogo** | Terminologia de um sistema de jogo (por exemplo, D&D 5E) |
| **Pacotes personalizados** | Extensões opcionais da comunidade |
| **Substituições do usuário** | Suas próprias correções, sempre aplicadas primeiro |

A interface do próprio A-Translator segue o idioma do dicionário core ativo. Por padrão, ela fica em inglês.

## O que o A-Translator não é

- Não é uma funcionalidade oficial do Alchemy.
- Não é afiliado à Arboreal, LLC.
- Não modifica os servidores do Alchemy.
- Não modifica nem desbloqueia conteúdos de jogo.
- Não acessa os dados da sua conta.
- Não envia dados para lugar nenhum.

## Instalação

### 1. Instale o Tampermonkey

Baixe-o em [tampermonkey.net](https://www.tampermonkey.net/).

### 2. Configure o Tampermonkey

Configurações recomendadas:

- Ative o Modo Desenvolvedor
- Ative os Scripts de Usuário
- Permita o acesso a URLs de arquivos
- Permita scripts em janelas privadas/anônimas

### 3. Instale o A-Translator

1. Abra o [arquivo do script](https://raw.githubusercontent.com/BriocheMasquee/a-translator/main/userscript/a-translator.user.js) e copie todo o seu conteúdo.
2. Clique na extensão do Tampermonkey e depois em **Add new script…** (Adicionar novo script).
3. Substitua o conteúdo padrão pelo script copiado e salve (File ▸ Save, ou <kbd>Ctrl</kbd>+<kbd>S</kbd> / <kbd>⌘</kbd>+<kbd>S</kbd>).

As próximas atualizações do script são feitas automaticamente pelo Tampermonkey.

## App de desktop do Alchemy (macOS)

O Tampermonkey não funciona dentro do app de desktop do Alchemy. O **Alchemy Launcher** resolve isso: ele abre o app do Alchemy com o A-Translator injetado.

1. Instale o [Node.js](https://nodejs.org) 22 ou mais recente.
2. Baixe o `Alchemy-Launcher-macOS.zip` na [última versão publicada](https://github.com/BriocheMasquee/a-translator/releases/latest), descompacte-o e mova o **Alchemy Launcher** para a pasta Aplicativos.
3. Na primeira vez, o macOS pode se recusar a abri-lo porque ele não é notarizado pela Apple: clique com o botão direito no app, escolha **Abrir** e confirme. (Alternativa: `xattr -dr com.apple.quarantine "/Applications/Alchemy Launcher.app"` no Terminal.)
4. A partir daí, abra o Alchemy pelo launcher. Se o Alchemy já estiver aberto, o launcher pergunta antes de fechá-lo e reiniciá-lo.

Bom saber:

- Enquanto o Alchemy está aberto, uma porta de depuração fica aberta apenas no seu próprio computador (127.0.0.1, porta aleatória). Nada fica acessível de fora.
- A cada abertura, o launcher procura uma versão mais nova do script neste repositório e a usa, se houver; sem conexão, ele usa a cópia embutida.
- Se o Alchemy se atualizar e reiniciar sem a tradução, o launcher oferece reiniciá-lo com a tradução.
- Por enquanto, as mensagens do launcher estão em francês. O registro (log) fica em `~/Library/Logs/Alchemy Launcher.log`.
- Código-fonte e script de compilação: [`launcher/macos/`](launcher/macos/).

## Uso

Abra [app.alchemyrpg.com](https://app.alchemyrpg.com). Um botão com um globo aparece ao lado do botão de menu do Alchemy: clique nele para abrir o A-Translator. Se não o encontrar, recarregue a página.

![Localização do A-Translator](assets/a-translator-location.png)

- Você pode arrastar o botão para onde quiser; a posição é lembrada.
- <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>T</kbd> (Option+Shift+T no macOS, Alt+Shift+T no Windows e no Linux) abre o editor, mesmo que o botão esteja fora de alcance.

Na janela do A-Translator, você pode:

- Importar dicionários do GitHub ou de arquivos locais
- Ativar ou desativar módulos
- Exportar os módulos ativos
- Editar suas substituições pessoais
- Atualizar os dicionários instalados

**Seletor de contexto.** <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>C</kbd> (Alt+Shift+C no Windows e no Linux) e depois clique em qualquer texto da página: o contexto dele (texto, página, elementos pai) é copiado para a área de transferência. É o que quem traduz precisa para escrever uma entrada que depende da página em que uma palavra aparece.

## Dicionários disponíveis

| Dicionário | Tipo | Versão |
|---|---|---|
| Francês — Core UI | core | 4.1 |
| Espanhol — Core UI | core | 4.1 |
| Holandês — Core UI | core | 4.1 |
| Polonês — Core UI | core | 4.1 |
| Português do Brasil — Core UI | core | 4.1 |
| Francês — D&D 5E | system | 2.0 |

O dicionário francês é a referência. Os dicionários em espanhol, holandês, polonês e português do Brasil foram redigidos automaticamente a partir dele e **aguardam revisão por falantes nativos**: correções são muito bem-vindas (veja [Contribuições](#contribuições)).

A lista dos dicionários oficiais está descrita em [`dictionaries/manifest.json`](dictionaries/manifest.json).

## Tipos e formato de dicionário

| Tipo | Finalidade |
|---|---|
| core | Tradução da interface do Alchemy |
| system | Terminologia do sistema de jogo |
| custom | Extensões opcionais da comunidade |
| user | Substituições pessoais |

Vários dicionários de sistema podem estar ativos ao mesmo tempo. As substituições do usuário sempre têm prioridade.

Um dicionário é um arquivo JSON. As chaves são os textos em inglês, exatamente como o Alchemy os exibe:

```json
{
  "meta": {
    "id": "fr-core",
    "name": "French - Core UI",
    "lang": "fr",
    "type": "core",
    "dictVersion": "4.1"
  },
  "entries": {
    "game": "Partie",
    "character": "Personnage"
  }
}
```

As entradas também podem conter `{variáveis}` (`"{n} dice rolled"`), variantes de plural (`"{n} comments|one"`, `|few`, `|many`, `|other`) e variantes que dependem do contexto. Veja o [changelog](CHANGELOG.md) (em inglês) para os detalhes de cada recurso. Datas e horas em formato de 12 horas escritas em inglês são exibidas no idioma do dicionário core ativo.

## Atualizações

O A-Translator pode descobrir os dicionários oficiais no GitHub, importá-los, detectar novas versões e atualizar cada módulo individualmente. Um dicionário só é atualizado quando o seu `dictVersion` aumenta.

Compatibilidade: a versão 2.3.0 foi testada com o Alchemy 1.45.0. Atualizações do Alchemy podem alterar alguns textos; os dicionários são atualizados em consequência.

As instalações da Versão 1 são migradas automaticamente, sem nenhuma conversão manual.

## Contribuições

As contribuições são bem-vindas:

- Revisões e correções dos dicionários em espanhol, holandês, polonês e português do Brasil
- Novas traduções core: copie [`models/XX-core.json`](models/XX-core.json), que contém todas as chaves a traduzir, e preencha os valores (mantenha as chaves inalteradas, espaços inclusive)
- Dicionários de sistemas de jogo (veja [`models/XX-dd5.json`](models/XX-dd5.json))
- Documentação

Quando um dicionário é alterado, aumente o seu `dictVersion` (no arquivo **e** no `manifest.json`); caso contrário, os usuários não receberão a atualização. Um fluxo de validação ([`tools/valider-dictionnaires.mjs`](tools/valider-dictionnaires.mjs)) verifica os dicionários, os modelos e o script a cada push e pull request.

Repositório: https://github.com/BriocheMasquee/a-translator

## Redefinição

**Delete all modules** (Apagar todos os módulos) remove os dicionários instalados, as substituições do usuário e as configurações de tradução. O userscript em si continua instalado.

## Isenção de responsabilidade e licença

*Alchemy* é © Arboreal, LLC. O A-Translator é um projeto comunitário não oficial e não é afiliado à Arboreal, LLC.

Distribuído sob a [Licença MIT](LICENSE).
