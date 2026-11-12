# Hypertrophy Tracker – installierbare PWA

## Installation auf dem iPhone

1. Lade alle Dateien aus diesem Ordner auf einen **HTTPS-Webhost** (z. B. GitHub Pages, Netlify oder Cloudflare Pages). Die Dateien müssen im selben Verzeichnis liegen.
2. Öffne die HTTPS-Adresse in **Safari**.
3. Tippe auf **Teilen → Zum Home-Bildschirm → Hinzufügen**.
4. Öffne die App einmal mit Internetverbindung. Danach funktioniert sie offline.

**Wichtig:** Direktes Öffnen von `index.html` aus der Dateien-App installiert keine vollwertige Offline-PWA. Für den Service Worker ist HTTPS (oder localhost) nötig.

## Vorbelegte Daten
- 03.08.2026: 79,0 kg, 17,2 % KFA
- 24.08.2026: 80,7 kg, 11,9 % KFA
- 11.11.2026: 84,7 kg, 15,0 % KFA; 35,2 kg SMM, segmentale Daten
- 11 PPL-Einheiten bis 24.08. und 20 weitere bis 11.11. als Sammelwerte

## Datenschutz und Grenzen

Die Daten liegen ausschließlich im lokalen Browser-Speicher (localStorage). Es gibt kein Konto und keinen Server für Gesundheitsdaten. Ein Löschen der Website-Daten kann die Daten entfernen. Deshalb regelmäßig JSON-Backups exportieren. Bei einem Wechsel der Domain sind die lokalen Daten nicht automatisch übertragbar.

Das mathematische Sättigungsmodell ist eine **illustrative Szenariofunktion**, keine wissenschaftlich validierte persönliche Prognose. Es wird nur angezeigt, wenn zwei Messungen einen FFMI-Anstieg zeigen und die Anzahl der Trainingseinheiten bekannt ist. Die Messwerte sind BIA-Schätzungen und keine direkte Muskelmassenmessung.


## Version 2
Mehrfachauswahl von FFMI, Gesamt-SMM, Torso, beiden Armen, beiden Beinen und KFA. Segmentale Prognosen benötigen mindestens zwei Messungen mit Werten für die betreffende Region. KFA wird nie prognostiziert. X-Achse umschaltbar (Einheiten/Datum), Frequenzslider 0–7 Einheiten pro Woche. Für GitHub Pages alle Dateien im Repo-Hauptverzeichnis hochladen. Browserdaten werden mit dem v1-Schlüssel weiterverwendet.

## Version 3
- Historische SMM-Werte ergänzt: 03.08. 33,9 kg (Torso 16,3; Arme je 2,2; Beine je 6,6), 24.08. 34,5 kg (Torso 16,7; Arme je 2,3; Beine je 6,6).
- Automatische Y-Achsen-Skalierung anhand der ausgewählten Reihen und Prognosen, ohne erzwungenen Nullpunkt.
- Vorhandene lokale Datensätze werden bei fehlenden historischen Segmentfeldern ergänzt, ohne vorhandene Eingaben zu überschreiben.

## Version 4
Prognosekalibrierung verwendet die erste und letzte verfügbare Messung statt nur der letzten beiden. Damit verhindert eine durch Rundung bedingte Plateau-Messung nicht automatisch die Prognose. Bei insgesamt null oder negativem Trend bleibt die Prognose deaktiviert.
