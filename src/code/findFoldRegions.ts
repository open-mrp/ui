export interface FoldRegion {
    startLine: number;
    endLine: number;
    type: 'bracket' | 'indent';
}

/**
 * Finds foldable regions in code by matching bracket pairs that span multiple lines.
 * For indentation-based languages (Python), also detects blocks opened by `:`.
 * Respects strings and comments to avoid false matches.
 */
export function findFoldRegions(code: string, language?: string): FoldRegion[] {
    const lines = code.split('\n');
    const regions: FoldRegion[] = [];

    findBracketRegions(lines, regions);

    if (language === 'python' || language === 'py') {
        findIndentRegions(lines, regions);
    }

    regions.sort((a, b) => a.startLine - b.startLine || b.endLine - a.endLine);
    return regions;
}

function findBracketRegions(lines: string[], regions: FoldRegion[]): void {
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
            if (ch === '#') {
                inSingleLineComment = true;
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
                            regions.push({ startLine, endLine: lineIdx, type: 'bracket' });
                        }
                        break;
                    }
                }
            }
        }
    }
}

function getIndent(line: string): number {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
}

function findIndentRegions(lines: string[], regions: FoldRegion[]): void {
    for (let i = 0; i < lines.length; i++) {
        const stripped = lines[i].replace(/#.*$/, '').trimEnd();
        if (!stripped.endsWith(':')) continue;

        const baseIndent = getIndent(lines[i]);
        let lastContentLine = i;

        for (let j = i + 1; j < lines.length; j++) {
            if (lines[j].trim() === '') continue;
            if (getIndent(lines[j]) > baseIndent) {
                lastContentLine = j;
            } else {
                break;
            }
        }

        if (lastContentLine > i) {
            regions.push({ startLine: i, endLine: lastContentLine, type: 'indent' });
        }
    }
}
