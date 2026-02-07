#!/bin/bash

# Script to add Mikrothemen txt files to all folders based on PDF content
BASE_DIR="database"

echo "=== Adding Mikrothemen txt files to all folders ==="
echo ""

# Function to create/update txt file
create_txt() {
    local file_path="$1"
    local content="$2"
    echo "$content" > "$file_path"
    echo "✓ Created: $file_path"
}

# Teil01 - Grundlagen
echo "Adding Mikrothemen to Teil01 - Grundlagen..."

create_txt "$BASE_DIR/Teil01 - Grundlagen/Teil01 - Grundlagen.txt" "Fachrichtungsübergreifende berufsprofilgebende Fertigkeiten, Kenntnisse und Fähigkeiten

Themen:
- Informieren und Beraten von Kunden und Kundinnen
- Entwickeln, Erstellen und Betreuen von IT-Lösungen
- Durchführen und Dokumentieren von qualitätssichernden Maßnahmen
- Umsetzen, Integrieren und Prüfen von Maßnahmen zur IT-Sicherheit und zum Datenschutz
- Erbringen von Serviceleistungen und Beauftragen von Dienstleistern"

create_txt "$BASE_DIR/Teil01 - Grundlagen/01 Informieren und Beraten von Kunden und Kundinnen/01 Informieren und Beraten von Kunden und Kundinnen.txt" "Kommunikation:
- Aktives Zuhören
- Kommunikationsmodelle (Telefonkonferenzen, Chat, virtuelle Teambesprechung)
- Verkaufsgespräche (Anfrage, Angebot, Auftrag)
- Analyse der Kundenbedürfnisse

Recht & Compliance:
- BGB/HGB
- Gesetz gegen unlauteren Wettbewerb (UWG)
- AGB-Gesetz
- Compliance, Regelkonformität
- Customer Relationship Management (CRM)

Präsentation:
- Präsentationstechnik
- Visualisierung (Diagramme, Bildbearbeitung, Videos)
- Tabellenkalkulation, Präsentationsprogramme
- Erstellung multimedialer Inhalte
- Corporate Identity (CI)"

create_txt "$BASE_DIR/Teil01 - Grundlagen/02 Entwickeln, Erstellen und Betreuen von IT-Lösungen/02 Entwickeln, Erstellen und Betreuen von IT-Lösungen.txt" "Fehleranalyse:
- Debugging, Breakpoints
- Software-Testverfahren (Black Box, White Box, Review, Extremwerttest)
- Testdaten, Komponententest, Integrationstest, Systemtest

Entwicklung:
- Versionsmanagement (Git/SVN)
- Algorithmenformulierung (Aktivitätsdiagramm, Pseudocode)
- UML (Use Case, Klassendiagramm)
- Software-Ergonomie, Barrierefreiheit

Datenbanken:
- Relationale und NoSQL Datenbanken
- Datentypen (Bool, Integer, Float, Date, BLOB, Geokoordinaten)
- Anomalien/Redundanzen, Normalisierung (1.-3. NF)
- ER-Modell (Attribute, Beziehungen, Kardinalitäten, Keys)
- SQL (DDL, DML, Joins, Aggregat-Funktionen)
- OpenData, API-Schnittstellen"

create_txt "$BASE_DIR/Teil01 - Grundlagen/03 Durchführen und Dokumentieren von qualitätssichernden Maßnahmen/03 Durchführen und Dokumentieren von qualitätssichernden Maßnahmen.txt" "Qualitätssicherung:
- Ursachen von Qualitätsmängeln feststellen, dokumentieren und beseitigen
- Kennzahlen, Audits

IT-Sicherheit:
- Schutzziele (Vertraulichkeit, Integrität, Verfügbarkeit)

QM-Prozess:
- PDCA-Zyklus
- KVP (Kontinuierlicher Verbesserungsprozess)
- Soll-Ist-Vergleiche
- Testdatengeneratoren, Testprotokolle
- Abnahmeprotokoll"

create_txt "$BASE_DIR/Teil01 - Grundlagen/04 Umsetzen Integrieren und Prüfen von Maßnahmen zur IT-Sicherheit und zum Datenschutz/04 Umsetzen Integrieren und Prüfen von Maßnahmen zur IT-Sicherheit und zum Datenschutz.txt" "Bedrohungsszenarien:
- Schadenspotenziale (Imageschaden, wirtschaftlicher Schaden, Datenverlust)
- Datendiebstahl, Ransomware, Phishing

Maßnahmen:
- IT-Grundschutzmodellierung
- Security by Design
- Technisch-Organisatorische Maßnahmen (TOM):
  * Zutrittskontrolle (Alarm, Video)
  * Zugangskontrolle (Passwort, Biometrie)
  * Zugriffskontrolle (Verschlüsselung, Rollenkonzepte)

Prüfung:
- Schwachstellenidentifikation
- Log Management
- Compliance Reports"

create_txt "$BASE_DIR/Teil01 - Grundlagen/05 Erbringen von Serviceleistungen und Beauftragen von Dienstleistern/05 Erbringen von Serviceleistungen und Beauftragen von Dienstleistern.txt" "Service Management:
- Incident Management (Ticketsystem)
- SLA (Service Level Agreements)
- Eskalationsstufen
- SOP (Standard Operation Procedures)

Dienstleister:
- Anfragen bearbeiten
- Leistungen nach Vorgaben und Verträgen erbringen
- Leistungserbringung kontrollieren und protokollieren
- Störungen analysieren und beheben"

# Teil02 - FIEA spezifisch
echo ""
echo "Adding Mikrothemen to Teil02 - FIEA spezifisch..."

create_txt "$BASE_DIR/Teil02 - FIEA spezifisch/Teil02 - FIEA spezifisch.txt" "Berufsprofilgebende Fertigkeiten, Kenntnisse und Fähigkeiten in der Fachrichtung Anwendungsentwicklung

Themen:
- Betreiben von IT-Systemen
- Planen eines Softwareproduktes
- Entwickeln und Umsetzen von Algorithmen
- Entwickeln von Anwendungen
- Sicherstellen der Qualität von Softwareanwendungen
- Bereitstellen von Softwareanwendungen"

create_txt "$BASE_DIR/Teil02 - FIEA spezifisch/06 Betreiben von IT-Systemen/06 Betreiben von IT-Systemen.txt" "Netzwerk:
- OSI-Modell, TCP/IP
- IPv4/IPv6, MAC
- Routing, Switching, ARP, DNS, DHCP
- VPN, VLAN
- WLAN/Mesh-Security

Server & Cloud:
- Proxy, API (REST, SOAP)
- Cloud-Konzepte (SaaS, PaaS, IaaS)
- Virtualisierung (Hypervisor vs. Container)

Sicherung & Monitoring:
- Monitoring Tools (Zabbix, Nagios, Prometheus)
- SNMP, S.M.A.R.T.
- Disaster Recovery, USV, RAID
- Backups

Service:
- Incident Management (Ticketsystem)
- SLA (Service Level Agreements)
- Eskalationsstufen
- SOP (Standard Operation Procedures)
- Technische Dokumentationen (Benutzerhandbücher)"

create_txt "$BASE_DIR/Teil02 - FIEA spezifisch/07 Planen eines Softwareproduktes/07 Planen eines Softwareproduktes.txt" "Analyse & Planung:
- Softwareanforderungen (Wartbarkeit, Effizienz, Zuverlässigkeit)
- UML-Diagramme (Sequenz-, Zustands-, Klassen-Diagramm)
- Schnittstellen (XML, JSON, REST)
- Mock-ups/Prototypen

Vorgehensmodelle:
- Wasserfallmodell
- Agile Methoden (Scrum, Kanban)
- V-Modell

Projektmanagement:
- Projektergebnisse dokumentieren und präsentieren"

create_txt "$BASE_DIR/Teil02 - FIEA spezifisch/08 Entwickeln und Umsetzen von Algorithmen/08 Entwickeln und Umsetzen von Algorithmen.txt" "Algorithmen formulieren:
- Pseudocode, Struktogramme
- Aktivitätsdiagramme

Algorithmen implementieren:
- Programmiersprachen-Auswahl (Performance, Portabilität)
- Datenstrukturen
- Cyber-physische Systeme (Sensoren/Aktoren)
- Automatisierung (PowerShell, Bash, Python)

Algorithmen bewerten:
- Laufzeitanalyse, O-Notation
- Effizienz
- Suche (linear/binär)
- Sortieren (Bubble Sort, Selection Sort, Insertion Sort)"

create_txt "$BASE_DIR/Teil02 - FIEA spezifisch/09 Entwickeln von Anwendungen/09 Entwickeln von Anwendungen.txt" "Programmiersprachen:
- OOP (Objektorientierte Programmierung)
- Funktionale Programmierung

OO-Konzepte:
- Kapselung, Vererbung, Polymorphie
- Interfaces
- Fehlerbehandlung (Exceptions)

Design Patterns:
- Observer, Singleton, Factory
- MVC (Model-View-Controller)

Entwicklungswerkzeuge:
- IDE, Debugger
- Versionsverwaltung

Bibliotheken und Frameworks:
- Frameworks, APIs, Libraries"

create_txt "$BASE_DIR/Teil02 - FIEA spezifisch/10 Sicherstellen der Qualität von Softwareanwendungen/10 Sicherstellen der Qualität von Softwareanwendungen.txt" "Testkonzepte:
- Unit-Tests
- Integrationstests
- Systemtests
- Black Box/White Box Tests

Werkzeuge:
- Testing-Frameworks
- Code-Review-Tools
- CI/CD (Continuous Integration/Continuous Deployment)

Fehleranalyse:
- Debugging
- Refactoring
- Bug-Tracking
- Ursachen von Fehlern systematisch feststellen, beheben und dokumentieren"

create_txt "$BASE_DIR/Teil02 - FIEA spezifisch/11 Bereitstellen von Softwareanwendungen/11 Bereitstellen von Softwareanwendungen.txt" "Konfiguration:
- Konfigurationsmanagement
- Deployment

Übergabe:
- Rollout
- Schulung
- Dokumentation

Einführung:
- Change Management
- Migration
- Softwareanwendungen an Kunden übergeben"

# Teil03 - WISO
echo ""
echo "Adding Mikrothemen to Teil03 - WISO..."

create_txt "$BASE_DIR/Teil03 - WISO/Teil03 - WISO.txt" "Wirtschafts- und Sozialkunde

Themen:
- Der Ausbildungsbetrieb
- Geschäftsprozesse und betriebliche Organisation
- Kaufmännische Steuerung und Kontrolle"

create_txt "$BASE_DIR/Teil03 - WISO/01 Der Ausbildungsbetrieb/01 Der Ausbildungsbetrieb.txt" "Berufsausbildung sowie Arbeits- und Tarifrecht:
- Ausbildungsvertrag (BBiG)
- Jugendarbeitsschutzgesetz
- Tarifverträge (Mantel/Lohn)
- Streik/Aussperrung
- Duales System
- Lebensbegleitendes Lernen
- Lerntechniken (visuell, auditiv, motorisch)

Aufbau und Organisation:
- Betriebsrat, JAV
- Aufbauorganisation (Einlinien/Matrix/Stablinie)
- Rechtsformen (GmbH, AG, KG, OHG)

Sicherheit und Gesundheitsschutz:
- Arbeitsschutzgesetz
- Bildschirmarbeitsverordnung
- Ergonomie
- Brandschutz (Klassen, Feuerlöscher)
- Verhalten bei Unfällen (Ersthelfer, Meldekette)

Umweltschutz:
- Abfalltrennung
- Green IT (Energiesparen)
- Ressourcenschonung"

create_txt "$BASE_DIR/Teil03 - WISO/02 Geschäftsprozesse und betriebliche Organisation/02 Geschäftsprozesse und betriebliche Organisation.txt" "Betriebliche Organisation:
- Aufbauorganisation
- Ablauforganisation
- Geschäftsprozesse
- Wertschöpfungskette

Marktorientierung:
- Marktanalyse
- Marketing-Mix
- Vertriebskanäle
- Kundenbeziehungsmanagement

Beschaffung und Logistik:
- Beschaffungsprozess
- Lieferantenauswahl
- Lagerhaltung
- Just-in-Time

Vernetztes Zusammenarbeiten:
- Netiquette
- Social Engineering Gefahren
- Diversity, Gender-Neutralität
- Ethik in der IT
- Datenschutz/Persönlichkeitsrechte im virtuellen Raum"

create_txt "$BASE_DIR/Teil03 - WISO/03 Kaufmännische Steuerung und Kontrolle/03 Kaufmännische Steuerung und Kontrolle.txt" "Grundlagen des Rechnungswesens:
- Buchführung
- Bilanz
- GuV (Gewinn- und Verlustrechnung)
- Kostenrechnung

Controlling und Finanzierung:
- Controlling-Instrumente
- Kennzahlen
- Finanzierungsarten
- Investitionsrechnung"

echo ""
echo "=== Mikrothemen txt files added successfully! ==="
echo ""
echo "Summary:"
find "$BASE_DIR" -name "*.txt" -path "*/Teil0*/*.txt" -not -path "*/0[0-9]*/*" | wc -l | xargs echo "Main Teil txt files:"
find "$BASE_DIR" -name "*.txt" | wc -l | xargs echo "Total txt files:"
