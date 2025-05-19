"use client";

export default function PreventFlicker() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
      (function() {
        const theme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (theme === 'dark' || (!theme && prefersDark)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      })();
    `,
      }}
    />
  );
}
