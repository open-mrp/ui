"use client";

export default function PreventFlicker() {
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `
      (function() {
        try {
          const theme = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;
          const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
          
          if (typeof document !== 'undefined') {
            if (theme === 'dark' || (!theme && prefersDark)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
        } catch (e) {
          // Ignore errors in SSR
        }
      })();
    `,
            }}
        />
    );
}
