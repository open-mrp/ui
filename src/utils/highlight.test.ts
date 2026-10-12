import { highlightCode } from './highlight';

describe('highlightCode', () => {
    it('wraps highlighted code in a pre/code pair with the language class', async () => {
        const html = await highlightCode('const a = "x" < 3 && b;', 'typescript');

        expect(html).toBe(
            '<pre><code class="hljs language-typescript"><span class="hljs-keyword">const</span> a = <span class="hljs-string">"x"</span> &#x3C; <span class="hljs-number">3</span> &#x26;&#x26; b;</code></pre>',
        );
    });

    it('resolves language aliases', async () => {
        const html = await highlightCode('const a = 1', 'ts');

        expect(html).toContain('<span class="hljs-keyword">const</span>');
    });

    it('escapes code in languages it does not know', async () => {
        const html = await highlightCode('<b> & "q"', 'not-a-language');

        expect(html).toBe(
            '<pre><code class="hljs language-not-a-language">&#x3C;b> &#x26; "q"</code></pre>',
        );
    });
});
