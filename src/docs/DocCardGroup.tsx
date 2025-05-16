import React from "react";

export interface DocCardGroupProps {
  children: React.ReactNode;
}

export default function DocCardGroup({ children }: DocCardGroupProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-6">
      {children}
    </div>
  );
}
