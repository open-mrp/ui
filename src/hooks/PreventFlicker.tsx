"use client";

export default function PreventFlicker() {
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `
      (function() {
        try {
          var theme = null;
          var prefersDark = false;

          if (typeof globalThis !== 'undefined') {
            try {
              var g = globalThis;
              if (g && g.localStorage) {
                // Access inside try/catch in case localStorage is disabled or throws
                theme = g.localStorage.getItem('theme');
              }
            } catch {
              theme = null;
            }
          }

          if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
            prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          }
          
          if (typeof document !== 'undefined') {
            if (theme === 'dark' || (!theme && prefersDark)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
        } catch (e) {
          // Ignore errors in non-browser / restricted environments
        }
      })();
    `,
            }}
        />
    );
}
