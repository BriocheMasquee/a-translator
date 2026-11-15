<div align="center">
  <img src="assets/a-translator-icon-256.png" alt="Logotipo de A-Translator" width="128">

  # A-Translator

  Herramienta de localización comunitaria y no oficial para [Alchemy VTT](https://alchemyrpg.com)

  ![Versión](https://img.shields.io/badge/versi%C3%B3n-2.3.0-blue)
  ![Alchemy](https://img.shields.io/badge/probado%20con%20Alchemy-1.45.0-green)
  ![Idiomas](https://img.shields.io/badge/idiomas-FR%20%7C%20ES%20%7C%20NL%20%7C%20PL%20%7C%20PT--BR-lightgrey)
  ![Licencia: MIT](https://img.shields.io/badge/licencia-MIT-blue)

  🇬🇧 [English](README.md) · 🇫🇷 [Français](README.fr.md) · **🇪🇸 Español** · 🇳🇱 [Nederlands](README.nl.md) · 🇵🇱 [Polski](README.pl.md) · 🇧🇷 [Português (Brasil)](README.pt-br.md)
</div>

> [!NOTE]
> A-Translator es un proyecto comunitario no oficial. No está afiliado a Arboreal, LLC. Todo ocurre localmente en tu navegador: los diccionarios se guardan en tu propio ordenador y **no se envía ningún dato a ninguna parte**.

## Índice

- [Qué es A-Translator](#qué-es-a-translator)
- [Qué no es A-Translator](#qué-no-es-a-translator)
- [Instalación](#instalación)
- [App de escritorio de Alchemy (macOS)](#app-de-escritorio-de-alchemy-macos)
- [Uso](#uso)
- [Diccionarios disponibles](#diccionarios-disponibles)
- [Tipos y formato de diccionario](#tipos-y-formato-de-diccionario)
- [Actualizaciones](#actualizaciones)
- [Contribuir](#contribuir)
- [Restablecer](#restablecer)
- [Aviso legal y licencia](#aviso-legal-y-licencia)

## Qué es A-Translator

A-Translator es un userscript de [Tampermonkey](https://www.tampermonkey.net/) que traduce la interfaz de *Alchemy VTT* y la terminología de los sistemas de juego, usando diccionarios mantenidos por la comunidad. Jugadores y directores de juego (DJ) pueden elegir cada uno su idioma, sin esperar a una traducción oficial.

![Interfaz de A-Translator](assets/a-translator-ui-v2.3.png)

Varios diccionarios pueden coexistir y se aplican por capas:

| Capa | Finalidad |
|---|---|
| **Idioma** | Traducción de la interfaz de Alchemy (diccionario core) |
| **Sistemas de juego** | Terminología de un sistema de juego (por ejemplo, D&D 5E) |
| **Paquetes personalizados** | Extensiones opcionales de la comunidad |
| **Modificaciones del usuario** | Tus propias correcciones, siempre aplicadas primero |

La interfaz de A-Translator sigue el idioma del diccionario core activo. Por defecto está en inglés.

## Qué no es A-Translator

- No es una función oficial de Alchemy.
- No está afiliado a Arboreal, LLC.
- No modifica los servidores de Alchemy.
- No modifica ni desbloquea contenidos del juego.
- No accede a los datos de tu cuenta.
- No envía datos a ninguna parte.

## Instalación

### 1. Instala Tampermonkey

Descárgalo en [tampermonkey.net](https://www.tampermonkey.net/).

### 2. Configura Tampermonkey

Ajustes recomendados:

- Activa el modo de desarrollador
- Activa los scripts de usuario
- Permite el acceso a URL de archivos
- Permite los scripts en ventanas privadas o de incógnito

### 3. Instala A-Translator

1. Abre el [archivo del script](https://raw.githubusercontent.com/BriocheMasquee/a-translator/main/userscript/a-translator.user.js) y copia todo su contenido.
2. Haz clic en la extensión de Tampermonkey y luego en **Add new script…** (Añadir nuevo script).
3. Sustituye el contenido por defecto por el script copiado y guarda (File ▸ Save, o <kbd>Ctrl</kbd>+<kbd>S</kbd> / <kbd>⌘</kbd>+<kbd>S</kbd>).

Las futuras actualizaciones del script las gestiona Tampermonkey automáticamente.

## App de escritorio de Alchemy (macOS)

Tampermonkey no funciona dentro de la app de escritorio de Alchemy. **Alchemy Launcher** lo resuelve: abre la app de Alchemy con A-Translator inyectado.

1. Instala [Node.js](https://nodejs.org) 22 o superior.
2. Descarga `Alchemy-Launcher-macOS.zip` de la [última versión publicada](https://github.com/BriocheMasquee/a-translator/releases/latest), descomprímelo y mueve **Alchemy Launcher** a la carpeta Aplicaciones.
3. La primera vez, macOS puede negarse a abrirlo porque Apple no lo ha notarizado: haz clic derecho en la app, elige **Abrir** y confirma. (Alternativa: `xattr -dr com.apple.quarantine "/Applications/Alchemy Launcher.app"` en la Terminal.)
4. A partir de ahora, abre Alchemy con el lanzador. Si Alchemy ya está abierto, el lanzador pregunta antes de cerrarlo y reiniciarlo.

Conviene saber:

- Mientras Alchemy está en marcha, hay un puerto de depuración abierto solo en tu propio ordenador (127.0.0.1, puerto aleatorio). Nada es accesible desde fuera.
- En cada arranque, el lanzador busca una versión más reciente del script en este repositorio y la usa si existe; sin conexión, usa la copia incorporada.
- Si Alchemy se actualiza y se reinicia sin la traducción, el lanzador se ofrece a reiniciarlo con la traducción.
- Por ahora, los mensajes del lanzador están en francés. Su registro está en `~/Library/Logs/Alchemy Launcher.log`.
- Código fuente y script de compilación: [`launcher/macos/`](launcher/macos/).

## Uso

Abre [app.alchemyrpg.com](https://app.alchemyrpg.com). Aparece un botón con forma de globo junto al botón de menú de Alchemy: haz clic para abrir A-Translator. Si no lo ves, recarga la página.

![Ubicación de A-Translator](assets/a-translator-location.png)

- Puedes arrastrar el botón a donde quieras; su posición se recuerda.
- <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>T</kbd> (Option+Shift+T en macOS, Alt+Shift+T en Windows y Linux) abre el editor, aunque el botón no esté al alcance.

Desde la ventana de A-Translator puedes:

- Importar diccionarios desde GitHub o desde archivos locales
- Activar o desactivar módulos
- Exportar los módulos activos
- Editar tus modificaciones personales
- Actualizar los diccionarios instalados

**Selector de contexto.** <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>C</kbd> (Alt+Shift+C en Windows y Linux) y luego haz clic en cualquier texto de la página: su contexto (texto, página, elementos padre) se copia al portapapeles. Es lo que necesitan los traductores para escribir una entrada que depende de la página donde aparece una palabra.

## Diccionarios disponibles

| Diccionario | Tipo | Versión |
|---|---|---|
| Francés — Core UI | core | 4.1 |
| Español — Core UI | core | 4.1 |
| Neerlandés — Core UI | core | 4.1 |
| Polaco — Core UI | core | 4.1 |
| Portugués de Brasil — Core UI | core | 4.1 |
| Francés — D&D 5E | system | 2.0 |

El diccionario francés es la referencia. Los diccionarios en español, neerlandés, polaco y portugués de Brasil se redactaron automáticamente a partir de él y **esperan la revisión de hablantes nativos**: las correcciones son muy bienvenidas (consulta [Contribuir](#contribuir)).

La lista de diccionarios oficiales se describe en [`dictionaries/manifest.json`](dictionaries/manifest.json).

## Tipos y formato de diccionario

| Tipo | Finalidad |
|---|---|
| core | Traducción de la interfaz de Alchemy |
| system | Terminología del sistema de juego |
| custom | Extensiones opcionales de la comunidad |
| user | Modificaciones personales |

Varios diccionarios de sistema pueden estar activos a la vez. Las modificaciones del usuario siempre tienen prioridad.

Un diccionario es un archivo JSON. Las claves son los textos en inglés tal como los muestra Alchemy:

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

Las entradas también pueden contener `{variables}` (`"{n} dice rolled"`), variantes de plural (`"{n} comments|one"`, `|few`, `|many`, `|other`) y variantes que dependen del contexto. Consulta el [registro de cambios](CHANGELOG.md) (en inglés) para el detalle de cada función. Las fechas y las horas en formato de 12 horas escritas en inglés se muestran en el idioma del diccionario core activo.

## Actualizaciones

A-Translator puede descubrir los diccionarios oficiales en GitHub, importarlos, detectar nuevas versiones y actualizar cada módulo por separado. Un diccionario solo se actualiza cuando aumenta su `dictVersion`.

Compatibilidad: la versión 2.3.0 se probó con Alchemy 1.45.0. Las actualizaciones de Alchemy pueden cambiar algunos textos; los diccionarios se actualizan en consecuencia.

Las instalaciones de la versión 1 se migran automáticamente, sin ninguna conversión manual.

## Contribuir

Las contribuciones son bienvenidas:

- Revisiones y correcciones de los diccionarios en español, neerlandés, polaco y portugués de Brasil
- Nuevas traducciones core: copia [`models/XX-core.json`](models/XX-core.json), que contiene todas las claves por traducir, y rellena los valores (no modifiques las claves, espacios incluidos)
- Diccionarios de sistemas de juego (consulta [`models/XX-dd5.json`](models/XX-dd5.json))
- Documentación

Cuando un diccionario cambia, aumenta su `dictVersion` (en el archivo **y** en `manifest.json`); si no, los usuarios no recibirán la actualización. Un flujo de validación ([`tools/valider-dictionnaires.mjs`](tools/valider-dictionnaires.mjs)) comprueba los diccionarios, las plantillas y el script en cada push y pull request.

Repositorio: https://github.com/BriocheMasquee/a-translator

## Restablecer

**Delete all modules** (Eliminar todos los módulos) borra los diccionarios instalados, las modificaciones del usuario y los ajustes de traducción. El userscript en sí sigue instalado.

## Aviso legal y licencia

*Alchemy* es © Arboreal, LLC. A-Translator es un proyecto comunitario no oficial y no está afiliado a Arboreal, LLC.

Publicado bajo la [licencia MIT](LICENSE).
