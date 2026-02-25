export interface FoldRegion {
    startLine: number;
    endLine: number;
}

/**
 * Finds foldable regions in code by matching bracket pairs that span multiple lines.
 * Respects strings and comments to avoid false matches.
 */
export function findFoldRegions(code: string): FoldRegion[] {
    const lines = code.split('\n');
    const regions: FoldRegion[] = [];
    const stack: { char: string; line: number }[] = [];

    const closers: Record<string, string> = { '{': '}', '[': ']', '(': ')' };
    const openers: Record<string, string> = { '}': '{', ']': '[', ')': '(' };

    let inMultiLineComment = false;
    let inString: string | null = null;

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx];
        let inSingleLineComment = false;
        let escaped = false;

        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            const next = line[i + 1];

            if (escaped) {
                escaped = false;
                continue;
            }
            if (ch === '\\' && inString) {
                escaped = true;
                continue;
            }

            if (inMultiLineComment) {
                if (ch === '*' && next === '/') {
                    inMultiLineComment = false;
                    i++;
                }
                continue;
            }
            if (inSingleLineComment) continue;

            if (inString) {
                if (ch === inString) inString = null;
                continue;
            }

            if (ch === '/' && next === '/') {
                inSingleLineComment = true;
                i++;
                continue;
            }
            if (ch === '/' && next === '*') {
                inMultiLineComment = true;
                i++;
                continue;
            }
            if (ch === '"' || ch === "'" || ch === '`') {
                inString = ch;
                continue;
            }

            if (ch in closers) {
                stack.push({ char: ch, line: lineIdx });
            } else if (ch in openers) {
                const expected = openers[ch];
                for (let j = stack.length - 1; j >= 0; j--) {
                    if (stack[j].char === expected) {
                        const startLine = stack[j].line;
                        stack.splice(j, 1);
                        if (lineIdx > startLine) {
                            regions.push({ startLine, endLine: lineIdx });
                        }
                        break;
                    }
                }
            }
        }
    }

    regions.sort((a, b) => a.startLine - b.startLine || b.endLine - a.endLine);
    return regions;
}
