function getTagName(openTag: string): string {
    const m = openTag.match(/^<(\w+)/);
    return m ? m[1] : 'span';
}

/**
 * Splits highlighted HTML into individual lines with valid, self-contained HTML per line.
 * Handles spans (and any other elements, e.g. <a> injected by applyLinkPatterns) that cross
 * line boundaries by closing them at line ends and re-opening them at the start of the next line.
 */
export function splitHighlightedLines(html: string): string[] {
    // Extract content from <code>...</code> wrapper
    const codeMatch = html.match(/<code[^>]*>([\s\S]*)<\/code>/);
    const content = codeMatch ? codeMatch[1] : html;

    const lines: string[] = [];
    let currentLine = '';
    const tagStack: string[] = [];

    let i = 0;
    while (i < content.length) {
        if (content[i] === '\n') {
            const closing = [...tagStack].reverse().map(t => `</${getTagName(t)}>`).join('');
            lines.push(currentLine + closing);
            currentLine = tagStack.join('');
            i++;
        } else if (content[i] === '<') {
            const tagEnd = content.indexOf('>', i);
            if (tagEnd === -1) {
                currentLine += content[i];
                i++;
                continue;
            }
            const tag = content.substring(i, tagEnd + 1);

            if (tag.startsWith('</')) {
                tagStack.pop();
            } else if (!tag.endsWith('/>')) {
                tagStack.push(tag);
            }
            currentLine += tag;
            i = tagEnd + 1;
        } else {
            currentLine += content[i];
            i++;
        }
    }

    if (currentLine || lines.length === 0) {
        const closing = [...tagStack].reverse().map(t => `</${getTagName(t)}>`).join('');
        lines.push(currentLine + closing);
    }

    return lines;
}
