# Odoo App-Ausblender (Chrome)

Blendet die Odoo-Apps aus, die du nicht brauchst.

## Installieren (Chrome, Edge, Brave)

1. **[odoo-app-hider.zip](https://github.com/Gary361/odoo-app-hider/releases/latest/download/odoo-app-hider.zip)** herunterladen und entpacken.
2. `chrome://extensions` öffnen und oben rechts den **Entwicklermodus** einschalten.
3. **Entpackte Erweiterung laden** und den entpackten Ordner auswählen.
4. Den Ordner danach nicht löschen, sonst verschwindet die Erweiterung.

Chrome installiert Erweiterungen außerhalb des Web Stores nicht per Klick, deshalb der Umweg über den Entwicklermodus.

## Benutzen

1. Die Odoo-Startseite einmal öffnen, damit die Erweiterung deine Apps kennt.
2. Auf das Erweiterungs-Icon klicken (ggf. über das Puzzle-Symbol anpinnen).
3. Häkchen entfernen blendet eine App aus, Häkchen setzen holt sie zurück. **Alle einblenden** setzt alles zurück.

Funktioniert auf `datadiorama.digisoolut.co` und `servicedesk.datadiorama.com`.

## Aktualisieren

Neue ZIP über denselben Link laden, den alten Ordner damit ersetzen und in `chrome://extensions` bei der Erweiterung auf **Neu laden** klicken.

## Release (für mich)

Einmalig: [GitHub CLI](https://cli.github.com) installieren und `gh auth login` ausführen.

`./release.sh ship 1.1.0` setzt die Version, baut `odoo-app-hider.zip`, erstellt das GitHub-Release und pusht. Der Download-Link oben zeigt danach automatisch auf die neue Version.
