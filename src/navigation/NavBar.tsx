"use client";

import { ReactNode } from "react";

export interface NavbarProps {
  className?: string;
  children: ReactNode;
}

export default function Navbar({ children, className = "" }: NavbarProps) {
  return (
    <header className={className}>
      <nav className="flex items-center justify-between px-4 py-3 w-full max-w-7xl mx-auto">
        {children}
      </nav>
    </header>
  );
}
