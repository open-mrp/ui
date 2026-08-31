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

    it('closes and re-opens <a> tags (injected by applyLinkPatterns) across line boundaries', () => {
        const html =
            '<pre><code class="hljs"><span class="hljs-string"><a href="/foo" class="link">line one\nline two</a></span></code></pre>';
        const lines = splitHighlightedLines(html);
        expect(lines).toEqual([
            '<span class="hljs-string"><a href="/foo" class="link">line one</a></span>',
            '<span class="hljs-string"><a href="/foo" class="link">line two</a></span>',
        ]);
    });

    it('produces a self-contained <a> when the anchor fits within a single line', () => {
        const html = '<pre><code class="hljs">"<a href="/bar">cu_abc123</a>"</code></pre>';
        const lines = splitHighlightedLines(html);
        expect(lines).toEqual(['"<a href="/bar">cu_abc123</a>"']);
    });
});
