<div align="center">
  <img src="assets/a-translator-icon-256.png" alt="Logo van A-Translator" width="128">

  # A-Translator

  Onofficieel lokalisatiehulpmiddel van de community voor [Alchemy VTT](https://alchemyrpg.com)

  ![Versie](https://img.shields.io/badge/versie-2.3.0-blue)
  ![Alchemy](https://img.shields.io/badge/getest%20met%20Alchemy-1.45.0-green)
  ![Talen](https://img.shields.io/badge/talen-FR%20%7C%20ES%20%7C%20NL%20%7C%20PL%20%7C%20PT--BR-lightgrey)
  ![Licentie: MIT](https://img.shields.io/badge/licentie-MIT-blue)

  🇬🇧 [English](README.md) · 🇫🇷 [Français](README.fr.md) · 🇪🇸 [Español](README.es.md) · **🇳🇱 Nederlands** · 🇵🇱 [Polski](README.pl.md) · 🇧🇷 [Português (Brasil)](README.pt-br.md)
</div>

> [!NOTE]
> A-Translator is een onofficieel community-project. Het is niet verbonden aan Arboreal, LLC. Alles gebeurt lokaal in je browser: de woordenboeken staan op je eigen computer en **er worden nergens gegevens naartoe gestuurd**.

## Inhoud

- [Wat is A-Translator](#wat-is-a-translator)
- [Wat A-Translator niet is](#wat-a-translator-niet-is)
- [Installatie](#installatie)
- [Alchemy-desktopapp (macOS)](#alchemy-desktopapp-macos)
- [Gebruik](#gebruik)
- [Beschikbare woordenboeken](#beschikbare-woordenboeken)
- [Woordenboektypen en indeling](#woordenboektypen-en-indeling)
- [Updates](#updates)
- [Bijdragen](#bijdragen)
- [Resetten](#resetten)
- [Disclaimer en licentie](#disclaimer-en-licentie)

## Wat is A-Translator

A-Translator is een [Tampermonkey](https://www.tampermonkey.net/)-userscript dat de interface van *Alchemy VTT* en de terminologie van spelsystemen vertaalt, met woordenboeken die door de community worden onderhouden. Spelers en spelleiders kiezen elk hun eigen taal, zonder te wachten op een officiële vertaling.

![Interface van A-Translator](assets/a-translator-ui-v2.3.png)

Meerdere woordenboeken kunnen naast elkaar bestaan en worden in lagen toegepast:

| Laag | Doel |
|---|---|
| **Taal** | Vertaling van de Alchemy-interface (core-woordenboek) |
| **Spelsystemen** | Terminologie van een spelsysteem (bijvoorbeeld D&D 5E) |
| **Eigen pakketten** | Optionele uitbreidingen van de community |
| **Eigen aanpassingen** | Je eigen correcties, altijd als eerste toegepast |

De interface van A-Translator zelf volgt de taal van het actieve core-woordenboek. Standaard is die Engels.

## Wat A-Translator niet is

- Het is geen officiële functie van Alchemy.
- Het is niet verbonden aan Arboreal, LLC.
- Het wijzigt de servers van Alchemy niet.
- Het wijzigt of ontgrendelt geen spelinhoud.
- Het heeft geen toegang tot je accountgegevens.
- Het stuurt nergens gegevens naartoe.

## Installatie

### 1. Installeer Tampermonkey

Download het op [tampermonkey.net](https://www.tampermonkey.net/).

### 2. Stel Tampermonkey in

Aanbevolen instellingen:

- Schakel de ontwikkelaarsmodus in
- Schakel gebruikersscripts in
- Sta toegang tot bestands-URL's toe
- Sta scripts toe in privévensters/incognitovensters

### 3. Installeer A-Translator

1. Open het [scriptbestand](https://raw.githubusercontent.com/BriocheMasquee/a-translator/main/userscript/a-translator.user.js) en kopieer de volledige inhoud.
2. Klik op de Tampermonkey-extensie en kies **Add new script…** (Nieuw script toevoegen).
3. Vervang de standaardinhoud door het gekopieerde script en sla op (File ▸ Save, of <kbd>Ctrl</kbd>+<kbd>S</kbd> / <kbd>⌘</kbd>+<kbd>S</kbd>).

Toekomstige scriptupdates worden automatisch door Tampermonkey afgehandeld.

## Alchemy-desktopapp (macOS)

Tampermonkey werkt niet in de desktopapp van Alchemy. **Alchemy Launcher** lost dat op: hij start de Alchemy-app met A-Translator erin geïnjecteerd.

1. Installeer [Node.js](https://nodejs.org) 22 of nieuwer.
2. Download `Alchemy-Launcher-macOS.zip` van de [laatste release](https://github.com/BriocheMasquee/a-translator/releases/latest), pak het uit en verplaats **Alchemy Launcher** naar je map Programma's.
3. De eerste keer kan macOS weigeren de app te openen omdat Apple hem niet heeft genotariseerd: klik met de rechtermuisknop op de app, kies **Open** en bevestig. (Alternatief: `xattr -dr com.apple.quarantine "/Applications/Alchemy Launcher.app"` in Terminal.)
4. Start Alchemy voortaan via de launcher. Als Alchemy al open is, vraagt de launcher eerst of hij het mag sluiten en opnieuw starten.

Goed om te weten:

- Terwijl Alchemy draait, staat er een debugpoort open, alleen op je eigen computer (127.0.0.1, willekeurige poort). Van buitenaf is niets bereikbaar.
- Bij elke start zoekt de launcher in deze repository naar een nieuwere versie van het script en gebruikt die als hij er een vindt; offline gebruikt hij het ingebouwde exemplaar.
- Als Alchemy zichzelf bijwerkt en zonder vertaling opnieuw start, biedt de launcher aan het opnieuw te starten mét vertaling.
- Voorlopig zijn de berichten van de launcher in het Frans. Het logbestand staat in `~/Library/Logs/Alchemy Launcher.log`.
- Broncode en buildscript: [`launcher/macos/`](launcher/macos/).

## Gebruik

Open [app.alchemyrpg.com](https://app.alchemyrpg.com). Naast de menuknop van Alchemy verschijnt een knop in de vorm van een wereldbol: klik erop om A-Translator te openen. Zie je hem niet, vernieuw dan de pagina.

![Locatie van A-Translator](assets/a-translator-location.png)

- Je kunt de knop overal naartoe slepen; de positie wordt onthouden.
- <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>T</kbd> (Option+Shift+T op macOS, Alt+Shift+T op Windows en Linux) opent de editor, ook als de knop onbereikbaar is.

In het venster van A-Translator kun je:

- Woordenboeken importeren van GitHub of uit lokale bestanden
- Modules in- of uitschakelen
- Actieve modules exporteren
- Je persoonlijke aanpassingen bewerken
- Geïnstalleerde woordenboeken bijwerken

**Contextkiezer.** <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>C</kbd> (Alt+Shift+C op Windows en Linux) en klik daarna op een willekeurige tekst op de pagina: de context ervan (tekst, pagina, bovenliggende elementen) wordt naar het klembord gekopieerd. Dat hebben vertalers nodig om een vermelding te schrijven die afhangt van de pagina waarop een woord staat.

## Beschikbare woordenboeken

| Woordenboek | Type | Versie |
|---|---|---|
| Frans — Core UI | core | 4.1 |
| Spaans — Core UI | core | 4.1 |
| Nederlands — Core UI | core | 4.1 |
| Pools — Core UI | core | 4.1 |
| Braziliaans Portugees — Core UI | core | 4.1 |
| Frans — D&D 5E | system | 2.0 |

Het Franse woordenboek is de referentie. De Spaanse, Nederlandse, Poolse en Braziliaans-Portugese woordenboeken zijn er automatisch uit afgeleid en **wachten op een controle door moedertaalsprekers**: correcties zijn van harte welkom (zie [Bijdragen](#bijdragen)).

De lijst met officiële woordenboeken staat in [`dictionaries/manifest.json`](dictionaries/manifest.json).

## Woordenboektypen en indeling

| Type | Doel |
|---|---|
| core | Vertaling van de Alchemy-interface |
| system | Terminologie van het spelsysteem |
| custom | Optionele uitbreidingen van de community |
| user | Persoonlijke aanpassingen |

Meerdere systeemwoordenboeken kunnen tegelijk actief zijn. Gebruikersaanpassingen hebben altijd voorrang.

Een woordenboek is een JSON-bestand. De sleutels zijn de Engelse teksten zoals Alchemy ze toont:

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

Vermeldingen kunnen ook `{variabelen}` bevatten (`"{n} dice rolled"`), meervoudsvarianten (`"{n} comments|one"`, `|few`, `|many`, `|other`) en varianten die van de context afhangen. Zie de [wijzigingslog](CHANGELOG.md) (in het Engels) voor de details van elke functie. Datums en 12-uursklokken in het Engels worden getoond in de taal van het actieve core-woordenboek.

## Updates

A-Translator kan de officiële woordenboeken op GitHub vinden, importeren, nieuwe versies opsporen en elke module afzonderlijk bijwerken. Een woordenboek wordt alleen bijgewerkt als zijn `dictVersion` hoger wordt.

Compatibiliteit: versie 2.3.0 is getest met Alchemy 1.45.0. Updates van Alchemy kunnen sommige teksten wijzigen; de woordenboeken worden daarop aangepast.

Installaties van versie 1 worden automatisch gemigreerd, zonder handmatige conversie.

## Bijdragen

Bijdragen zijn welkom:

- Controles en correcties van de Spaanse, Nederlandse, Poolse en Braziliaans-Portugese woordenboeken
- Nieuwe core-vertalingen: kopieer [`models/XX-core.json`](models/XX-core.json), dat alle te vertalen sleutels bevat, en vul de waarden in (laat de sleutels ongewijzigd, spaties inbegrepen)
- Woordenboeken voor spelsystemen (zie [`models/XX-dd5.json`](models/XX-dd5.json))
- Documentatie

Verhoog bij elke wijziging van een woordenboek de `dictVersion` (in het bestand **en** in `manifest.json`), anders krijgen gebruikers de update niet. Een validatieworkflow ([`tools/valider-dictionnaires.mjs`](tools/valider-dictionnaires.mjs)) controleert de woordenboeken, de modellen en het script bij elke push en pull request.

Repository: https://github.com/BriocheMasquee/a-translator

## Resetten

**Delete all modules** (Alle modules verwijderen) verwijdert de geïnstalleerde woordenboeken, de gebruikersaanpassingen en de vertaalinstellingen. Het userscript zelf blijft geïnstalleerd.

## Disclaimer en licentie

*Alchemy* is © Arboreal, LLC. A-Translator is een onofficieel community-project en is niet verbonden aan Arboreal, LLC.

Uitgebracht onder de [MIT-licentie](LICENSE).
