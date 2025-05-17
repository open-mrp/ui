#!/bin/sh

FILES="styles.css theme.css atom-one-dark.css"
SRC_DIR="src/styles"
ESM_DIR="dist/esm"
CJS_DIR="dist/cjs"

mkdir -p "$ESM_DIR" "$CJS_DIR"

for FILE in $FILES; do
  cp "$SRC_DIR/$FILE" "$ESM_DIR/$FILE"
  cp "$SRC_DIR/$FILE" "$CJS_DIR/$FILE"
  echo "✓ Copied $FILE to $ESM_DIR and $CJS_DIR"
done
