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
