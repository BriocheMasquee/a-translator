#!/bin/bash
# Builds "Alchemy Launcher.app": a double-clickable launcher that needs neither a terminal,
# nor this folder, nor Claude. Everything it needs is copied inside the app.
#
#   bash app/build-launcher.sh [destination.app]
#
# Rebuild it whenever a-translator.user.js, inject.mjs, cdp.mjs, cdp-pipe.mjs, update.mjs or retry.mjs change.
#
# The app is a small AppleScript applet (a real macOS app) that starts Contents/Resources/launcher.sh
# in the background. Being a real app matters: a second double-click is delivered to it ("reopen")
# instead of making macOS complain that "the application is no longer open".
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
OUT="${1:-$HERE/Alchemy Launcher.app}"
BUNDLE_ID="${ATX_BUNDLE_ID:-local.alchemy-launcher}"

NODE="$(command -v node || true)"
[ -n "$NODE" ] || { echo "Node.js introuvable."; exit 1; }
node -e 'process.exit(typeof WebSocket==="function"?0:1)' || { echo "Node 22 ou plus récent requis."; exit 1; }
# The script is at <project>/a-translator/ in the working folder and at <repo>/userscript/ in the GitHub repository.
SCRIPT_JS=""
for c in "${ATX_SCRIPT:-}" "$ROOT/a-translator/a-translator.user.js" "$HERE/../../userscript/a-translator.user.js"; do
  if [ -n "$c" ] && [ -f "$c" ]; then SCRIPT_JS="$c"; break; fi
done
[ -n "$SCRIPT_JS" ] || { echo "a-translator.user.js introuvable (ATX_SCRIPT, $ROOT/a-translator/ ou <dépôt>/userscript/)"; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cat > "$TMP/main.applescript" <<'APPLESCRIPT'
global startedAt

on run
	set startedAt to current date
	set res to (POSIX path of (path to me)) & "Contents/Resources/"
	set dry to ""
	try
		if (system attribute "ATX_DRY_RUN") is "1" then set dry to "ATX_DRY_RUN=1 "
	end try
	do shell script "rm -f \"$HOME/Library/Caches/alchemy-launcher.pid\"; " & dry & "/bin/bash " & quoted form of (res & "launcher.sh") & " >/dev/null 2>&1 &"
end run

-- Double-click while the launcher is already active.
on reopen
	display notification "Le lanceur est déjà actif : Alchemy tourne avec la traduction." with title "Alchemy Launcher"
end reopen

-- Stay alive while launcher.sh runs (it keeps its PID in a file), then quit.
on idle
	if startedAt is missing value then return 5
	if ((current date) - startedAt) < 20 then return 3
	try
		do shell script "kill -0 \"$(cat \"$HOME/Library/Caches/alchemy-launcher.pid\")\""
	on error
		quit
	end try
	return 3
end idle
APPLESCRIPT

rm -rf "$OUT"
osacompile -s -o "$OUT" "$TMP/main.applescript"

RES="$OUT/Contents/Resources"
cp -X "$HERE/inject.mjs" "$HERE/cdp.mjs" "$HERE/update.mjs" "$HERE/retry.mjs" "$HERE/cdp-pipe.mjs" "$SCRIPT_JS" "$RES/"
printf '%s' "$NODE" > "$RES/node-path"
# Icon: A-Translator's (app/icone/a-translator.icns, drawn from app/icone/a-translator.svg).
# Falls back to Alchemy's own icon if the file is missing.
if [ -f "$HERE/icone/a-translator.icns" ]; then
  cp -X "$HERE/icone/a-translator.icns" "$RES/applet.icns"
else
  cp -X /Applications/Alchemy.app/Contents/Resources/icon.icns "$RES/applet.icns" 2>/dev/null || true
fi

cat > "$RES/launcher.sh" <<'LAUNCHER'
#!/bin/bash
# Starts the Alchemy desktop app with A-Translator injected, then stays alive while Alchemy runs.
# Log: ~/Library/Logs/Alchemy Launcher.log
export LANG=fr_FR.UTF-8 LC_ALL=fr_FR.UTF-8
RES="$(cd "$(dirname "$0")" && pwd)"
PIDFILE="$HOME/Library/Caches/alchemy-launcher.pid"
echo $$ > "$PIDFILE"
trap 'rm -f "$PIDFILE"' EXIT

LOG="$HOME/Library/Logs/Alchemy Launcher.log"
[ -f "$LOG" ] && [ "$(stat -f%z "$LOG")" -gt 1000000 ] && : > "$LOG"
exec >>"$LOG" 2>&1
echo "=== $(date '+%F %T') ==="

notify() { osascript -e "display notification \"$1\" with title \"Alchemy Launcher\"" >/dev/null 2>&1 || true; }
alert()  { osascript -e "display dialog \"$1\" with title \"Alchemy Launcher\" buttons {\"OK\"} default button 1 with icon caution" >/dev/null 2>&1 || true; }

# Node: the path found at build time, then the usual places (Finder gives apps a minimal PATH).
NODE=""
for c in "$(cat "$RES/node-path" 2>/dev/null)" /opt/homebrew/bin/node /usr/local/bin/node; do
  if [ -n "$c" ] && [ -x "$c" ]; then NODE="$c"; break; fi
done
if [ -z "$NODE" ]; then
  for c in "$HOME"/.nvm/versions/node/*/bin/node; do [ -x "$c" ] && NODE="$c"; done
fi
if [ -z "$NODE" ] || ! "$NODE" -e 'process.exit(typeof WebSocket==="function"?0:1)'; then
  echo "node introuvable ou trop ancien (22+ requis)"
  alert "Node.js 22 ou plus récent est requis, et il est introuvable."
  exit 1
fi

if [ "${ATX_DRY_RUN:-}" = "1" ]; then
  echo "dry-run ok : node=$NODE ($("$NODE" --version)) ressources=$(ls "$RES" | tr '\n' ' ')"
  exit 0
fi

# --- helpers (the tests replace some of them through ATX_TEST_STUBS) ---------------------------
alchemy_running() { pgrep -x Alchemy >/dev/null; }

# True when an Alchemy process runs that was NOT started with the debugging option: typically Alchemy
# updated itself and restarted on its own.
alchemy_running_without_port() {
  local pid
  for pid in $(pgrep -x Alchemy); do
    ps -p "$pid" -o command= 2>/dev/null | grep -Eq -- "--remote-debugging-(port=|pipe)" || return 0
  done
  return 1
}

quit_alchemy() {
  osascript -e 'tell application "Alchemy" to quit' >/dev/null 2>&1 || true
  for _ in $(seq 1 30); do alchemy_running || return 0; sleep 0.5; done
  ! alchemy_running
}

open_alchemy() { open -a Alchemy --args "--remote-debugging-port=$1"; }
run_injector() { "$NODE" "$RES/inject.mjs" "$1" "$RES/a-translator.user.js"; }

# "Pipe" mode (opt-in): the injector starts Alchemy itself and talks to it through two pipes: no debugging port is opened.
# Enable with ATX_PIPE=1 or an empty file "mode-tube" in ~/Library/Application Support/Alchemy Launcher/.
# Downside: Alchemy then lives and dies with the injector (stopping the launcher closes Alchemy).
ALCHEMY_BIN="${ATX_ALCHEMY_BIN:-/Applications/Alchemy.app/Contents/MacOS/Alchemy}"
use_pipe() {
  { [ "${ATX_PIPE:-}" = "1" ] || [ -f "$HOME/Library/Application Support/Alchemy Launcher/mode-tube" ]; } && [ -x "$ALCHEMY_BIN" ]
}
run_injector_pipe() { "$NODE" "$RES/inject.mjs" --pipe-app "$ALCHEMY_BIN" "$RES/a-translator.user.js"; }

ask_first_start() {
  osascript -e 'button returned of (display dialog "Alchemy est déjà ouvert sans la traduction. Pour l’activer, il doit être fermé puis relancé par ce lanceur." with title "Alchemy Launcher" buttons {"Annuler", "Fermer Alchemy et relancer"} default button 2 with icon note)' 2>/dev/null || echo "Annuler"
}

# Alchemy restarted by itself without the translation: ask before closing it again (an unsent message would be lost).
ask_relaunch() {
  osascript -e 'button returned of (display dialog "Alchemy a redémarré sans la traduction (probablement après une mise à jour). Le relancer avec la traduction ? Il sera fermé puis rouvert." with title "Alchemy Launcher" buttons {"Pas maintenant", "Relancer avec la traduction"} default button 2 with icon note giving up after 300)' 2>/dev/null || echo "Pas maintenant"
}

[ -n "${ATX_TEST_STUBS:-}" ] && . "$ATX_TEST_STUBS"

# An app that is already running ignores startup options, so it has to be restarted.
if alchemy_running; then
  ans=$(ask_first_start)
  if [ "$ans" != "Fermer Alchemy et relancer" ]; then echo "annulé par l'utilisateur"; exit 0; fi
  if ! quit_alchemy; then
    echo "Alchemy ne s'est pas fermé"
    alert "Alchemy ne s’est pas fermé. Fermez-le (Cmd+Q), puis rouvrez le lanceur."
    exit 1
  fi
fi

MAX_RELAUNCHES=3
GRACE="${ATX_GRACE_SECONDS:-6}"
relaunches=0
while :; do
  if use_pipe; then
    echo "mode tube : aucun port de débogage"
    [ "$relaunches" -eq 0 ] && notify "Alchemy démarre avec la traduction."
    run_injector_pipe
  else
    PORT=$((20000 + RANDOM % 20000))   # local (127.0.0.1) debugging port, only while Alchemy runs
    echo "port $PORT"
    if ! open_alchemy "$PORT"; then
      alert "Impossible de lancer Alchemy."
      exit 1
    fi
    [ "$relaunches" -eq 0 ] && notify "Alchemy démarre avec la traduction."
    run_injector "$PORT"
  fi
  echo "injecteur terminé (code $?)"

  # If Alchemy updated itself it restarts a few seconds later without the option: wait for it to reappear.
  for _ in $(seq 1 "$GRACE"); do alchemy_running && break; sleep 1; done
  alchemy_running_without_port || break

  if [ "$relaunches" -ge "$MAX_RELAUNCHES" ]; then
    echo "trop de relances ($relaunches) : abandon"
    notify "Alchemy continue de redémarrer sans la traduction. Fermez-le puis rouvrez le lanceur."
    break
  fi
  ans=$(ask_relaunch)
  if [ "$ans" != "Relancer avec la traduction" ]; then
    echo "relance refusée ou sans réponse"
    break
  fi
  relaunches=$((relaunches + 1))
  echo "relance $relaunches : fermeture d'Alchemy puis nouveau départ"
  if ! quit_alchemy; then
    echo "Alchemy ne s'est pas fermé"
    alert "Alchemy ne s’est pas fermé. Fermez-le (Cmd+Q), puis rouvrez le lanceur."
    break
  fi
done
LAUNCHER
chmod +x "$RES/launcher.sh"

PL="$OUT/Contents/Info.plist"
plutil -replace CFBundleIdentifier -string "$BUNDLE_ID" "$PL"
plutil -replace CFBundleName -string "Alchemy Launcher" "$PL"
plutil -replace LSUIElement -bool true "$PL"
# Use applet.icns (Alchemy's icon) instead of the default AppleScript icon from Assets.car.
plutil -remove CFBundleIconName "$PL" 2>/dev/null || true
rm -f "$RES/Assets.car"
plutil -replace NSAppleEventsUsageDescription -string "Le lanceur ferme Alchemy, à votre demande, avant de le relancer avec la traduction." "$PL"
# osacompile adds generic English "This script needs access to your camera to run." texts. Only the camera and microphone can
# matter (in "pipe" mode Alchemy is a child of the launcher, so macOS may ask on its behalf): say it clearly, drop the rest.
for k in NSAppleMusicUsageDescription NSCalendarsUsageDescription NSContactsUsageDescription NSHomeKitUsageDescription NSPhotoLibraryUsageDescription NSRemindersUsageDescription NSSiriUsageDescription NSSystemAdministrationUsageDescription; do
  plutil -remove "$k" "$PL" 2>/dev/null || true
done
plutil -replace NSCameraUsageDescription -string "Alchemy, lancé par ce lanceur en « mode tube », demande la caméra pour le chat vidéo. Sans le mode tube, cette demande n’apparaît pas." "$PL"
plutil -replace NSMicrophoneUsageDescription -string "Alchemy, lancé par ce lanceur en « mode tube », demande le micro pour le chat vocal. Sans le mode tube, cette demande n’apparaît pas." "$PL"
plutil -lint "$PL" >/dev/null

# codesign refuses extended attributes ("detritus") that Finder/iCloud add to files in ~/Documents.
xattr -cr "$OUT" 2>/dev/null || true
if ! codesign --force --deep -s - "$OUT" 2>"$TMP/codesign.err" || ! codesign --verify --deep --strict "$OUT" 2>>"$TMP/codesign.err"; then
  echo "Échec de la signature locale :"; cat "$TMP/codesign.err"; exit 1
fi
echo "signature locale (ad hoc) : ok"
echo "Construit : $OUT"

# Copies that were moved elsewhere (e.g. /Applications) are rebuilt too: list them, one path per
# line, in desktop/launcher-destinations.txt. Only when no explicit destination was given.
LIST="$HERE/launcher-destinations.txt"
if [ -z "${1:-}" ] && [ -f "$LIST" ] && [ -z "${ATX_NO_RECURSE:-}" ]; then
  while IFS= read -r dest || [ -n "$dest" ]; do
    case "$dest" in ""|\#*) continue ;; esac
    if [ -d "$(dirname "$dest")" ]; then
      ATX_NO_RECURSE=1 bash "$0" "$dest" || echo "Échec de la reconstruction de : $dest"
    else
      echo "Ignoré (dossier introuvable) : $dest"
    fi
  done < "$LIST"
fi
