export interface LinkPattern {
    /** Matched against raw text between HTML tags (not inside `<...>`). */
    pattern: RegExp;
    /** Computes the URL for the matched text. */
    href: (match: string) => string;
    /** Optional tooltip on the anchor. */
    label?: string;
}

function escapeHtmlAttr(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;');
}

/** Shared styles for `<a>` injected into highlighted code (Tailwind v4 scans this file). */
export const CODE_EDITOR_LINK_CLASS =
    'code-editor-link cursor-pointer select-text rounded-sm px-0.5 -mx-0.5 -my-px underline underline-offset-2 decoration-current hover:text-blue-300 hover:decoration-blue-300 hover:bg-blue-400/15 active:bg-blue-400/20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 transition-[color,background-color,text-decoration-color] duration-150';

/** Default: http(s) URLs in code text. */
const DEFAULT_URL_PATTERN: LinkPattern = {
    pattern: /https?:\/\/[^\s<>"'`{}|\\^[\]]+/gi,
    href: (match) => match,
};

interface AnnotatedMatch {
    start: number;
    end: number;
    patternIndex: number;
    text: string;
    href: string;
    label?: string;
}

function withGlobalFlags(pattern: RegExp): RegExp {
    const flags = pattern.global ? pattern.flags : `${pattern.flags}g`;
    return new RegExp(pattern.source, flags);
}

function collectMatches(text: string, pattern: LinkPattern, patternIndex: number): AnnotatedMatch[] {
    const re = withGlobalFlags(pattern.pattern);
    const out: AnnotatedMatch[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
        const matched = m[0];
        out.push({
            start: m.index,
            end: m.index + matched.length,
            patternIndex,
            text: matched,
            href: pattern.href(matched),
            label: pattern.label,
        });
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
    }
    return out;
}

/**
 * From overlapping matches, pick a non-overlapping set. Later patterns in the
 * array win over earlier ones at the same start; otherwise prefer longer matches.
 */
function pickNonOverlapping(matches: AnnotatedMatch[]): AnnotatedMatch[] {
    const sorted = [...matches].sort((a, b) => {
        if (a.start !== b.start) return a.start - b.start;
        if (b.patternIndex !== a.patternIndex) return b.patternIndex - a.patternIndex;
        return b.end - b.start - (a.end - a.start);
    });

    const chosen: AnnotatedMatch[] = [];
    let cursor = 0;
    for (const m of sorted) {
        if (m.start < cursor) continue;
        chosen.push(m);
        cursor = m.end;
    }
    return chosen;
}

function applyPatternsToTextSegment(text: string, patterns: LinkPattern[]): string {
    if (!text || patterns.length === 0) return text;

    const all: AnnotatedMatch[] = [];
    patterns.forEach((p, i) => {
        all.push(...collectMatches(text, p, i));
    });
    if (all.length === 0) return text;

    const picks = pickNonOverlapping(all);
    if (picks.length === 0) return text;

    let result = '';
    let pos = 0;
    for (const m of picks) {
        result += text.slice(pos, m.start);
        const title = m.label ? ` title="${escapeHtmlAttr(m.label)}"` : '';
        result += `<a class="${CODE_EDITOR_LINK_CLASS}" href="${escapeHtmlAttr(m.href)}" target="_blank" rel="noopener noreferrer"${title}>${m.text}</a>`;
        pos = m.end;
    }
    result += text.slice(pos);
    return result;
}

/**
 * Walks HTML and wraps link patterns only in text nodes (between tags),
 * leaving tags and attributes untouched.
 */
export function applyLinkPatterns(html: string, linkPatterns?: LinkPattern[]): string {
    const patterns = [DEFAULT_URL_PATTERN, ...(linkPatterns ?? [])];
    let out = '';
    let i = 0;
    while (i < html.length) {
        if (html[i] === '<') {
            const end = html.indexOf('>', i);
            if (end === -1) {
                out += html.slice(i);
                break;
            }
            out += html.slice(i, end + 1);
            i = end + 1;
        } else {
            const start = i;
            while (i < html.length && html[i] !== '<') {
                i++;
            }
            out += applyPatternsToTextSegment(html.slice(start, i), patterns);
        }
    }
    return out;
}
