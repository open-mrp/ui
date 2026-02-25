import { splitHighlightedLines } from './splitHighlightedLines';

describe('splitHighlightedLines', () => {
    it('splits plain text by newlines', () => {
        const html = '<pre><code class="hljs">line one\nline two\nline three</code></pre>';
        const lines = splitHighlightedLines(html);
        expect(lines).toEqual(['line one', 'line two', 'line three']);
    });

    it('handles spans within a single line', () => {
        const html =
            '<pre><code class="hljs"><span class="hljs-keyword">const</span> x = 1;</code></pre>';
        const lines = splitHighlightedLines(html);
        expect(lines).toEqual(['<span class="hljs-keyword">const</span> x = 1;']);
    });

    it('closes and re-opens spans across line boundaries', () => {
        const html =
            '<pre><code class="hljs"><span class="hljs-string">line one\nline two</span></code></pre>';
        const lines = splitHighlightedLines(html);
        expect(lines).toEqual([
            '<span class="hljs-string">line one</span>',
            '<span class="hljs-string">line two</span>',
        ]);
    });

    it('handles empty input', () => {
        const html = '<pre><code class="hljs"></code></pre>';
        const lines = splitHighlightedLines(html);
        expect(lines).toEqual(['']);
    });

    it('handles nested spans across lines', () => {
        const html =
            '<pre><code class="hljs"><span class="a"><span class="b">inner\nouter</span></span></code></pre>';
        const lines = splitHighlightedLines(html);
        expect(lines).toEqual([
            '<span class="a"><span class="b">inner</span></span>',
            '<span class="a"><span class="b">outer</span></span>',
        ]);
    });
});
