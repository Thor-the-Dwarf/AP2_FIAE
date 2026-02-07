#!/bin/bash

# Script to create 5 empty JSON game files for each txt file in database
BASE_DIR="database"

echo "=== Creating empty JSON game files for all txt files ==="
echo ""

# Counter for statistics
total_json_created=0

# Find all txt files and create corresponding JSON files
while IFS= read -r txt_file; do
    # Get directory and filename without extension
    dir=$(dirname "$txt_file")
    filename=$(basename "$txt_file" .txt)
    
    # Skip if filename is empty or just whitespace
    if [ -z "$filename" ] || [ "$filename" = " " ]; then
        continue
    fi
    
    echo "Processing: $filename"
    
    # Create 5 JSON files with different game types
    # eg = Escape Game
    # mp = Matching Puzzle
    # qq = Quick Quiz
    # waw = Word Association Web
    # wbi = Word Blanks Interactive
    
    json_eg="${dir}/${filename} AP2eg01.json"
    json_mp="${dir}/${filename} AP2mp01.json"
    json_qq="${dir}/${filename} AP2qq01.json"
    json_waw="${dir}/${filename} AP2waw01.json"
    json_wbi="${dir}/${filename} AP2wbi01.json"
    
    # Create empty JSON files (only if they don't exist)
    for json_file in "$json_eg" "$json_mp" "$json_qq" "$json_waw" "$json_wbi"; do
        if [ ! -f "$json_file" ]; then
            echo "{}" > "$json_file"
            echo "  ✓ Created: $(basename "$json_file")"
            ((total_json_created++))
        else
            echo "  ⊘ Skipped (exists): $(basename "$json_file")"
        fi
    done
    
    echo ""
done < <(find "$BASE_DIR" -name "*.txt" -type f)

echo "=== JSON file creation complete! ==="
echo ""
echo "Statistics:"
echo "Total JSON files created: $total_json_created"
echo "Total txt files found: $(find "$BASE_DIR" -name "*.txt" -type f | wc -l | xargs)"
echo "Expected JSON files: $(($(find "$BASE_DIR" -name "*.txt" -type f | wc -l | xargs) * 5))"
echo ""
echo "Sample structure:"
find "$BASE_DIR/Teil01 - Grundlagen/01 Informieren und Beraten von Kunden und Kundinnen/01 Kommunikationsmodelle" -type f 2>/dev/null | head -10
