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

## Version 5
Messungen erhalten eine kumulative Trainingseinheitsnummer (0 = Ausgangspunkt). Historische Messungen: 0, 11, 31. Das Diagramm und die Prognose nutzen diese Nummern vorrangig; ältere Backups werden ergänzt.

## Version 6
Trainingstagebuch und Training-Reiter entfernt. Kumulative Trainingseinheiten werden ausschließlich bei jeder Messung erfasst. Bestehende Messungen und Daten bleiben erhalten.

## Version 7
Alle Messungen können über 'Bearbeiten' in der Messhistorie nachträglich geändert werden (Datum, Einheitsnummer, Gewicht, KFA, Muskelmassen, Notiz). Speichern ersetzt den bestehenden Eintrag unter Beibehaltung der ID; Abbrechen verwirft Änderungen. Datum-Duplikate und unplausible Einheitsreihenfolge werden abgefangen.


## Version 8
- Fettfreie Masse in kg als zusätzliche Datenreihe in Diagramm und Prognosetabelle (aus Gewicht und KFA berechnet).
- Prognoserechner: Datum zu FFMI/FFM/SMM/Segmentwert und Zielwert zu rechnerischem Datum.
- Trainingsfrequenz 0–7 Einheiten/Woche aus dem vorhandenen Slider; 0 deaktiviert datumsbezogene Prognosen.
- Die inverse Funktion weist Werte oberhalb des hypothetischen Modellgrenzwerts zurück.
- Keine Prognose für Körperfettanteil.

Version 9: Korrektur der inversen Zielwert-zu-Datum-Prognose.

## v10: Modellwahl
- Bestehender exponentieller Sättigungsfit bleibt auswählbar.
- Alternativ robustes Ensemble aus exponentiellen und Gompertz-Sättigungskurven mit Huber-Verlust, BIA-Messfehlerannahmen und Regularisierung.
- Schattierte heuristische Prognosebandbreiten und Zielwert→Datum mit möglichem Zeitfenster.
- Keine statistisch kalibrierten Konfidenzintervalle; nur drei Ausgangsmessungen sind für eine individuelle Prognose unzureichend.

## Version 11
Entfernt die Prognosebandbreiten aus Diagramm und Rechner. Beide Modelle können per Checkbox im selben Diagramm überlagert werden: gewähltes Modell gestrichelt, Vergleichsmodell gepunktet. Die Modellauswahl bleibt für Tabelle und Zielwert-Rechner maßgeblich.
