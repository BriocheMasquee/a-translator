# Changelog

## 2.3.0 — 2026-11-15

### Added
- Context picker (Alt+Shift+C): click any text to copy its context (text, page, ancestors) to the clipboard, to write context-dependent entries.
- The A-Translator interface is in English by default and follows the language of the active language dictionary: its texts are ordinary dictionary entries (keys = the English texts; keys with a variable are prefixed `a-translator: `). The `XX-core` template contains them (dictionaries 4.1).
- The floating button can be dragged anywhere (position remembered; `AlchemyTranslate.resetButtonPosition()` restores the default). It now sits next to the Alchemy menu button by default instead of hiding the first entry of that menu.
- Keyboard shortcut Alt+Shift+T opens the editor, even when the button is out of reach.
- Plural forms: a pattern entry such as `"{n} comments"` can have optional variants `"{n} comments|one"`, `|few`, `|many`, `|other` (language of the active core dictionary, `Intl.PluralRules`); the plain pattern stays the fallback, so older script versions simply ignore the variants.
- Whole-sentence entries: a sentence split into several pieces by the page (adjacent text nodes written by React, a bold word, a link) is looked up as one sentence; inline elements become `<0>…</0>`, `<1>…</1>` in order. Fixes sentences like "We're working on this Game now!".
- Selector variants `"<pattern>|type=game"` (chosen from the value captured by `{type}`) and context-dependent entries `"<text>||path=…,dialog=…,within=…,tag=…"`; `AlchemyTranslate.context(el)` shows what a translator needs to write one.
- Dates written in English ("Apr 2026", "December 11, 2026", "11 Dec 2026") are shown in the language of the active core dictionary, as a whole text or inside a `{variable}`. Nothing else is converted. 12-hour times ("1:35 AM") are shown with the clock style of that language too.

## 2.2.0 — 2026-11-14

### Fixed
- Text nodes inserted on their own by the page (typical of React) were never translated.
- `placeholder`, `title` and `aria-label` rewritten by the page after load were not translated again.
- Translations containing `$&`, `$1`… were altered by the string replacement.
- Texts ending with `.`, `!`, `?` or `…` (e.g. "Sign in.") did not match their dictionary entry.
- A heading equal to the default value of a field (e.g. "New Game") was left untranslated.
- Chat: players' messages were translated on the current Alchemy markup (1.45); the detection was updated.
- Titles animated letter by letter (e.g. "Welcome to Alchemy!") are now translated.
- Performance: no more full-page scan for every text node.
- Memory: nodes removed from the page are released.
- Non-breaking / repeated spaces no longer prevent a match.

### Added
- Dictionary entries can contain `{variables}`, e.g. `"{n} dice rolled": "{n} dés lancés"`.
- "Find untranslated text" tool in the dictionary editor (introduced in 2.1.0, never released).

## 2.0.0
- Modular dictionaries (core, system, custom, user overrides), GitHub import and updates.
