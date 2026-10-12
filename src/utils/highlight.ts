import hljs from 'highlight.js/lib/common';
import arduino from 'highlight.js/lib/languages/arduino';

if (!hljs.getLanguage('arduino')) hljs.registerLanguage('arduino', arduino);

const ENTITIES: Record<string, string> = {
    '&amp;': '&#x26;',
    '&lt;': '&#x3C;',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
};

/** Escape HTML entities so raw code can't be parsed as markup. */
export function escapeHtml(code: string): string {
    return code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function encodeText(code: string): string {
    return code.replace(/&/g, '&#x26;').replace(/</g, '&#x3C;');
}

export async function highlightCode(code: string, language: string): Promise<string> {
    const body = hljs.getLanguage(language)
        ? hljs
              .highlight(code, { language, ignoreIllegals: true })
              .value.replace(/&(?:amp|lt|gt|quot|#x27);/g, (entity) => ENTITIES[entity] ?? entity)
        : encodeText(code);
    return `<pre><code class="hljs language-${language}">${body}</code></pre>`;
}
