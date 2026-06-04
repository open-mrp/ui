import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import CodeEditor from './CodeEditor';

const meta = {
    component: CodeEditor,
    title: 'Code/CodeEditor',
    tags: ['autodocs'],
} satisfies Meta<typeof CodeEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const JavaScript: Story = {
    args: {
        children: (
            <code className="language-javascript">
                {`// Function with template literals and arrow functions
const greet = (name) => {
  const message = \`Hello, \${name}!\`;
  return message;
};

// Using the function
const result = greet("World");
console.log(result); // Hello, World!`}
            </code>
        ),
    },
};

export const TypeScript: Story = {
    args: {
        children: (
            <code className="language-typescript">
                {`// Interface definition
interface User {
  name: string;
  age: number;
  email?: string;  // Optional property
}

// Type with generics
type Response<T> = {
  data: T;
  status: number;
};

// Using the types
const user: User = {
  name: "John",
  age: 30
};

const response: Response<User> = {
  data: user,
  status: 200
};`}
            </code>
        ),
    },
};

export const Python: Story = {
    args: {
        children: (
            <code className="language-python">
                {`# Fibonacci sequence with type hints
from typing import List

def fibonacci(n: int) -> List[int]:
    """
    Generate Fibonacci sequence up to n terms
    """
    sequence = []
    a, b = 0, 1

    for _ in range(n):
        sequence.append(a)
        a, b = b, a + b

    return sequence

# Using the function
result = fibonacci(10)
print(f"First 10 Fibonacci numbers: {result}")`}
            </code>
        ),
    },
};

export const LineWrapping: Story = {
    name: 'Line Wrapping',
    args: {
        height: 220,
        children: (
            <code className="language-typescript">
                {`import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface CreateOrderPayload {
  customerId: string;
  items: Array<{ productId: string; quantity: number; unitPrice: number; discount?: number; metadata?: Record<string, string> }>;
  shippingAddress: { street: string; city: string; state: string; zip: string; country: string };
  billingAddress: { street: string; city: string; state: string; zip: string; country: string };
  notes?: string;
}

// This function has a very long signature that should demonstrate line wrapping in the code editor component
async function createOrderWithValidationAndRetry(payload: CreateOrderPayload, options: { maxRetries: number; retryDelay: number; validateInventory: boolean; sendConfirmationEmail: boolean }): Promise<{ orderId: string; status: string; estimatedDelivery: Date }> {
  const response = await fetch('/api/v2/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Request-Id': crypto.randomUUID(), 'X-Idempotency-Key': \`order-\${payload.customerId}-\${Date.now()}\` },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(\`Order creation failed: \${response.status} \${response.statusText} - \${await response.text()}\`);
  }

  return response.json();
}`}
            </code>
        ),
    },
};

export const FixedHeightScrolling: Story = {
    name: 'Fixed Height (Scrolling)',
    args: {
        height: 200,
        children: (
            <code className="language-typescript">
                {`// This example is intentionally long to demonstrate vertical scrolling
type Item = {
  id: string;
  name: string;
  description: string;
  quantity: number;
};

function createItems(count: number): Item[] {
  const items: Item[] = [];
  for (let i = 0; i < count; i++) {
    items.push({
      id: \`item-\${i}\`,
      name: \`Item \${i}\`,
      description: 'A long description that makes each line wrap and take up vertical space in the editor.',
      quantity: i * 10,
    });
  }
  return items;
}

const items = createItems(50);

for (const item of items) {
  console.log(item.id, item.name, item.quantity);
}`}
            </code>
        ),
    },
};

export const NoLanguageLabel: Story = {
    name: 'No Language Label',
    args: {
        showLanguageLabel: false,
        height: 220,
        children: (
            <code className="language-javascript">
                {`// Copy button still works, but the language label is hidden
function add(a, b) {
  return a + b;
}

console.log(add(1, 2));`}
            </code>
        ),
    },
};

export const CalcHeightNoLanguageLabel: Story = {
    name: 'Calc Height (No Language Label)',
    render: (args) => (
        <div style={{ height: '252px', display: 'flex', alignItems: 'stretch' }}>
            <CodeEditor {...args} />
        </div>
    ),
    args: {
        showLanguageLabel: false,
        height: 'calc(100% - 12px)',
        className: '!mt-0',
        children: (
            <code className="language-javascript">
                {`// Uses calc(100% - 12px) to ensure CSS calc strings work.
// This should keep the scroll area sized correctly when embedded.
const longList = Array.from({ length: 80 }, (_, i) => i);
console.log(longList.join(', '));`}
            </code>
        ),
    },
};

export const HeightWithMaxHeightCap: Story = {
    name: 'Height + MaxHeight Cap',
    args: {
        showLanguageLabel: false,
        height: 280,
        maxHeight: 200,
        className: '!mt-0',
        children: (
            <code className="language-typescript">
                {`type Row = { id: string; value: string };
const rows: Row[] = [];
for (let i = 0; i < 120; i++) {
  rows.push({ id: String(i), value: 'Row ' + i });
}
console.log(rows.length);`}
            </code>
        ),
    },
};

export const MaxHeightOnly: Story = {
    name: 'MaxHeight Only (No Fixed Height)',
    render: (args) => (
        <div style={{ height: 260, display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 20 }} />
            <div style={{ flex: 1, minHeight: 0 }}>
                <CodeEditor {...args} />
            </div>
        </div>
    ),
    args: {
        showLanguageLabel: false,
        maxHeight: 180,
        className: '!mt-0',
        children: (
            <code className="language-javascript">
                {`// No fixed height: maxHeight should cap scroll area.
const items = Array.from({ length: 200 }, (_, i) => i);
console.log(items.slice(0, 10));`}
            </code>
        ),
    },
};

export const ShortenedApiKey: Story = {
    name: 'Shortened API Key (display vs copy)',
    args: {
        replacements: {
            YOUR_API_KEY: {
                display: 'sk_test_abc...xyz',
                copy: 'sk_test_abcdef1234567890ghijklmnopqrstuvwxyz',
            },
        },
        children: (
            <code className="language-bash">
                {`# The rendered snippet shows a shortened key for readability.
# Hover and click the copy button to get the full key on your clipboard.
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.example.com/v1/orders`}
            </code>
        ),
    },
};

export const MixedReplacements: Story = {
    name: 'Mixed Replacements (string + display/copy)',
    args: {
        replacements: {
            YOUR_API_KEY: {
                display: 'sk_test_abc...xyz',
                copy: 'sk_test_abcdef1234567890ghijklmnopqrstuvwxyz',
            },
            API_HOST: 'https://api.example.com',
        },
        children: (
            <code className="language-bash">
                {`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  API_HOST/v1/orders`}
            </code>
        ),
    },
};

export const AutoLinkedUrls: Story = {
    name: 'Auto-linked URLs',
    parameters: {
        docs: {
            description: {
                story: 'HTTP and HTTPS URLs in the snippet are turned into links that open in a new tab. No `linkPatterns` prop is required.',
            },
        },
    },
    args: {
        height: 260,
        children: (
            <code className="language-json">
                {`{
  "documentation": "https://docs.example.com/api",
  "callback": "https://app.example.com/webhooks/inbound",
  "legacy_endpoint": "http://internal.example.local/health"
}`}
            </code>
        ),
    },
};

export const CustomLinkPatterns: Story = {
    name: 'Custom linkPatterns (IDs)',
    parameters: {
        docs: {
            description: {
                story: 'Pass `linkPatterns` to match prefixed IDs (or any regex) and map them to dashboard URLs. URLs are still linked automatically.',
            },
        },
    },
    args: {
        height: 280,
        linkPatterns: [
            {
                pattern: /\bcust_[A-Za-z0-9]+\b/g,
                href: (id) => `/customers/${id}`,
                label: 'View customer',
            },
            {
                pattern: /\bord_[A-Za-z0-9]+\b/g,
                href: (id) => `/orders/${id}`,
                label: 'View order',
            },
        ],
        children: (
            <code className="language-json">
                {`{
  "customer_id": "cust_a1b2c3",
  "order_id": "ord_xyz789",
  "note": "See cust_a1b2c3 for billing profile."
}`}
            </code>
        ),
    },
};

export const UrlsAndCustomIds: Story = {
    name: 'URLs + custom IDs together',
    args: {
        height: 320,
        linkPatterns: [
            {
                pattern: /\bcust_[A-Za-z0-9]+\b/g,
                href: (id) => `/customers/${id}`,
                label: 'Open customer',
            },
        ],
        children: (
            <code className="language-json">
                {`{
  "customer_id": "cust_9f3k2j",
  "invoice_pdf": "https://files.example.com/invoices/cust_9f3k2j/latest.pdf",
  "support_url": "https://help.example.com/contact",
  "detail": "Customer cust_9f3k2j also has docs at https://docs.example.com/billing"
}`}
            </code>
        ),
    },
};

function generateLargeSnippet(lineCount: number): string {
    const lines: string[] = [
        '// Auto-generated module — scroll to see windowed (virtualized) rendering.',
        '',
    ];
    for (let i = 0; i < lineCount; i++) {
        lines.push(
            `export function handler_${i}(input: { id: string; index: number }): { id: string; squared: number } {`,
            `  const squared = ${i} * input.index; // line ${i} of a very large file`,
            '  return { id: input.id, squared };',
            '}',
            '',
        );
    }
    return lines.join('\n');
}

export const LargeVirtualized: Story = {
    name: 'Large payload (virtualized)',
    parameters: {
        docs: {
            description: {
                story: 'A multi-thousand-line snippet. Above `virtualizeThreshold` (default 500 lines) only the visible lines are mounted, so scrolling stays smooth. Folding still works (it collapses instantly in this mode rather than animating).',
            },
        },
    },
    args: {
        height: 400,
        // ~5,000 lines (> virtualizeThreshold) but still under lazyHighlightThreshold,
        // so this shows full-document highlighting with windowed rendering.
        children: <code className="language-typescript">{generateLargeSnippet(1000)}</code>,
    },
};

export const HugePayloadViewportHighlight: Story = {
    name: 'Huge payload (viewport highlighting)',
    parameters: {
        docs: {
            description: {
                story: 'A payload over `lazyHighlightThreshold` (default 500,000 chars). The whole document is not highlighted up front — visible lines render as plain text and are colorized on demand as you scroll, keeping the main thread responsive. (`lazyHighlightThreshold` is lowered here so the modest demo payload triggers the mode.)',
            },
        },
    },
    args: {
        height: 400,
        lazyHighlightThreshold: 1000,
        children: <code className="language-typescript">{generateLargeSnippet(2000)}</code>,
    },
};

export const NestedBlocks: Story = {
    name: 'Nested Blocks (Folding)',
    args: {
        children: (
            <code className="language-typescript">
                {`import { useState, useEffect } from 'react';

interface ApiResponse<T> {
  data: T;
  error: string | null;
  loading: boolean;
}

function useFetch<T>(url: string): ApiResponse<T> {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null as T,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(\`HTTP \${response.status}\`);
        }

        const data = await response.json();
        setState({ data, error: null, loading: false });
      } catch (err) {
        if (err instanceof Error) {
          setState({
            data: null as T,
            error: err.message,
            loading: false,
          });
        }
      }
    }

    fetchData();
    return () => controller.abort();
  }, [url]);

  return state;
}

export default useFetch;`}
            </code>
        ),
    },
};
