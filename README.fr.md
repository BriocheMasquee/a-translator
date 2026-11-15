<div align="center">
  <img src="assets/a-translator-icon-256.png" alt="Logo d'A-Translator" width="128">

  # A-Translator

  Outil de localisation communautaire et non officiel pour [Alchemy VTT](https://alchemyrpg.com)

  ![Version](https://img.shields.io/badge/version-2.3.0-blue)
  ![Alchemy](https://img.shields.io/badge/test%C3%A9%20avec%20Alchemy-1.45.0-green)
  ![Langues](https://img.shields.io/badge/langues-FR%20%7C%20ES%20%7C%20NL%20%7C%20PL%20%7C%20PT--BR-lightgrey)
  ![Licence : MIT](https://img.shields.io/badge/licence-MIT-blue)

  🇬🇧 [English](README.md) · **🇫🇷 Français** · 🇪🇸 [Español](README.es.md) · 🇳🇱 [Nederlands](README.nl.md) · 🇵🇱 [Polski](README.pl.md) · 🇧🇷 [Português (Brasil)](README.pt-br.md)
</div>

> [!NOTE]
> A-Translator est un projet communautaire non officiel. Il n'est pas affilié à Arboreal, LLC. Tout se passe en local dans votre navigateur : les dictionnaires sont stockés sur votre propre ordinateur et **aucune donnée n'est envoyée nulle part**.

## Sommaire

- [Présentation](#présentation)
- [Ce que A-Translator n'est pas](#ce-que-a-translator-nest-pas)
- [Installation](#installation)
- [Application de bureau Alchemy (macOS)](#application-de-bureau-alchemy-macos)
- [Utilisation](#utilisation)
- [Dictionnaires disponibles](#dictionnaires-disponibles)
- [Types et format de dictionnaire](#types-et-format-de-dictionnaire)
- [Mises à jour](#mises-à-jour)
- [Contribuer](#contribuer)
- [Réinitialisation](#réinitialisation)
- [Avertissement et licence](#avertissement-et-licence)

## Présentation

A-Translator est un userscript [Tampermonkey](https://www.tampermonkey.net/) qui traduit l'interface d'*Alchemy VTT* et la terminologie des systèmes de jeu, à partir de dictionnaires entretenus par la communauté. Joueurs et MJ peuvent chacun choisir leur langue, sans attendre une traduction officielle.

![Interface d'A-Translator](assets/a-translator-ui-v2.3.png)

Plusieurs dictionnaires peuvent coexister et s'appliquent par couches :

| Couche | Rôle |
|---|---|
| **Langue** | Traduction de l'interface d'Alchemy (dictionnaire core) |
| **Systèmes de jeu** | Terminologie d'un système de jeu (par exemple D&D 5E) |
| **Packs personnalisés** | Extensions facultatives de la communauté |
| **Modifications personnelles** | Vos propres corrections, toujours appliquées en premier |

L'interface d'A-Translator elle-même suit la langue du dictionnaire core actif. Elle est en anglais par défaut.

## Ce que A-Translator n'est pas

- Ce n'est pas une fonctionnalité officielle d'Alchemy.
- Il n'est pas affilié à Arboreal, LLC.
- Il ne modifie pas les serveurs d'Alchemy.
- Il ne modifie ni ne débloque aucun contenu de jeu.
- Il n'accède pas aux données de votre compte.
- Il n'envoie aucune donnée nulle part.

## Installation

### 1. Installer Tampermonkey

Disponible sur [tampermonkey.net](https://www.tampermonkey.net/).

### 2. Configurer Tampermonkey

Réglages recommandés :

- Activer le mode développeur
- Activer les scripts utilisateur
- Autoriser l'accès aux URL de fichiers
- Autoriser les scripts en navigation privée

### 3. Installer A-Translator

1. Ouvrez le [fichier du script](https://raw.githubusercontent.com/BriocheMasquee/a-translator/main/userscript/a-translator.user.js) et copiez tout son contenu.
2. Cliquez sur l'extension Tampermonkey, puis sur **Add new script…** (Ajouter un script).
3. Remplacez le contenu par défaut par le script copié, puis enregistrez (File ▸ Save, ou <kbd>Ctrl</kbd>+<kbd>S</kbd> / <kbd>⌘</kbd>+<kbd>S</kbd>).

Les futures mises à jour du script sont gérées automatiquement par Tampermonkey.

## Application de bureau Alchemy (macOS)

Tampermonkey ne fonctionne pas dans l'application de bureau d'Alchemy. **Alchemy Launcher** résout ce problème : il démarre l'application Alchemy avec A-Translator injecté.

1. Installez [Node.js](https://nodejs.org) 22 ou plus récent.
2. Téléchargez `Alchemy-Launcher-macOS.zip` depuis la [dernière version publiée](https://github.com/BriocheMasquee/a-translator/releases/latest), décompressez-le et déplacez **Alchemy Launcher** dans votre dossier Applications.
3. La première fois, macOS peut refuser de l'ouvrir parce qu'il n'est pas notarisé par Apple : faites un clic droit sur l'app, choisissez **Ouvrir**, puis confirmez. (Autre possibilité : `xattr -dr com.apple.quarantine "/Applications/Alchemy Launcher.app"` dans le Terminal.)
4. Démarrez désormais Alchemy par le lanceur. Si Alchemy est déjà ouvert, le lanceur demande avant de le fermer et de le relancer.

À savoir :

- Pendant qu'Alchemy tourne, un port de débogage est ouvert sur votre ordinateur uniquement (127.0.0.1, port aléatoire). Rien n'est accessible de l'extérieur.
- À chaque démarrage, le lanceur cherche une version plus récente du script sur ce dépôt et l'utilise s'il en trouve une ; hors ligne, il utilise la copie embarquée.
- Si Alchemy se met à jour et redémarre sans la traduction, le lanceur propose de le relancer avec la traduction.
- Pour l'instant, les messages du lanceur sont en français. Son journal se trouve dans `~/Library/Logs/Alchemy Launcher.log`.
- Sources et script de compilation : [`launcher/macos/`](launcher/macos/).

## Utilisation

Ouvrez [app.alchemyrpg.com](https://app.alchemyrpg.com). Un bouton en forme de globe apparaît à côté du bouton de menu d'Alchemy : cliquez dessus pour ouvrir A-Translator. S'il n'apparaît pas, rechargez la page.

![Emplacement d'A-Translator](assets/a-translator-location.png)

- Vous pouvez faire glisser le bouton où vous voulez ; sa position est mémorisée.
- <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>T</kbd> (Option+Maj+T sur macOS, Alt+Maj+T sur Windows et Linux) ouvre l'éditeur, même si le bouton est hors d'atteinte.

Depuis la fenêtre d'A-Translator, vous pouvez :

- Importer des dictionnaires depuis GitHub ou depuis des fichiers locaux
- Activer ou désactiver des modules
- Exporter les modules actifs
- Modifier vos corrections personnelles
- Mettre à jour les dictionnaires installés

**Sélecteur de contexte.** <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>C</kbd> (Alt+Maj+C sur Windows et Linux), puis cliquez sur un texte de la page : son contexte (texte, page, éléments parents) est copié dans le presse-papiers. C'est ce dont les traducteurs ont besoin pour écrire une entrée qui dépend de la page où apparaît un mot.

## Dictionnaires disponibles

| Dictionnaire | Type | Version |
|---|---|---|
| Français — Core UI | core | 4.1 |
| Espagnol — Core UI | core | 4.1 |
| Néerlandais — Core UI | core | 4.1 |
| Polonais — Core UI | core | 4.1 |
| Portugais (Brésil) — Core UI | core | 4.1 |
| Français — D&D 5E | system | 2.0 |

Le dictionnaire français est la référence. Les dictionnaires espagnol, néerlandais, polonais et portugais (Brésil) ont été rédigés automatiquement à partir de lui et **attendent une relecture par des locuteurs natifs** : les corrections sont les bienvenues (voir [Contribuer](#contribuer)).

La liste des dictionnaires officiels est décrite dans [`dictionaries/manifest.json`](dictionaries/manifest.json).

## Types et format de dictionnaire

| Type | Rôle |
|---|---|
| core | Traduction de l'interface d'Alchemy |
| system | Terminologie d'un système de jeu |
| custom | Extensions facultatives de la communauté |
| user | Corrections personnelles |

Plusieurs dictionnaires de système peuvent être actifs en même temps. Les corrections personnelles sont toujours prioritaires.

Un dictionnaire est un fichier JSON. Les clés sont les textes anglais tels qu'Alchemy les affiche :

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

Les entrées peuvent aussi contenir des `{variables}` (`"{n} dice rolled"`), des variantes de pluriel (`"{n} comments|one"`, `|few`, `|many`, `|other`) et des variantes qui dépendent du contexte. Voir le [journal des modifications](CHANGELOG.md) (en anglais) pour le détail de chaque fonctionnalité. Les dates et heures au format 12 h écrites en anglais s'affichent dans la langue du dictionnaire core actif.

## Mises à jour

A-Translator peut découvrir les dictionnaires officiels sur GitHub, les importer, détecter les nouvelles versions et mettre à jour chaque module individuellement. Un dictionnaire n'est mis à jour que si son `dictVersion` augmente.

Compatibilité : la version 2.3.0 a été testée avec Alchemy 1.45.0. Les mises à jour d'Alchemy peuvent changer certains textes ; les dictionnaires sont mis à jour en conséquence.

Les installations de la version 1 sont migrées automatiquement, sans conversion manuelle.

## Contribuer

Les contributions sont les bienvenues :

- Relectures et corrections des dictionnaires espagnol, néerlandais, polonais et portugais (Brésil)
- Nouvelles traductions core : copiez [`models/XX-core.json`](models/XX-core.json), qui contient toutes les clés à traduire, et remplissez les valeurs (ne modifiez pas les clés, espaces compris)
- Dictionnaires de systèmes de jeu (voir [`models/XX-dd5.json`](models/XX-dd5.json))
- Documentation

Quand un dictionnaire change, augmentez son `dictVersion` (dans le fichier **et** dans `manifest.json`), sinon les utilisateurs ne recevront pas la mise à jour. Un workflow de validation ([`tools/valider-dictionnaires.mjs`](tools/valider-dictionnaires.mjs)) vérifie les dictionnaires, les modèles et le script à chaque push et pull request.

Dépôt : https://github.com/BriocheMasquee/a-translator

## Réinitialisation

**Delete all modules** (Supprimer tous les modules) supprime les dictionnaires installés, les corrections personnelles et les réglages de traduction. Le userscript lui-même reste installé.

## Avertissement et licence

*Alchemy* est © Arboreal, LLC. A-Translator est un projet communautaire non officiel et n'est pas affilié à Arboreal, LLC.

Publié sous [licence MIT](LICENSE).
