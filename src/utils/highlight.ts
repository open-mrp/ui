import rehypeHighlight from 'rehype-highlight';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';

export async function highlightCode(code: string, language: string): Promise<string> {
  // Escape HTML entities in the code block to avoid accidental HTML parsing
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const result = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(`<pre><code class="language-${language}">${escaped}</code></pre>`);

  return result.toString();
}
