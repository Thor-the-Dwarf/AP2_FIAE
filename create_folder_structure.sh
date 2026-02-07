#!/bin/bash

# Script to create complete folder structure based on ThemenGliederung.pdf
# Base directory
BASE_DIR="database"

# Create directories and txt files
# Format: create_folder "path" "txt_content"
create_folder() {
    local path="$1"
    local content="$2"
    local txt_name=$(basename "$path")
    
    mkdir -p "$BASE_DIR/$path"
    echo "$content" > "$BASE_DIR/$path/${txt_name}.txt"
    echo "✓ Created: $path"
}

echo "=== Creating folder structure from ThemenGliederung.pdf ==="
echo ""

# Already exists - skipping:
# 01 Informieren und Beraten von Kunden und Kundinnen
# 02 Entwickeln, Erstellen und Betreuen von IT-Lösungen

# Complete missing folders in section 01
echo "Completing Section 01..."
# 01 already exists
# 02 already exists  
# 03 already exists

# Complete missing folders in section 02
echo "Completing Section 02..."
# 01 already exists
# 02 already exists
# 03 already exists
# 04 is missing
create_folder "02 Entwickeln, Erstellen und Betreuen von IT-Lösungen/04 Betriebliche Handlungsfelder" "IT-Lösungen betreuen, Wartung und Support"

# Create Section 03
echo "Creating Section 03..."
create_folder "03 Durchführen und Dokumentieren von qualitätssichernden Maßnahmen" "Qualitätssichernde Maßnahmen"

create_folder "03 Durchführen und Dokumentieren von qualitätssichernden Maßnahmen/01 Fehler erkennen analysieren und beheben" "Debugging, Software-Testverfahren (Black Box, White Box, Greybox), Versionsmanagement (z. B. Git, SVN)"

create_folder "03 Durchführen und Dokumentieren von qualitätssichernden Maßnahmen/02 Algorithmen formulieren und Programme entwickeln" "Kontrollstrukturen (Sequenz, Auswahl, Wiederholung), UML (Use Case-, Klassen-, Aktivitätsdiagramm), Softwareergonomie"

create_folder "03 Durchführen und Dokumentieren von qualitätssichernden Maßnahmen/03 Datenbanken modellieren und erstellen" "Relational/NoSQL, Datentypen, Normalisierung, ER-Modell, SQL"

# Create Section 04
echo "Creating Section 04..."
create_folder "04 Umsetzen Integrieren und Prüfen von Maßnahmen zur IT-Sicherheit und zum Datenschutz" "IT-Sicherheit und Datenschutz"

create_folder "04 Umsetzen Integrieren und Prüfen von Maßnahmen zur IT-Sicherheit und zum Datenschutz/01 Bedrohungsszenarien erkennen und Schadenspotenziale bewerten" "Bedrohungsanalyse, Risikoanalyse, Schadenspotenziale"

create_folder "04 Umsetzen Integrieren und Prüfen von Maßnahmen zur IT-Sicherheit und zum Datenschutz/02 Maßnahmen zur IT-Sicherheit und zum Datenschutz umsetzen" "Verschlüsselung, Authentifizierung, Firewall, DSGVO, BDSG"

create_folder "04 Umsetzen Integrieren und Prüfen von Maßnahmen zur IT-Sicherheit und zum Datenschutz/03 Wirksamkeit und Effizienz der umgesetzten Maßnahmen prüfen" "Penetrationstests, Sicherheitsaudits, Monitoring"

# Create Section 05
echo "Creating Section 05..."
create_folder "05 Erbringen von Serviceleistungen und Beauftragen von Dienstleistern" "Serviceleistungen und Dienstleister"

create_folder "05 Erbringen von Serviceleistungen und Beauftragen von Dienstleistern/01 Anfragen bearbeiten" "Ticketsysteme, Anforderungsanalyse, Kundenbetreuung"

create_folder "05 Erbringen von Serviceleistungen und Beauftragen von Dienstleistern/02 Leistungen nach Vorgaben und Verträgen erbringen" "SLA (Service Level Agreement), Vertragsmanagement"

create_folder "05 Erbringen von Serviceleistungen und Beauftragen von Dienstleistern/03 Leistungserbringung kontrollieren und protokollieren" "Monitoring, Reporting, Dokumentation"

create_folder "05 Erbringen von Serviceleistungen und Beauftragen von Dienstleistern/04 Störungen analysieren und beheben" "Fehleranalyse, Troubleshooting, Incident Management"

# Create Section 06
echo "Creating Section 06..."
create_folder "06 Betreiben von IT-Systemen" "Betrieb von IT-Systemen"

create_folder "06 Betreiben von IT-Systemen/01 IT-Systeme zur Bearbeitung betrieblicher Fachaufgaben einsetzen" "Anwendungssysteme, ERP, CRM"

create_folder "06 Betreiben von IT-Systemen/02 Verfügbarkeit und Qualität von IT-Systemen überwachen und gewährleisten" "Monitoring, Wartung, Backup-Strategien"

create_folder "06 Betreiben von IT-Systemen/03 Störungen analysieren und beheben" "Fehleranalyse, Troubleshooting"

# Create Section 07
echo "Creating Section 07..."
create_folder "07 Planen eines Softwareproduktes" "Softwareplanung"

create_folder "07 Planen eines Softwareproduktes/01 Kundenanforderungen analysieren" "Anforderungsanalyse, User Stories, Use Cases"

create_folder "07 Planen eines Softwareproduktes/02 Vorgehensmodell auswählen" "Wasserfallmodell, agile Methoden (Scrum, Kanban), V-Modell"

create_folder "07 Planen eines Softwareproduktes/03 Projektergebnisse dokumentieren und präsentieren" "Projektdokumentation, Präsentationstechniken"

# Create Section 08
echo "Creating Section 08..."
create_folder "08 Entwickeln und Umsetzen von Algorithmen" "Algorithmen entwickeln"

create_folder "08 Entwickeln und Umsetzen von Algorithmen/01 Algorithmen formulieren und darstellen" "Pseudocode, Struktogramme, Flussdiagramme"

create_folder "08 Entwickeln und Umsetzen von Algorithmen/02 Algorithmen implementieren" "Programmiersprachen, Datenstrukturen, Komplexität"

create_folder "08 Entwickeln und Umsetzen von Algorithmen/03 Algorithmen in Bezug auf Eignung beurteilen" "Laufzeitanalyse, O-Notation, Effizienz"

# Create Section 09
echo "Creating Section 09..."
create_folder "09 Entwickeln von Anwendungen" "Anwendungsentwicklung"

create_folder "09 Entwickeln von Anwendungen/01 Programmiersprachen anwenden" "OOP, funktionale Programmierung, Syntax"

create_folder "09 Entwickeln von Anwendungen/02 Entwicklungswerkzeuge einsetzen" "IDE, Debugger, Versionsverwaltung"

create_folder "09 Entwickeln von Anwendungen/03 Bibliotheken und Frameworks nutzen" "Frameworks, APIs, Libraries"

# Create Section 10
echo "Creating Section 10..."
create_folder "10 Sicherstellen der Qualität von Softwareanwendungen" "Qualitätssicherung"

create_folder "10 Sicherstellen der Qualität von Softwareanwendungen/01 Testkonzepte erstellen und Tests durchführen" "Unit-Tests, Integrationstests, Systemtests"

create_folder "10 Sicherstellen der Qualität von Softwareanwendungen/02 Werkzeuge zur Qualitätssicherung einsetzen" "Testing-Frameworks, Code-Review-Tools, CI/CD"

create_folder "10 Sicherstellen der Qualität von Softwareanwendungen/03 Ursachen von Fehlern systematisch feststellen beheben und dokumentieren" "Debugging, Fehleranalyse, Bug-Tracking"

# Create Section 11
echo "Creating Section 11..."
create_folder "11 Bereitstellen von Softwareanwendungen" "Software bereitstellen"

create_folder "11 Bereitstellen von Softwareanwendungen/01 Softwareanwendungen konfigurieren" "Konfigurationsmanagement, Deployment"

create_folder "11 Bereitstellen von Softwareanwendungen/02 Softwareanwendungen an Kunden übergeben" "Rollout, Schulung, Dokumentation"

create_folder "11 Bereitstellen von Softwareanwendungen/03 Softwareanwendungen einführen" "Change Management, Migration"

echo ""
echo "=== Folder structure creation complete! ==="
echo ""
echo "Summary of created structure:"
find "$BASE_DIR" -type d | sort
