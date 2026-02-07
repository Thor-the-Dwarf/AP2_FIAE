#!/bin/bash

# Script to restructure database folder into three main parts
# Based on ThemenGliederung.pdf structure

BASE_DIR="database"

echo "=== Restructuring database folder into three main parts ==="
echo ""

# Create the three main folders
echo "Creating main structure..."
mkdir -p "$BASE_DIR/Teil01 - Grundlagen"
mkdir -p "$BASE_DIR/Teil02 - FIEA spezifisch"
mkdir -p "$BASE_DIR/Teil03 - WISO"

# Move folders 01-05 to Teil01 - Grundlagen
echo ""
echo "Moving folders to Teil01 - Grundlagen..."
mv "$BASE_DIR/01 Informieren und Beraten von Kunden und Kundinnen" "$BASE_DIR/Teil01 - Grundlagen/" 2>/dev/null && echo "✓ Moved 01"
mv "$BASE_DIR/02 Entwickeln, Erstellen und Betreuen von IT-Lösungen" "$BASE_DIR/Teil01 - Grundlagen/" 2>/dev/null && echo "✓ Moved 02"
mv "$BASE_DIR/03 Durchführen und Dokumentieren von qualitätssichernden Maßnahmen" "$BASE_DIR/Teil01 - Grundlagen/" 2>/dev/null && echo "✓ Moved 03"
mv "$BASE_DIR/04 Umsetzen Integrieren und Prüfen von Maßnahmen zur IT-Sicherheit und zum Datenschutz" "$BASE_DIR/Teil01 - Grundlagen/" 2>/dev/null && echo "✓ Moved 04"
mv "$BASE_DIR/05 Erbringen von Serviceleistungen und Beauftragen von Dienstleistern" "$BASE_DIR/Teil01 - Grundlagen/" 2>/dev/null && echo "✓ Moved 05"

# Move folders 06-11 to Teil02 - FIEA spezifisch
echo ""
echo "Moving folders to Teil02 - FIEA spezifisch..."
mv "$BASE_DIR/06 Betreiben von IT-Systemen" "$BASE_DIR/Teil02 - FIEA spezifisch/" 2>/dev/null && echo "✓ Moved 06"
mv "$BASE_DIR/07 Planen eines Softwareproduktes" "$BASE_DIR/Teil02 - FIEA spezifisch/" 2>/dev/null && echo "✓ Moved 07"
mv "$BASE_DIR/08 Entwickeln und Umsetzen von Algorithmen" "$BASE_DIR/Teil02 - FIEA spezifisch/" 2>/dev/null && echo "✓ Moved 08"
mv "$BASE_DIR/09 Entwickeln von Anwendungen" "$BASE_DIR/Teil02 - FIEA spezifisch/" 2>/dev/null && echo "✓ Moved 09"
mv "$BASE_DIR/10 Sicherstellen der Qualität von Softwareanwendungen" "$BASE_DIR/Teil02 - FIEA spezifisch/" 2>/dev/null && echo "✓ Moved 10"
mv "$BASE_DIR/11 Bereitstellen von Softwareanwendungen" "$BASE_DIR/Teil02 - FIEA spezifisch/" 2>/dev/null && echo "✓ Moved 11"

# Create WISO structure based on PDF
echo ""
echo "Creating Teil03 - WISO structure..."

create_wiso_folder() {
    local path="$1"
    local content="$2"
    local txt_name=$(basename "$path")
    
    mkdir -p "$BASE_DIR/Teil03 - WISO/$path"
    echo "$content" > "$BASE_DIR/Teil03 - WISO/$path/${txt_name}.txt"
    echo "✓ Created: $path"
}

# Main WISO sections based on PDF
create_wiso_folder "01 Der Ausbildungsbetrieb" "Stellung, Rechtsform und Organisationsstruktur, Berufsbildung, Arbeits- und Tarifrecht"

create_wiso_folder "01 Der Ausbildungsbetrieb/01 Stellung Rechtsform und Organisationsstruktur" "Stellung des Ausbildungsbetriebes, Rechtsformen, Organisationsstruktur"

create_wiso_folder "01 Der Ausbildungsbetrieb/02 Berufsbildung Arbeits- und Tarifrecht" "Berufsbildungsgesetz, Ausbildungsvertrag, Arbeitsrecht, Tarifverträge, Kündigungsschutz"

create_wiso_folder "01 Der Ausbildungsbetrieb/03 Sicherheit und Gesundheitsschutz bei der Arbeit" "Arbeitsschutzgesetz, Unfallverhütungsvorschriften, Gefährdungsbeurteilung"

create_wiso_folder "01 Der Ausbildungsbetrieb/04 Umweltschutz" "Umweltschutzmaßnahmen, Ressourcenschonung, Abfallvermeidung"

create_wiso_folder "02 Geschäftsprozesse und betriebliche Organisation" "Betriebliche Organisation, Wertschöpfungskette, Marktorientierung"

create_wiso_folder "02 Geschäftsprozesse und betriebliche Organisation/01 Betriebliche Organisation und Wertschöpfungskette" "Aufbauorganisation, Ablauforganisation, Geschäftsprozesse, Wertschöpfungskette"

create_wiso_folder "02 Geschäftsprozesse und betriebliche Organisation/02 Marktorientierung und Vertrieb" "Marktanalyse, Marketing-Mix, Vertriebskanäle, Kundenbeziehungsmanagement"

create_wiso_folder "02 Geschäftsprozesse und betriebliche Organisation/03 Beschaffung und Logistik" "Beschaffungsprozess, Lieferantenauswahl, Lagerhaltung, Just-in-Time"

create_wiso_folder "03 Kaufmännische Steuerung und Kontrolle" "Rechnungswesen, Controlling, Finanzierung"

create_wiso_folder "03 Kaufmännische Steuerung und Kontrolle/01 Grundlagen des Rechnungswesens" "Buchführung, Bilanz, GuV, Kostenrechnung"

create_wiso_folder "03 Kaufmännische Steuerung und Kontrolle/02 Controlling und Finanzierung" "Controlling-Instrumente, Kennzahlen, Finanzierungsarten, Investitionsrechnung"

echo ""
echo "=== Restructuring complete! ==="
echo ""
echo "New structure:"
find "$BASE_DIR" -maxdepth 2 -type d | sort
echo ""
echo "Verification:"
echo "Teil01 folders: $(find "$BASE_DIR/Teil01 - Grundlagen" -maxdepth 1 -type d | tail -n +2 | wc -l)"
echo "Teil02 folders: $(find "$BASE_DIR/Teil02 - FIEA spezifisch" -maxdepth 1 -type d | tail -n +2 | wc -l)"
echo "Teil03 folders: $(find "$BASE_DIR/Teil03 - WISO" -maxdepth 1 -type d | tail -n +2 | wc -l)"
echo "Total txt files: $(find "$BASE_DIR" -name "*.txt" | wc -l)"
