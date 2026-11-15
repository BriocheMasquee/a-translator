<div align="center">
  <img src="assets/a-translator-icon-256.png" alt="A-Translator logo" width="128">

  # A-Translator

  Unofficial, community-driven localization tool for [Alchemy VTT](https://alchemyrpg.com)

  ![Version](https://img.shields.io/badge/version-2.3.0-blue)
  ![Alchemy](https://img.shields.io/badge/tested%20with%20Alchemy-1.45.0-green)
  ![Languages](https://img.shields.io/badge/languages-FR%20%7C%20ES%20%7C%20NL%20%7C%20PL%20%7C%20PT--BR-lightgrey)
  ![License: MIT](https://img.shields.io/badge/license-MIT-blue)

  [🇧🇷 Versão em português](PTBR-README.md)
</div>

> [!NOTE]
> A-Translator is an unofficial community project. It is not affiliated with Arboreal, LLC. Everything happens locally in your browser: dictionaries are stored on your own computer and **no data is sent anywhere**.

## Table of contents

- [What is A-Translator?](#what-is-a-translator)
- [What A-Translator is not](#what-a-translator-is-not)
- [Installation](#installation)
- [Usage](#usage)
- [Available dictionaries](#available-dictionaries)
- [Dictionary types and format](#dictionary-types-and-format)
- [Updates](#updates)
- [Contributing](#contributing)
- [Reset](#reset)
- [Disclaimer and license](#disclaimer-and-license)

## What is A-Translator?

A-Translator is a [Tampermonkey](https://www.tampermonkey.net/) userscript that translates the interface of *Alchemy VTT* and its game-system terminology, using dictionaries maintained by the community. Players and Game Masters can each pick their own language, without waiting for an official translation.

![A-Translator interface](assets/a-translator-ui-v2.3.png)

Several dictionaries can coexist and are applied in layers:

| Layer | Purpose |
|---|---|
| **Language** | Translation of the Alchemy interface (core dictionary) |
| **Game systems** | Terminology of a game system (for example D&D 5E) |
| **Custom packs** | Optional community extensions |
| **User overrides** | Your own corrections, always applied first |

The interface of A-Translator itself follows the language of the active core dictionary. It is in English by default.

## What A-Translator is not

- It is not an official Alchemy feature.
- It is not affiliated with Arboreal, LLC.
- It does not modify Alchemy's servers.
- It does not modify or unlock game content.
- It does not access your account data.
- It does not send data anywhere.

## Installation

### 1. Install Tampermonkey

Get it from [tampermonkey.net](https://www.tampermonkey.net/).

### 2. Configure Tampermonkey

Recommended settings:

- Enable Developer Mode
- Enable User Scripts
- Allow access to file URLs
- Allow scripts in private/incognito windows

### 3. Install A-Translator

1. Open the [script file](https://raw.githubusercontent.com/BriocheMasquee/a-translator/main/userscript/a-translator.user.js) and copy its whole content.
2. Click the Tampermonkey extension, then **Add new script…**.
3. Replace the default content with the copied script, then save (File ▸ Save, or <kbd>Ctrl</kbd>+<kbd>S</kbd> / <kbd>⌘</kbd>+<kbd>S</kbd>).

Future script updates are handled automatically by Tampermonkey.

## Usage

Open [app.alchemyrpg.com](https://app.alchemyrpg.com). A globe button appears next to the Alchemy menu button: click it to open A-Translator. If you cannot see it, refresh the page.

![A-Translator location](assets/a-translator-location.png)

- You can drag the button anywhere; its position is remembered.
- <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>T</kbd> (Option+Shift+T on macOS, Alt+Shift+T on Windows and Linux) opens the editor, even if the button is out of reach.

From the A-Translator window you can:

- Import dictionaries from GitHub or from local files
- Enable or disable modules
- Export active modules
- Edit your personal overrides
- Update installed dictionaries

**Context picker.** <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>C</kbd> (Alt+Shift+C on Windows and Linux), then click any text on the page: its context (text, page, parent elements) is copied to the clipboard. This is what translators need to write an entry that depends on the page where a word appears.

## Available dictionaries

| Dictionary | Type | Version |
|---|---|---|
| French — Core UI | core | 4.1 |
| Spanish — Core UI | core | 4.1 |
| Dutch — Core UI | core | 4.1 |
| Polish — Core UI | core | 4.1 |
| Brazilian Portuguese — Core UI | core | 4.1 |
| French — D&D 5E | system | 2.0 |

The French dictionary is the reference one. Spanish, Dutch, Polish and Brazilian Portuguese were drafted automatically from it and are **waiting for a review by native speakers**: corrections are very welcome (see [Contributing](#contributing)).

The list of official dictionaries is described in [`dictionaries/manifest.json`](dictionaries/manifest.json).

## Dictionary types and format

| Type | Purpose |
|---|---|
| core | Alchemy interface translation |
| system | Game-system terminology |
| custom | Optional community extensions |
| user | Personal overrides |

Several system dictionaries can be active at the same time. User overrides always have priority.

A dictionary is a JSON file. The keys are the English texts as displayed by Alchemy:

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

Entries can also contain `{variables}` (`"{n} dice rolled"`), plural variants (`"{n} comments|one"`, `|few`, `|many`, `|other`) and context-dependent variants. See the [changelog](CHANGELOG.md) for the details of each feature. Dates and 12-hour times written in English are shown in the language of the active core dictionary.

## Updates

A-Translator can discover the official dictionaries on GitHub, import them, detect new versions and update each module individually. A dictionary only updates when its `dictVersion` increases.

Compatibility: version 2.3.0 was tested with Alchemy 1.45.0. Alchemy updates may change some texts; dictionaries are updated accordingly.

Version 1 installations are migrated automatically, with no manual conversion.

## Contributing

Contributions are welcome:

- Reviews and corrections of the Spanish, Dutch, Polish and Brazilian Portuguese dictionaries
- New core translations: copy [`models/XX-core.json`](models/XX-core.json), which contains all the keys to translate, and fill in the values (keep the keys unchanged, spaces included)
- Game-system dictionaries (see [`models/XX-dd5.json`](models/XX-dd5.json))
- Documentation

When a dictionary changes, increase its `dictVersion` (in the file **and** in `manifest.json`), otherwise users will not receive the update. A validation workflow ([`tools/valider-dictionnaires.mjs`](tools/valider-dictionnaires.mjs)) checks dictionaries, models and the script on every push and pull request.

Repository: https://github.com/BriocheMasquee/a-translator

## Reset

**Delete all modules** removes the installed dictionaries, the user overrides and the translation settings. The userscript itself stays installed.

## Disclaimer and license

*Alchemy* is © Arboreal, LLC. A-Translator is an unofficial community project and is not affiliated with Arboreal, LLC.

Released under the [MIT License](LICENSE).
